import { API_BASE_URL } from '../config';
import { forceLogout, handleAuthExpiry } from './session';
import { getApiHeaders } from '../utils/apiHeaders';
import { getAuthToken } from '../utils/authToken';

const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    if (!token) {
        forceLogout('Missing session. Please login again.');
        throw { message: 'Missing session. Please login again.' };
    }
    const headers = getApiHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
    }, url);

    const response = await fetch(url, { cache: 'no-store', ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        handleAuthExpiry(response, data, Boolean(token));
        throw data;
    }
    return data;
};

const connectionService = {
    getConnections: (type = 'all') => request(`/connections?type=${encodeURIComponent(type)}`),
    createConnection: (type, data) => request(`/connections/${encodeURIComponent(type)}`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateConnection: (type, id, data) => request(`/connections/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    deleteConnection: (type, id) => request(`/connections/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
    }),
};

export default connectionService;
