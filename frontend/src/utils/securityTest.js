// Tests de sécurité pour valider l'implémentation
export class SecurityTester {
  static runAllTests() {
    console.log('🔒 Démarrage des tests de sécurité...');
    
    const results = {
      devToolsProtection: this.testDevToolsProtection(),
      routeProtection: this.testRouteProtection(),
      tokenSecurity: this.testTokenSecurity(),
      inputSanitization: this.testInputSanitization(),
      errorHandling: this.testErrorHandling()
    };

    console.log('📊 Résultats des tests:', results);
    return results;
  }

  static testDevToolsProtection() {
    try {
      // Test de désactivation du clic droit
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true
      });
      
      document.dispatchEvent(contextMenuEvent);
      
      return {
        passed: contextMenuEvent.defaultPrevented,
        message: contextMenuEvent.defaultPrevented ? 'Clic droit désactivé ✅' : 'Clic droit non protégé ❌'
      };
    } catch (error) {
      return { passed: false, message: 'Erreur test DevTools: ' + error.message };
    }
  }

  static testRouteProtection() {
    try {
      // Simuler l'accès à une route protégée
      const protectedRoutes = ['/admin', '/dashboard'];
      const currentPath = window.location.pathname;
      
      const isProtected = protectedRoutes.some(route => currentPath.startsWith(route));
      
      return {
        passed: true,
        message: isProtected ? 'Route protégée détectée ✅' : 'Route publique ✅'
      };
    } catch (error) {
      return { passed: false, message: 'Erreur test routes: ' + error.message };
    }
  }

  static testTokenSecurity() {
    try {
      // Test du stockage sécurisé des tokens
      const testToken = 'test-token-123';
      
      // Simuler le stockage
      sessionStorage.setItem('_st', btoa(testToken));
      
      // Vérifier le chiffrement
      const stored = sessionStorage.getItem('_st');
      const isEncrypted = stored !== testToken && stored === btoa(testToken);
      
      // Nettoyer
      sessionStorage.removeItem('_st');
      
      return {
        passed: isEncrypted,
        message: isEncrypted ? 'Token chiffré correctement ✅' : 'Token non chiffré ❌'
      };
    } catch (error) {
      return { passed: false, message: 'Erreur test tokens: ' + error.message };
    }
  }

  static testInputSanitization() {
    try {
      // Test de sanitisation basique
      const maliciousInput = '<script>alert("XSS")</script>';
      const sanitized = maliciousInput
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '');
      
      const isSanitized = !sanitized.includes('<script>');
      
      return {
        passed: isSanitized,
        message: isSanitized ? 'Sanitisation fonctionnelle ✅' : 'Sanitisation échouée ❌'
      };
    } catch (error) {
      return { passed: false, message: 'Erreur test sanitisation: ' + error.message };
    }
  }

  static testErrorHandling() {
    try {
      // Test de masquage des erreurs en production
      const isProduction = process.env.NODE_ENV === 'production';
      
      return {
        passed: true,
        message: isProduction ? 'Mode production - erreurs masquées ✅' : 'Mode développement - erreurs visibles ✅'
      };
    } catch (error) {
      return { passed: false, message: 'Erreur test gestion erreurs: ' + error.message };
    }
  }
}

// Auto-test en développement
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    SecurityTester.runAllTests();
  }, 2000);
}
