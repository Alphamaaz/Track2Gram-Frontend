const TOKEN_KEYS = ['token', 'authToken', 'accessToken'];

function normalizeToken(value) {
    const token = String(value || '').trim().replace(/^"|"$/g, '');
    if (!token || token === 'null' || token === 'undefined') return '';
    return token;
}

function getCookie(name) {
    const encodedName = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie
        .split(';')
        .map(part => part.trim())
        .find(part => part.startsWith(encodedName));
    return cookie ? decodeURIComponent(cookie.slice(encodedName.length)) : '';
}

function cookieDomain() {
    const hostname = window.location.hostname;
    if (hostname === 'track2gram.com' || hostname.endsWith('.track2gram.com')) {
        return '; domain=.track2gram.com';
    }
    return '';
}

export function getAuthToken() {
    for (const key of TOKEN_KEYS) {
        const localToken = normalizeToken(localStorage.getItem(key));
        if (localToken) return localToken;
        const sessionToken = normalizeToken(sessionStorage.getItem(key));
        if (sessionToken) return sessionToken;
    }
    return normalizeToken(getCookie('token'));
}

export function setAuthToken(token) {
    const normalized = normalizeToken(token);
    if (!normalized) return;
    localStorage.setItem('token', normalized);
    document.cookie = `token=${encodeURIComponent(normalized)}; path=/${cookieDomain()}; max-age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure`;
}

export function clearAuthToken() {
    for (const key of TOKEN_KEYS) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    }
    document.cookie = `token=; path=/${cookieDomain()}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
}
