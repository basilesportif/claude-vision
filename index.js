import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  throw new Error('ANTHROPIC_API_KEY environment variable is not set');
}

const client = new Anthropic({
  apiKey: API_KEY,
});

// Function to encode image to base64
function encodeImage(imagePath) {
  return fs.readFileSync(imagePath).toString('base64');
}

// Encode your image
const imagePath = "/Users/blah/Desktop/test_sweater.JPG"
const base64Image = encodeImage(imagePath);
const language = "en"
const prompt = `For the main clothing item or accessory in view, return JSON with keys: colors (as array), category ("top", "bottom", "dress", "outerwear", "shoes", "bag", "accessory", "swimwear", "headwear", "lingerie"), material, description, and brand. Omit any non-applicable keys. If the item is not clothing or accessory, describe it and categorize as "accessory". Description should be a few relevant words in the language with code ${language}, not a sentence. Format as only JSON.`;

// Create a message with both text and image
client.messages.create({
  model: "claude-3-5-sonnet-20240620",
  max_tokens: 100,
  messages: [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": base64Image
          }
        },
        {
          "type": "text",
          "text": prompt
        }
      ]
    }
  ],
})
  .then(response => {
    // Print the response
    console.log(response.content);
  })
  .catch(error => {
    console.error('Error:', error);
  });
