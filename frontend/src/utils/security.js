// ===== SYSTÈME DE SÉCURITÉ FRONTEND =====

class SecurityManager {
  constructor() {
    this.isDevToolsOpen = false;
    this.devToolsCheckInterval = null;
    this.isProduction = process.env.NODE_ENV === 'production';
    this.init();
  }

  init() {
    if (this.isProduction) {
      this.disableDevTools();
      this.startDevToolsDetection();
      this.disableContextMenu();
      this.disableKeyboardShortcuts();
      this.preventConsoleAccess();
    }
  }

  // 1. DÉSACTIVATION DES DEVTOOLS
  disableDevTools() {
    // Désactiver le clic droit
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showSecurityWarning('Accès non autorisé détecté');
      return false;
    });

    // Désactiver la sélection de texte
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });

    // Désactiver le glisser-déposer
    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });
  }

  // 2. DÉTECTION D'OUVERTURE DES DEVTOOLS
  startDevToolsDetection() {
    // Méthode 1: Détection par taille de fenêtre
    let devtools = {
      open: false,
      orientation: null
    };

    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.onDevToolsOpen();
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Méthode 2: Détection par console.log timing
    let start = performance.now();
    let check = () => {
      let end = performance.now();
      if (end - start > 100) {
        this.onDevToolsOpen();
      }
      start = performance.now();
    };

    // Méthode 3: Détection par debugger
    let element = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        this.onDevToolsOpen();
      }
    });

    setInterval(() => {
      console.log('%c', element);
      check();
    }, 1000);
  }

  onDevToolsOpen() {
    if (this.isProduction && !this.isDevToolsOpen) {
      this.isDevToolsOpen = true;
      
      // Actions à déclencher
      this.showSecurityWarning('Outils de développement détectés');
      
      // Option 1: Redirection
      // window.location.href = '/';
      
      // Option 2: Masquer le contenu
      document.body.style.display = 'none';
      
      // Option 3: Overlay de sécurité
      this.showSecurityOverlay();
    }
  }

  // 3. DÉSACTIVATION DES RACCOURCIS CLAVIER
  disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        this.showSecurityWarning('Raccourci désactivé');
        return false;
      }

      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        this.showSecurityWarning('Raccourci désactivé');
        return false;
      }

      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        this.showSecurityWarning('Raccourci désactivé');
        return false;
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        this.showSecurityWarning('Raccourci désactivé');
        return false;
      }

      // Ctrl+Shift+C (Element Inspector)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.showSecurityWarning('Raccourci désactivé');
        return false;
      }

      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.showSecurityWarning('Raccourci désactivé');
        return false;
      }
    });
  }

  // 4. PROTECTION DE LA CONSOLE
  preventConsoleAccess() {
    // Redéfinir console.log pour masquer les messages sensibles
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      if (this.isProduction) {
        // Ne rien afficher en production
        return;
      }
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      if (this.isProduction) {
        // Afficher un message générique
        originalError('Une erreur s\'est produite');
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      if (this.isProduction) {
        return;
      }
      originalWarn.apply(console, args);
    };

    // Masquer les erreurs globales
    window.addEventListener('error', (e) => {
      if (this.isProduction) {
        e.preventDefault();
        return false;
      }
    });
  }

  // 5. AFFICHAGE DES AVERTISSEMENTS
  showSecurityWarning(message) {
    if (this.isProduction) {
      // Créer une notification discrète
      const warning = document.createElement('div');
      warning.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
      `;
      warning.textContent = message;
      document.body.appendChild(warning);

      setTimeout(() => {
        if (warning.parentNode) {
          warning.parentNode.removeChild(warning);
        }
      }, 3000);
    }
  }

  showSecurityOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'security-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: Arial, sans-serif;
    `;
    
    overlay.innerHTML = `
      <div style="text-align: center;">
        <h2>🔒 Accès Restreint</h2>
        <p>Les outils de développement ne sont pas autorisés sur cette application.</p>
        <button onclick="window.location.reload()" style="
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        ">Recharger la page</button>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  // 6. NETTOYAGE
  destroy() {
    if (this.devToolsCheckInterval) {
      clearInterval(this.devToolsCheckInterval);
    }
  }
}

// ===== PROTECTION DES ROUTES =====
export class RouteProtection {
  static protectedRoutes = ['/admin', '/dashboard'];
  static adminRoutes = ['/admin'];

  static checkRouteAccess(path, userRole = null) {
    // Vérifier si la route est protégée
    if (this.protectedRoutes.some(route => path.startsWith(route))) {
      const token = this.getSecureToken();
      
      if (!token) {
        this.redirectToHome();
        return false;
      }

      // Vérifier les routes admin
      if (this.adminRoutes.some(route => path.startsWith(route))) {
        if (userRole !== 'admin') {
          this.redirectToHome();
          return false;
        }
      }
    }

    return true;
  }

  static getSecureToken() {
    // Récupérer le token de manière sécurisée
    try {
      const encryptedToken = sessionStorage.getItem('_st');
      if (!encryptedToken) return null;
      
      // Déchiffrer le token (implémentation basique)
      return atob(encryptedToken);
    } catch {
      return null;
    }
  }

  static setSecureToken(token) {
    // Stocker le token de manière sécurisée
    try {
      const encryptedToken = btoa(token);
      sessionStorage.setItem('_st', encryptedToken);
    } catch (error) {
      console.error('Erreur lors du stockage du token');
    }
  }

  static redirectToHome() {
    window.location.href = '/';
  }

  static clearSecureData() {
    sessionStorage.removeItem('_st');
    localStorage.removeItem('user');
  }
}

// ===== UTILITAIRES DE SÉCURITÉ =====
export class SecurityUtils {
  // Obfuscation basique des données sensibles
  static obfuscateData(data) {
    if (typeof data === 'string') {
      return data.replace(/./g, '*');
    }
    return '***';
  }

  // Validation côté client (ne remplace pas la validation serveur)
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  // Génération d'un ID de session sécurisé
  static generateSessionId() {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Vérification de l'intégrité des données
  static verifyDataIntegrity(data, expectedHash) {
    // Implémentation basique - à améliorer avec une vraie fonction de hash
    const dataString = JSON.stringify(data);
    const hash = btoa(dataString).slice(0, 16);
    return hash === expectedHash;
  }
}

// Initialisation automatique
const securityManager = new SecurityManager();

export default securityManager;
export { SecurityManager };
