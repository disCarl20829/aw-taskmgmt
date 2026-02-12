import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

export const useAuthCheck = (redirectTo = '/dashboard') => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/auth/verify');
                
                if (response.data.isAuthenticated) {
                    navigate(redirectTo, { replace: true });
                }
            } catch (error) {
                console.log('Not authenticated');
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [navigate, redirectTo]);

    return { isChecking };
};