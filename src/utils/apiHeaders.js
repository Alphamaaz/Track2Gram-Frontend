export function getApiHeaders(existingHeaders = {}, requestUrl = '') {
    const headers = { ...existingHeaders };
    const url = String(requestUrl || '').toLowerCase();

    if (url.includes('ngrok-free.app') || url.includes('ngrok-free.dev') || url.includes('.ngrok.app') || url.includes('.ngrok.dev')) {
        headers['ngrok-skip-browser-warning'] = 'true';
    }

    return headers;
}
