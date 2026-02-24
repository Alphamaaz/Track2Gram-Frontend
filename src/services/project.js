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
        if (error.message || error.error) {
            throw error;
        }
        throw { message: 'Unable to connect to the server. Please check your connection.' };
    }
};

export const projectService = {
    /**
     * Get all projects
     */
    getProjects: () => {
        return request('/projects', {
            method: 'GET',
        });
    },

    /**
     * Get a single project by ID
     * @param {string} id
     */
    getProject: (id) => {
        return request(`/projects/${id}`, {
            method: 'GET',
        });
    },

    /**
     * Create a new project
     * @param {Object} data { name, landingPageSource, landingPageTemplateId, adPlatforms, ... }
     */
    createProject: (data) => {
        return request('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Update an existing project
     * @param {string} id
     * @param {Object} data
     */
    updateProject: (id, data) => {
        return request(`/projects/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    /**
     * Delete a project
     * @param {string} id
     */
    deleteProject: (id) => {
        return request(`/projects/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Get project statistics
     */
    getStats: (projectId, startDate, endDate) => {
        const query = new URLSearchParams();
        if (startDate) query.append('startDate', startDate);
        if (endDate) query.append('endDate', endDate);
        return request(`/projects/${projectId}/stats?${query.toString()}`);
    },

    /**
     * Get subscriptions chart data
     */
    getSubscriptionsChart: (projectId, startDate, endDate) => {
        const query = new URLSearchParams();
        if (startDate) query.append('startDate', startDate);
        if (endDate) query.append('endDate', endDate);
        return request(`/projects/${projectId}/subscriptions-chart?${query.toString()}`);
    },

    /**
     * Get performance report
     */
    getPerformanceReport: (projectId) => {
        return request(`/projects/${projectId}/performance-report`);
    },

    /**
     * Get activity log
     */
    getActivityLog: (projectId, startDate, endDate, page = 1, limit = 20) => {
        const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (startDate) query.append('startDate', startDate);
        if (endDate) query.append('endDate', endDate);
        return request(`/projects/${projectId}/activity-log?${query.toString()}`);
    },

    /**
     * Get global dashboard statistics
     */
    getDashboardStats: (platform, startDate, endDate) => {
        const query = new URLSearchParams();
        if (platform) query.append('platform', platform);
        if (startDate) query.append('startDate', startDate);
        if (endDate) query.append('endDate', endDate);
        return request(`/projects/dashboard/stats?${query.toString()}`);
    },

    /**
     * Get global dashboard chart data
     */
    getDashboardChart: (platform, startDate, endDate) => {
        const query = new URLSearchParams();
        if (platform) query.append('platform', platform);
        if (startDate) query.append('startDate', startDate);
        if (endDate) query.append('endDate', endDate);
        return request(`/projects/dashboard/chart?${query.toString()}`);
    }
};

export default projectService;
