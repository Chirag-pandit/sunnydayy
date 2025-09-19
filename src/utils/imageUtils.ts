/**
 * Image utility functions for normalizing and handling image URLs
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const API_ORIGIN = (() => { 
  try { 
    return new URL(API_BASE).origin; 
  } catch { 
    return 'http://localhost:5000'; 
  } 
})();

/**
 * Normalizes an image URL by prepending the API origin if it's a relative path
 * @param src - The image source URL (can be relative or absolute)
 * @returns The normalized absolute URL
 */
export const normalizeImageUrl = (src: string): string => {
  const s = (src || '').trim();
  
  // If it's already an absolute URL, return as-is
  if (/^https?:\/\//i.test(s)) {
    return s;
  }
  
  // If it starts with '/', it's a relative path from the API root
  if (s.startsWith('/')) {
    return `${API_ORIGIN}${s}`;
  }
  
  // If it starts with 'uploads/' (without leading slash), prepend API origin and slash
  if (s.toLowerCase().startsWith('uploads/')) {
    return `${API_ORIGIN}/${s}`;
  }
  
  // For any other case, return the original string or empty string if invalid
  return s;
};

/**
 * Normalizes an array of image URLs
 * @param images - Array of image URLs (can be strings or objects with url property)
 * @returns Array of normalized absolute URLs
 */
export const normalizeImageUrls = (images: Array<string | { url: string }>): string[] => {
  if (!Array.isArray(images)) {
    return [];
  }
  
  const normalized = images.map((image) => {
    if (typeof image === 'string') {
      return normalizeImageUrl(image);
    } else if (image && typeof image === 'object' && 'url' in image) {
      return normalizeImageUrl(image.url);
    }
    return '';
  });
  
  // Filter out any empty strings
  return normalized.filter(Boolean);
};

/**
 * Gets the first valid image URL from an array of images
 * @param images - Array of image URLs
 * @param fallbackUrl - Fallback URL if no valid images are found
 * @returns The first valid image URL or fallback
 */
export const getPrimaryImage = (
  images: Array<string | { url: string }>, 
  fallbackUrl: string = 'https://placehold.co/800x800?text=Product'
): string => {
  const normalizedUrls = normalizeImageUrls(images);
  return normalizedUrls[0] || fallbackUrl;
};
