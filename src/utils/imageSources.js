const IMAGE_ASSETS = {
  imagePlaceholder: require('../../assets/images/jocker.png'),
  faceSwapPlaceholder: require('../../assets/images/faceSwapImages/Rectangle 21573.png'),
};

export function toStoredImage(image, fallbackKey = 'imagePlaceholder') {
  if (typeof image === 'string') {
    return { kind: 'uri', value: image };
  }

  if (image && typeof image === 'object' && image.uri) {
    return { kind: 'uri', value: image.uri };
  }

  return { kind: 'asset', value: fallbackKey };
}

export function toImageSource(storedImage, fallbackKey = 'imagePlaceholder') {
  if (!storedImage) {
    return IMAGE_ASSETS[fallbackKey];
  }

  if (storedImage.kind === 'uri') {
    return { uri: storedImage.value };
  }

  const assetKey = storedImage.value || fallbackKey;
  return IMAGE_ASSETS[assetKey] || IMAGE_ASSETS[fallbackKey];
}

export function getFallbackAsset(key = 'imagePlaceholder') {
  return IMAGE_ASSETS[key] || IMAGE_ASSETS.imagePlaceholder;
}
