import { getData } from '@/lib/api-client';

export const getTodos = async () => {
    return await getData('/todos');
};

export const getUser = async () => {
    return await getData('/auth/me');
};
