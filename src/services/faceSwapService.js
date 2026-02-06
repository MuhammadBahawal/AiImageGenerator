const API_BASE_URL = 'https://your-api.example.com';
const USE_MOCKS = true;

export async function swapFace({ templateId, userImage }) {
  if (USE_MOCKS) {
    if (!userImage?.uri) {
      throw new Error('No user image selected.');
    }
    return { image: userImage.uri };
  }

  const formData = new FormData();
  formData.append('templateId', templateId);
  formData.append('userImage', userImage);

  const response = await fetch(`${API_BASE_URL}/face-swap`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Face swap failed.');
  }

  const data = await response.json();
  return { image: data.imageUrl };
}
