import { validateApiKey, truncateText, sanitizeHtml } from '../src/shared/utils.js';

describe('Utility Functions', () => {
    describe('validateApiKey', () => {
        test('should return true for valid API key', () => {
            expect(validateApiKey('valid-api-key')).toBe(true);
        });

        test('should return false for empty string', () => {
            expect(validateApiKey('')).toBe(false);
        });

        test('should return false for non-string input', () => {
            expect(validateApiKey(null)).toBe(false);
            expect(validateApiKey(undefined)).toBe(false);
            expect(validateApiKey(123)).toBe(false);
        });
    });

    describe('truncateText', () => {
        test('should not truncate text shorter than max length', () => {
            const text = 'Short text';
            expect(truncateText(text, 20)).toBe(text);
        });

        test('should truncate text longer than max length', () => {
            const text = 'This is a very long text that needs to be truncated';
            const truncated = truncateText(text, 10);
            expect(truncated.length).toBeLessThanOrEqual(13); // 10 + '...'
            expect(truncated.endsWith('...')).toBe(true);
        });
    });

    describe('sanitizeHtml', () => {
        test('should escape HTML special characters', () => {
            const html = '<script>alert("xss")</script>';
            const sanitized = sanitizeHtml(html);
            expect(sanitized).not.toContain('<script>');
            expect(sanitized).not.toContain('</script>');
        });

        test('should preserve text content', () => {
            const text = 'Hello, World!';
            expect(sanitizeHtml(text)).toBe(text);
        });
    });
}); 