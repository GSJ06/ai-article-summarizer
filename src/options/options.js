/**
 * options.js
 * 
 * This script handles the options page of the extension where users can
 * configure their Gemini API key. It manages:
 * - Loading the saved API key
 * - Saving new API keys
 * - Providing feedback to the user
 */

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Load the saved API key from storage and populate the input field
    chrome.storage.sync.get(['geminiApiKey'], ({ geminiApiKey }) => {
        if (geminiApiKey) {
            document.getElementById('api-key').value = geminiApiKey;
        }
    });

    // Add click handler for the save button
    document.getElementById('save-btn').addEventListener('click', () => {
        // Get and validate the API key
        const apiKey = document.getElementById('api-key').value.trim();
        if (!apiKey) return;

        // Save the API key to Chrome's sync storage
        chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
            // Show success message
            document.getElementById('success-message').style.display = 'block';

            // Close the options page after a short delay
            setTimeout(() => {
                window.close();
            }, 2000);
        });
    });
});
