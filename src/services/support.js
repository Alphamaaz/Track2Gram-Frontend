import { API_BASE_URL } from '../config';
import { handleAuthExpiry } from './session';
import { getApiHeaders } from '../utils/apiHeaders';

/**
 * Common request handler to handle fetch responses and errors
 */
const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // If it's not FormData, set Content-Type to application/json
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    const finalHeaders = getApiHeaders(headers, url);

    try {
        const response = await fetch(url, { ...options, headers: finalHeaders });
        const data = await response.json();

        if (!response.ok) {
            handleAuthExpiry(response, data, Boolean(token));
            throw data;
        }

        return data;
    } catch (error) {
        if (error.message || error.error) {
            throw error;
        }
        throw { message: 'Unable to connect to the server. Please check your connection.' };
    }
};

export const supportService = {
    /**
     * Submit a support ticket
     * @param {FormData} formData
     */
    submitTicket: (formData) => {
        return request('/support', {
            method: 'POST',
            body: formData,
        });
    }
};

export default supportService;
