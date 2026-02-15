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
    }
};

export default projectService;
