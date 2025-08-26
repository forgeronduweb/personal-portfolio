const nodemailer = require('nodemailer');

// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // ou autre service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Template d'email pour devis
const createQuoteEmailTemplate = (request, quote) => {
  return {
    subject: `Devis pour votre projet ${request.projectType} - ${request.companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Devis pour votre projet web</h2>
        
        <p>Bonjour,</p>
        
        <p>Merci pour votre demande de ${request.projectType} pour ${request.companyName}.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Détails du devis</h3>
          <p><strong>Montant:</strong> ${quote.amount} FCFA</p>
          <p><strong>Description:</strong></p>
          <p style="white-space: pre-line;">${quote.description}</p>
        </div>
        
        <p>Ce devis est valable 30 jours. N'hésitez pas à me contacter si vous avez des questions.</p>
        
        <p>Cordialement,<br>
        L'équipe de développement</p>
      </div>
    `
  };
};

// Fonction pour envoyer un devis par email
const sendQuoteEmail = async (request, quote) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = createQuoteEmailTemplate(request, quote);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: request.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email envoyé:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendQuoteEmail
};
