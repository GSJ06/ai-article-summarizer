/**
 * content.js
 * This script runs in the context of web pages to extract article content.
 * It's injected into web pages when the extension is active and handles
 * communication between the webpage and the extension's popup.
 */

/**
 * Extracts the main content from the current webpage.
 * First tries to find an <article> tag, which is the semantic HTML element
 * for main content. If not found, falls back to collecting all paragraphs.
 * 
 * @returns {string} The extracted text content
 */
function getArticleContent() {
  // Try to find an <article> tag first
  const article = document.querySelector('article');
  if (article) return article.innerText;

  // Fallback: collect all paragraphs if no article tag is found
  const paragraphs = Array.from(document.querySelectorAll('p'));
  return paragraphs.map(p => p.innerText).join('\n');
}

/**
 * Listens for messages from the extension's popup.
 * When a request for article content is received, extracts the content
 * and sends it back to the popup.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_ARTICLE_CONTENT') {
    const text = getArticleContent();
    sendResponse({ text });
    return true; // Required to indicate we'll send a response asynchronously
  }
});