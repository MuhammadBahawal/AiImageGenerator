const API_BASE_URL = 'https://your-api.example.com';
const USE_MOCKS = true;
const FALLBACK_IMAGE = require('../../assets/images/jocker.png');

export async function generateImage({ prompt, style }) {
  if (USE_MOCKS) {
    return { image: FALLBACK_IMAGE };
  }

  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, style }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Image generation failed.');
  }

  const data = await response.json();
  return { image: data.imageUrl };
}
