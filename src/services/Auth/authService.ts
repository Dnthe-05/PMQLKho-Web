import axiosClient from '../../API/axiosClient';

export const login = async (account: string, password: string) => {
    const response = await axiosClient.post('/api/auth/login', { account, password });
    return response;
};

export const logout = async () => {
    return await axiosClient.post('/api/auth/logout');
};

export const getProfile = async () => {
    const response = await axiosClient.get('/api/auth/profile'); 
    return response;
};