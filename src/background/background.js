/**
 * background.js
 * 
 * This script runs in the background of the extension and handles
 * installation and initialization tasks. It ensures the extension
 * is properly set up when first installed.
 */

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
  // Check if the Gemini API key is already set
  chrome.storage.sync.get(["geminiApiKey"], (result) => {
    // If no API key is found, open the options page for the user to enter it
    if (!result.geminiApiKey) {
      chrome.tabs.create({ url: "options.html" });
    }
  });
});