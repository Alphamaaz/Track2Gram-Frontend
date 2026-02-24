import { API_BASE_URL } from '../config';

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
            throw data;
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);

        // Handle standardized error objects from backend
        if (error.message) {
            throw error;
        }

        if (error.error && typeof error.error === 'string') {
            throw { message: error.error };
        }

        if (error.error && typeof error.error === 'object' && error.error.message) {
            throw { message: error.error.message };
        }

        // Fallback for response errors that don't match the above
        if (error.statusText) {
            throw { message: `Server Error: ${error.statusText}` };
        }

        throw { message: 'An unexpected error occurred. Please try again.' };
    }
};

export const googleAdsService = {
    /**
     * Get authorization URL for Google Ads
     */
    connect: () => {
        // Dynamic redirectUri based on current domain (localhost or Vercel)
        const redirectUri = `${window.location.origin}/integrations/google-ads/authorize`;
        return request('/google-ads/connect', {
            method: 'POST',
            body: JSON.stringify({ redirectUri }),
        });
    },

    /**
     * Send authorization code to backend
     * @param {string} code 
     */
    callback: (code) => {
        return request('/google-ads/callback', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    },

    /**
     * Get Google Ads connection status
     */
    getStatus: () => {
        return request('/google-ads/status', {
            method: 'GET',
        });
    },

    /**
     * Trigger manual sync of Google Ads data
     */
    sync: () => {
        return request('/google-ads/sync', {
            method: 'POST',
        });
    },

    /**
     * Disconnect Google Ads account
     */
    disconnect: () => {
        return request('/google-ads/disconnect', {
            method: 'DELETE',
        });
    },

    /**
     * Get conversion actions for the connected account
     * @param {string} customerId 
     */
    getConversionActions: (customerId) => {
        return request(`/settings/conversion-actions?customerId=${customerId}`, {
            method: 'GET',
        });
    },
};

export default googleAdsService;
