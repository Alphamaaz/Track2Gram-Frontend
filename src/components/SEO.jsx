import React, { useEffect } from 'react';

const SEO = ({ 
    title, 
    description, 
    keywords, 
    ogImage = '/og-image.png',
    ogUrl = window.location.href,
    ogType = 'website'
}) => {
    useEffect(() => {
        // Update Title
        if (title) {
            document.title = `${title} | Track2Gram`;
        }

        // Helper to update meta tags
        const updateMeta = (name, property, content) => {
            if (!content) return;
            let el = name 
                ? document.querySelector(`meta[name="${name}"]`)
                : document.querySelector(`meta[property="${property}"]`);
            
            if (el) {
                el.setAttribute('content', content);
            } else {
                el = document.createElement('meta');
                if (name) el.setAttribute('name', name);
                if (property) el.setAttribute('property', property);
                el.setAttribute('content', content);
                document.head.appendChild(el);
            }
        };

        // Update standard meta tags
        updateMeta('description', null, description);
        updateMeta('keywords', null, keywords);

        // Update Open Graph tags
        updateMeta(null, 'og:title', title);
        updateMeta(null, 'og:description', description);
        updateMeta(null, 'og:image', ogImage);
        updateMeta(null, 'og:url', ogUrl);
        updateMeta(null, 'og:type', ogType);

        // Update Twitter tags
        updateMeta('twitter:card', null, 'summary_large_image');
        updateMeta('twitter:title', null, title);
        updateMeta('twitter:description', null, description);
        updateMeta('twitter:image', null, ogImage);

    }, [title, description, keywords, ogImage, ogUrl, ogType]);

    return null; // This component doesn't render anything
};

export default SEO;
