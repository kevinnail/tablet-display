export function loadImagesFromFolder() {
  const imageModules = import.meta.glob('../assets/images/*.{png,jpg,jpeg,JPEG,webp,avif}', {
    eager: true,
  });

  const imageUrls = Object.entries(imageModules)
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .map(([, moduleValue]) => moduleValue.default);

  return imageUrls;
}
