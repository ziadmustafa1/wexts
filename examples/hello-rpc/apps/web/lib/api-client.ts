import { axiosInstance } from './axios-global-config';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

// <======================== axios main configurations ======================>
export const axios_config = (
    useToken = true,
    isFormData = false,
    method = "GET"
) => {
    const headers: Record<string, string> = {
        Accept: "application/json",
    };

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    // Add specific headers for PATCH requests to handle CORS
    if (method === "PATCH") {
        headers["Access-Control-Request-Method"] = "PATCH";
        headers["Access-Control-Request-Headers"] = "Content-Type, Authorization";
    }

    if (useToken) {
        const token = getCookie("wexts_token");
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    return { headers };
};

// <========================= get data in client side ======================>
export const getData = async (endpoint: string) => {
    const response = await axiosInstance.get(endpoint, axios_config());
    return response.data;
};

// <========================= post data in client side ======================>
export const postData = async (
    endpoint: string,
    data: any,
    useToken = true
) => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post(endpoint, data, axios_config(useToken, isFormData, "POST"));
    return response.data;
};

// <========================= put data in client side ======================>
export const putData = async (endpoint: string, data: any) => {
    const response = await axiosInstance.put(endpoint, data, axios_config(true, false, "PUT"));
    return response.data;
};

// <========================= patch data in client side ======================>
export const patchData = async (
    endpoint: string,
    data: any,
    useToken = true
) => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.patch(endpoint, data, axios_config(useToken, isFormData, "PATCH"));
    return response.data;
};

// <========================= delete data in client side ======================>
export const deleteData = async (endpoint: string, data?: any) => {
    const config = axios_config(true, false, "DELETE");
    const response = await axiosInstance.delete(endpoint, {
        ...config,
        data: data
    });
    return response.data;
};

// ======= Auth helpers to integrate with login/logout =======
export function applyLogin(accessToken: string) {
    setCookie('wexts_token', accessToken, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
}

export async function applyLogout() {
    deleteCookie('wexts_token');
    if (typeof window !== 'undefined') window.location.replace('/login');
}
