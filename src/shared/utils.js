/**
 * Shared utilities for the AI Article Summarizer extension
 */

/**
 * Logs messages with proper formatting
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, warn, error)
 */
export function log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
        case 'error':
            console.error(formattedMessage);
            break;
        case 'warn':
            console.warn(formattedMessage);
            break;
        default:
            console.log(formattedMessage);
    }
}

/**
 * Validates the Gemini API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} - Whether the API key is valid
 */
export function validateApiKey(apiKey) {
    return typeof apiKey === 'string' && apiKey.length > 0;
}

/**
 * Extracts text content from a webpage
 * @param {Document} document - The document object
 * @returns {string} - Extracted text content
 */
export function extractContent(document) {
    try {
        const article = document.querySelector('article');
        if (article) return article.innerText;

        const paragraphs = Array.from(document.querySelectorAll('p'));
        if (paragraphs.length) return paragraphs.map(p => p.innerText).join('\n\n');

        return document.body.innerText;
    } catch (error) {
        log('Error extracting content: ' + error.message, 'error');
        return '';
    }
}

/**
 * Truncates text to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 20000) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Sanitizes HTML content
 * @param {string} html - HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
} 