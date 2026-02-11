const API_BASE_URL = 'http://72.62.241.45:4000/api';

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
        if (error.message || error.error) {
            throw error;
        }
        throw { message: 'Unable to connect to the server. Please check your connection.' };
    }
};

export const landingPageService = {
    /**
     * Get all landing pages
     */
    getLandingPages: () => {
        return request('/landing-pages', {
            method: 'GET',
        });
    },

    /**
     * Get a single landing page by ID
     * @param {string} id
     */
    getLandingPage: (id) => {
        return request(`/landing-pages/${id}`, {
            method: 'GET',
        });
    },

    /**
     * Update a landing page
     * @param {string} id
     * @param {Object} data { name, html, type, scope, status, config }
     */
    updateLandingPage: (id, data) => {
        return request(`/landing-pages/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
};

export default landingPageService;
