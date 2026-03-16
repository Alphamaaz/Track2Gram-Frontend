import { API_BASE_URL } from '../config';
import { handleAuthExpiry } from './session';

/**
 * Common request handler to handle fetch responses and errors
 */
const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers });
        const data = await response.json();

        if (!response.ok) {
            handleAuthExpiry(response, data, Boolean(token));
            throw data;
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);

        if (error.message) {
            throw error;
        }

        if (error.error && typeof error.error === 'string') {
            throw { message: error.error };
        }

        if (error.error && typeof error.error === 'object' && error.error.message) {
            throw { message: error.error.message };
        }

        if (error.statusText) {
            throw { message: `Server Error: ${error.statusText}` };
        }

        throw { message: 'An unexpected error occurred. Please try again.' };
    }
};

export const metaAdsService = {
    /**
     * Get Meta Ads integration status
     * Endpoint: GET /api/meta-ads/status
     */
    getStatus: () => {
        return request('/meta-ads/status', {
            method: 'GET',
        });
    },

    /**
     * Disconnect Meta Ads integration
     * Endpoint: DELETE /api/meta-ads/disconnect
     */
    disconnect: () => {
        return request('/meta-ads/disconnect', {
            method: 'DELETE',
        });
    },
};

export default metaAdsService;
