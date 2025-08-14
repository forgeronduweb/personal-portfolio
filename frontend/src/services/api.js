import { AuthError } from './errors';

const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new AuthError(
            data.message || "Une erreur s'est produite",
            response.status
        );
    }
    return data;
};

// Service d'authentification
export const authService = {
    // Inscription
    async register(userData) {
        try {
            console.log('Envoi des données d\'inscription:', userData);
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData),
            });
            
            const data = await handleResponse(response);
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            if (error instanceof AuthError) {
                if (error.statusCode === 400) {
                    throw new Error('Email déjà utilisé ou données invalides');
                }
            }
            throw error;
        }
    },

    // Connexion
    async login(credentials) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            
            const data = await handleResponse(response);
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            if (error instanceof AuthError) {
                if (error.statusCode === 401) {
                    throw new Error('Email ou mot de passe incorrect');
                }
            }
            throw error;
        }
    },

    // Déconnexion
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('logout'));
    },

    // Récupérer le profil utilisateur
    async getProfile() {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Non authentifié');
        }

        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue');
        }
        
        return data;
    },
};
