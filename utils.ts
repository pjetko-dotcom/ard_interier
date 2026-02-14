/**
 * Get the correct image path based on the current base URL
 * Handles both development (/) and production (/react_web/) environments
 */
export const getImageUrl = (imagePath: string): string => {
  const basePath = import.meta.env.BASE_URL;
  // Remove leading slash from imagePath if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${basePath}${cleanPath}`;
};
