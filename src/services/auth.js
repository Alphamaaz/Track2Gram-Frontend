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
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };
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
        // If it's already the data thrown above, re-throw it
        if (error.message || error.error) {
            throw error;
        }
        // Otherwise, throw a generic error
        throw { message: 'Unable to connect to the server. Please check your connection.' };
    }
};

export const authService = {
    /**
     * Register a new user
     * @param {Object} userData { name, email, password }
     */
    register: (userData) => {
        return request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    /**
     * Login user
     * @param {Object} credentials { email, password }
     */
    login: (credentials) => {
        return request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    /**
     * Get user profile
     */
    getProfile: () => {
        return request('/auth/profile', {
            method: 'GET',
        });
    },

    /**
     * Update user profile (name)
     * @param {Object} data { name }
     */
    updateProfile: (data) => {
        return request('/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    /**
     * Change user password (authenticated)
     * @param {Object} data { currentPassword, newPassword }
     */
    changePassword: (data) => {
        return request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Request password reset email
     * @param {string} email 
     */
    forgotPassword: (email) => {
        return request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    /**
     * Reset password using token
     * @param {Object} data { newPassword, token }
     */
    resetPassword: (data) => {
        return request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Verify email with token
     * @param {string} token 
     */
    verifyEmail: (token) => {
        return request('/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    },

    /**
     * Invite a new user
     * @param {Object} data { email, role }
     */
    inviteUser: (data) => {
        return request('/auth/client/invite', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Accept invitation
     * @param {Object} data { password, name, token }
     */
    acceptInvite: (data) => {
        return request('/auth/accept-invite', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Toggle disable user
     * @param {string} userId
     */
    toggleDisableUser: (userId) => {
        return request(`/auth/client/toggle-disable-user/${userId}`, {
            method: 'POST',
        });
    },

    /**
     * Get all workspace users
     */
    getUsers: () => {
        return request('/auth/client/workspace-users', {
            method: 'GET',
        });
    },

    /**
     * Delete a user
     * @param {string} userId
     */
    deleteUser: (userId) => {
        return request(`/auth/delete-user/${userId}`, {
            method: 'DELETE',
        });
    }
};

export default authService;
