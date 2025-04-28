/**
 * AI Summarizer Extension - Popup Script
 * 
 * This script handles the UI interactions and API calls for the
 * AI Summarizer extension popup interface. It manages:
 * - Content extraction from web pages
 * - Communication with the Gemini API
 * - User interface state and interactions
 * - Error handling and user feedback
 */

// DOM Elements - References to UI components
const summarizeButton = document.getElementById("summarize");
const copyButton = document.getElementById("copy-btn");
const resultElement = document.getElementById("result");
const summaryTypeSelect = document.getElementById("summary-type");
const loadingOverlay = document.getElementById("loading-overlay");
const statusMessage = document.getElementById("status-message");

/**
 * Shows the loading overlay to indicate processing
 */
function showLoading() {
  loadingOverlay.classList.add("active");
}

/**
 * Hides the loading overlay when processing is complete
 */
function hideLoading() {
  loadingOverlay.classList.remove("active");
}

/**
 * Shows a temporary status message to the user
 * @param {string} message - Message to display
 * @param {number} duration - How long to show the message (default: 2000ms)
 */
function showStatusMessage(message, duration = 2000) {
  statusMessage.textContent = message;
  statusMessage.classList.add("visible");
  setTimeout(() => {
    statusMessage.classList.remove("visible");
  }, duration);
}

/**
 * Extracts article content from the active tab using Chrome's scripting API
 * @param {number} tabId - ID of the active tab
 * @returns {Promise<string>} - Extracted text content
 */
async function getArticleContent(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
        // This code runs in the context of the web page
        const article = document.querySelector('article');
        if (article) return article.innerText;

        const paragraphs = Array.from(document.querySelectorAll('p'));
        if (paragraphs.length) return paragraphs.map(p => p.innerText).join('\n\n');

        // Fallback to body text if no article or paragraphs found
        return document.body.innerText;
      }
    });

    // The result is an array of execution results
    return results[0]?.result || "";
  } catch (error) {
    console.error("Error extracting content:", error);
    throw new Error("Could not extract content from the page");
  }
}

/**
 * Generates a summary using the Gemini API
 * @param {string} rawText - Text to summarize
 * @param {string} type - Type of summary to generate (brief/detailed/bullets)
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<string>} - Generated summary
 */
async function getGeminiSummary(rawText, type, apiKey) {
  if (!rawText || rawText.trim() === "") {
    throw new Error("No text to summarize");
  }

  // Limit text length to avoid API issues
  const max = 20000;
  const extractedText = rawText.length > max ? rawText.slice(0, max) + "..." : rawText;

  // Different prompts based on summary type
  const promptMap = {
    brief: `Summarize the following text in 2-3 sentences: \n\n${extractedText}`,
    detailed: `Give a detailed summary of the following text: \n\n${extractedText}`,
    bullets: `Create a list of key points from the following text: \n\n${extractedText}`,
  };

  const prompt = promptMap[type] || promptMap.brief;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No summary generated.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

/**
 * Main function to summarize content from the current tab
 * Handles the entire process from content extraction to summary generation
 */
async function summarizeContent() {
  showLoading();
  resultElement.textContent = "Analyzing page content...";

  try {
    // Get the current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) {
      resultElement.textContent = "No active tab found";
      hideLoading();
      return;
    }

    // Check if we can run on this page
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://") || !tab.url.startsWith("http")) {
      resultElement.textContent = "Cannot run on this page. Only works on regular web pages.";
      hideLoading();
      return;
    }

    // Get API key from storage
    const { geminiApiKey } = await chrome.storage.sync.get(['geminiApiKey']);

    if (!geminiApiKey) {
      resultElement.textContent = "No API key found. Please enter one in the options page.";
      hideLoading();
      return;
    }

    // Try injecting content script first to ensure it's available
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    } catch (error) {
      console.log("Content script injection error (non-critical):", error);
      // Continue anyway, since we're using executeScript directly
    }

    // Get the summary type from the dropdown
    const summaryType = summaryTypeSelect.value;

    // Get content and generate summary
    const articleContent = await getArticleContent(tab.id);

    if (!articleContent) {
      resultElement.textContent = "No content found on this page";
      hideLoading();
      return;
    }

    resultElement.textContent = "Generating summary...";
    const summary = await getGeminiSummary(articleContent, summaryType, geminiApiKey);
    resultElement.textContent = summary;
  } catch (error) {
    console.error("Error:", error);
    resultElement.textContent = "Error: " + error.message;
  } finally {
    hideLoading();
  }
}

/**
 * Copies the result text to the user's clipboard
 */
async function copyResultToClipboard() {
  try {
    await navigator.clipboard.writeText(resultElement.textContent);
    showStatusMessage("Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
    showStatusMessage("Failed to copy to clipboard", 3000);
  }
}

// Event Listeners for user interactions
summarizeButton.addEventListener("click", summarizeContent);
copyButton.addEventListener("click", copyResultToClipboard);

// Initialize the popup when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // You can add initialization code here if needed
  resultElement.textContent = "Select a summary type and click Summarize to analyze the current page.";
});