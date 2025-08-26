const mongoose = require('mongoose');
const User = require('../models/User');
const SiteRequest = require('../models/SiteRequest');
const Newsletter = require('../models/Newsletter');
const Prospect = require('../models/Prospect');

// Configuration de la base de données
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-portfolio');
    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

// Fonction pour extraire la valeur numérique du budget
const extractBudgetValue = (budgetString) => {
  if (!budgetString) return 0;
  
  const budgetMap = {
    '150000-300000': 225000,
    '300000-600000': 450000,
    '600000-1000000': 800000,
    '1000000-2000000': 1500000,
    '2000000+': 2500000,
    'flexible': 500000
  };
  
  return budgetMap[budgetString] || 0;
};

// Fonction pour déterminer le statut d'un prospect basé sur les données existantes
const determineProspectStatus = (siteRequest, user) => {
  // Si l'utilisateur est premium = client confirmé
  if (user && user.isPremium) {
    return 'client';
  }
  
  // Si la demande de site a un devis envoyé
  if (siteRequest.quote && siteRequest.quote.sentAt) {
    if (siteRequest.status === 'completed') {
      return 'client';
    } else if (siteRequest.status === 'in_progress') {
      return 'negotiation';
    } else {
      return 'qualified';
    }
  }
  
  // Si la demande est en cours
  if (siteRequest.status === 'in_progress') {
    return 'interested';
  }
  
  // Nouveau prospect par défaut
  return 'new';
};

// Fonction pour déterminer la source du prospect
const determineProspectSource = (siteRequest, newsletterSub, user) => {
  // Si l'utilisateur s'est inscrit sur le site
  if (user) {
    return 'website_registration';
  }
  
  // Si c'est une demande de devis directe
  if (siteRequest) {
    return 'website_quote';
  }
  
  // Si c'est juste une inscription newsletter
  if (newsletterSub) {
    return 'newsletter';
  }
  
  return 'unknown';
};

// Script principal de synchronisation
const syncExistingData = async () => {
  try {
    await connectDB();
    
    console.log('🔄 Début de la synchronisation des données existantes...\n');
    
    // 1. Récupérer toutes les données existantes
    const [users, siteRequests, newsletters] = await Promise.all([
      User.find({}),
      SiteRequest.find({}),
      Newsletter.find({ isActive: true })
    ]);
    
    console.log(`📊 Données trouvées:`);
    console.log(`   - Utilisateurs: ${users.length}`);
    console.log(`   - Demandes de sites: ${siteRequests.length}`);
    console.log(`   - Abonnés newsletter: ${newsletters.length}\n`);
    
    // 2. Créer une map des emails pour éviter les doublons
    const prospectEmails = new Set();
    const prospectsToCreate = [];
    
    // 3. Traiter les demandes de sites (priorité haute - prospects qualifiés)
    console.log('🎯 Traitement des demandes de sites...');
    for (const request of siteRequests) {
      if (prospectEmails.has(request.email)) continue;
      
      // Chercher l'utilisateur correspondant
      const user = users.find(u => u.email === request.email);
      
      const prospect = {
        email: request.email,
        companyName: request.companyName,
        projectType: request.projectType,
        budget: request.budget,
        timeline: request.timeline,
        description: request.additionalInfo || '',
        source: determineProspectSource(request, null, user),
        status: determineProspectStatus(request, user),
        siteRequestId: request._id,
        estimatedValue: extractBudgetValue(request.budget),
        interactions: [],
        createdAt: request.createdAt,
        updatedAt: request.updatedAt
      };
      
      // Ajouter une interaction initiale basée sur la demande
      prospect.interactions.push({
        type: 'quote_request',
        description: `Demande de devis pour ${request.projectType} - Budget: ${request.budget}`,
        date: request.createdAt,
        outcome: request.status === 'completed' ? 'positive' : 
                request.status === 'cancelled' ? 'negative' : 'neutral'
      });
      
      // Si un devis a été envoyé, ajouter cette interaction
      if (request.quote && request.quote.sentAt) {
        prospect.interactions.push({
          type: 'quote_sent',
          description: `Devis envoyé: ${request.quote.amount} ${request.quote.currency}`,
          date: request.quote.sentAt,
          outcome: request.status === 'completed' ? 'positive' : 'neutral'
        });
      }
      
      prospectsToCreate.push(prospect);
      prospectEmails.add(request.email);
    }
    
    // 4. Traiter les utilisateurs premium sans demande de site
    console.log('💎 Traitement des utilisateurs premium...');
    for (const user of users.filter(u => u.isPremium)) {
      if (prospectEmails.has(user.email)) continue;
      
      const prospect = {
        email: user.email,
        companyName: user.name, // Utiliser le nom comme nom d'entreprise par défaut
        source: 'website_registration',
        status: 'client', // Premium = client
        estimatedValue: 500000, // Valeur par défaut pour les clients premium
        interactions: [{
          type: 'registration',
          description: 'Inscription sur le site et passage premium',
          date: user.createdAt,
          outcome: 'positive'
        }],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      prospectsToCreate.push(prospect);
      prospectEmails.add(user.email);
    }
    
    // 5. Traiter les abonnés newsletter restants
    console.log('📧 Traitement des abonnés newsletter...');
    for (const newsletter of newsletters) {
      if (prospectEmails.has(newsletter.email)) continue;
      
      const prospect = {
        email: newsletter.email,
        source: 'newsletter',
        status: 'new', // Juste intéressé par les news
        estimatedValue: 0,
        interactions: [{
          type: 'newsletter_subscription',
          description: 'Inscription à la newsletter',
          date: newsletter.createdAt,
          outcome: 'neutral'
        }],
        createdAt: newsletter.createdAt,
        updatedAt: newsletter.updatedAt
      };
      
      prospectsToCreate.push(prospect);
      prospectEmails.add(newsletter.email);
    }
    
    // 6. Sauvegarder tous les prospects
    console.log(`\n💾 Création de ${prospectsToCreate.length} prospects...`);
    
    let createdCount = 0;
    let errorCount = 0;
    
    for (const prospectData of prospectsToCreate) {
      try {
        const prospect = new Prospect(prospectData);
        await prospect.save();
        createdCount++;
        
        if (createdCount % 10 === 0) {
          console.log(`   ✅ ${createdCount} prospects créés...`);
        }
      } catch (error) {
        errorCount++;
        console.error(`   ❌ Erreur pour ${prospectData.email}:`, error.message);
      }
    }
    
    // 7. Statistiques finales
    console.log(`\n📈 Synchronisation terminée:`);
    console.log(`   ✅ Prospects créés: ${createdCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    
    // Afficher les statistiques par statut
    const stats = await Prospect.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log(`\n📊 Répartition par statut:`);
    stats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count}`);
    });
    
    // Afficher les statistiques par source
    const sourceStats = await Prospect.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log(`\n📊 Répartition par source:`);
    sourceStats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count}`);
    });
    
    console.log(`\n🎉 Synchronisation réussie! Vos données marketing sont maintenant prêtes.`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  syncExistingData();
}

module.exports = { syncExistingData };
