import { useState, useEffect } from 'react';
import { authService } from '../services/api';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Vérifier si un token existe au chargement
        const token = localStorage.getItem('token');
        if (token) {
            checkAuth();
        } else {
            setLoading(false);
        }

        // Écouter l'événement de déconnexion
        const handleLogout = () => {
            setUser(null);
            setError(null);
        };

        window.addEventListener('logout', handleLogout);
        return () => window.removeEventListener('logout', handleLogout);
    }, []);

    const checkAuth = async () => {
        try {
            const response = await authService.getProfile();
            setUser(response.user);
            setError(null);
        } catch (err) {
            setError(err.message);
            authService.logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            setError(null);
            return response.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await authService.register(userData);
            setUser(response.user);
            setError(null);
            return response.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
    };

    return {
        user,
        loading,
        error,
        login,
        register,
        logout
    };
}
