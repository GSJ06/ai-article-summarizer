# AI Article Summarizer Chrome Extension

A Chrome extension that uses Google's Gemini AI to generate concise summaries of web articles. This extension helps users quickly understand the main points of any article without having to read the entire content.

## Features

- 🔍 **Smart Content Extraction**: Automatically extracts article content from web pages
- 🤖 **AI-Powered Summaries**: Uses Google's Gemini AI to generate high-quality summaries
- 📝 **Multiple Summary Types**:
  - Brief (2-3 sentences)
  - Detailed (comprehensive summary)
  - Bullet Points (key points)
- 📋 **Easy Copy**: One-click copy of summaries to clipboard
- ⚙️ **Customizable**: Configure your own Gemini API key
- 🎨 **Clean Interface**: Simple and intuitive user interface

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Configuration

1. Click the extension icon in your Chrome toolbar
2. Click the settings icon (⚙️) to open the options page
3. Enter your Gemini API key
4. Save your settings

## Usage

1. Navigate to any article you want to summarize
2. Click the extension icon in your Chrome toolbar
3. Select your preferred summary type (Brief/Detailed/Bullets)
4. Click "Summarize"
5. Copy the generated summary with one click

## Requirements

- Google Chrome browser
- Gemini API key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Permissions

This extension requires the following permissions:
- `scripting`: To extract content from web pages
- `activeTab`: To access the current tab's content
- `storage`: To save user preferences and API key
- `host_permissions`: To access content on web pages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have suggestions for improvements, please open an issue in the GitHub repository.
