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
        const response = await fetch(url, { cache: 'no-store', ...options, headers });
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

export const settingsService = {
    /**
     * Get all app settings
     */
    getSettings: () => {
        const query = new URLSearchParams({ _t: Date.now().toString() });
        return request(`/settings?${query.toString()}`, {
            method: 'GET',
        });
    },

    /**
     * Update app settings
     * @param {Object} data 
     */
    updateSettings: (data) => {
        return request('/settings', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Get Telegram integration status/permission diagnostics
     */
    getTelegramStatus: () => {
        return request('/settings/telegram-status', {
            method: 'GET',
        });
    },
};

export default settingsService;
