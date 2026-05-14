import { postData, applyLogin, applyLogout } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export const login = async (data: any) => {
    try {
        const response = await postData('/auth/login', data, false);
        if (response.token) {
            applyLogin(response.token);
            toast.success('Logged in successfully! 🚀');
            return response;
        }
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Login failed');
        throw error;
    }
};

export const register = async (data: any) => {
    try {
        const response = await postData('/auth/register', data, false);
        if (response.token) {
            applyLogin(response.token);
            toast.success('Account created successfully! 🎉');
            return response;
        }
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Registration failed');
        throw error;
    }
};

export const logout = async () => {
    await applyLogout();
    toast.success('Logged out');
};
