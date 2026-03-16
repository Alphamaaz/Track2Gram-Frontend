const PUBLIC_ROUTES = new Set([
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/accept-invite',
    '/privacy-policy',
    '/terms-of-service',
    '/features',
    '/pricing',
    '/about',
    '/contact',
]);

function extractMessage(payload) {
    if (!payload) return '';
    if (typeof payload === 'string') return payload;
    if (typeof payload.message === 'string') return payload.message;
    if (typeof payload.error === 'string') return payload.error;
    if (payload.error && typeof payload.error.message === 'string') return payload.error.message;
    return '';
}

function isSessionExpired(response, payload, hasToken) {
    const msg = extractMessage(payload).toLowerCase();
    const messageLooksExpired = /token.*expired|jwt expired|invalid token|session expired/.test(msg);
    const workspaceRevoked = /workspace is deactivated|workspace.*suspended|workspace deactivated/.test(msg);
    const unauthorized = response?.status === 401;
    const workspaceForbidden = response?.status === 403 && workspaceRevoked;
    return messageLooksExpired || (unauthorized && hasToken) || workspaceForbidden;
}

function shouldRedirectToLogin() {
    const path = window.location.pathname;
    return !PUBLIC_ROUTES.has(path);
}

export function forceLogout(reason = 'Session expired. Please login again.') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth:expired', { detail: { reason } }));

    if (shouldRedirectToLogin()) {
        window.location.replace('/login');
    }
}

export function handleAuthExpiry(response, payload, hasToken = false) {
    if (!isSessionExpired(response, payload, hasToken)) {
        return false;
    }

    const inProgress = sessionStorage.getItem('auth_redirect_in_progress');
    if (!inProgress) {
        sessionStorage.setItem('auth_redirect_in_progress', '1');
        const message = extractMessage(payload) || 'Session expired. Please login again.';
        forceLogout(message);
    }

    return true;
}
