// Image processing utilities for ZuluNiner
export interface ImageSize {
  width: number;
  height: number;
  quality?: number;
}

export const IMAGE_SIZES = {
  thumbnail: { width: 300, height: 300, quality: 0.8 },
  medium: { width: 800, height: 600, quality: 0.85 },
  large: { width: 1200, height: 900, quality: 0.9 },
  original: { width: 2000, height: 1500, quality: 0.95 }
} as const;

/**
 * Resizes an image file to specified dimensions
 */
export const resizeImage = async (
  file: File, 
  size: ImageSize
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      const { width: targetWidth, height: targetHeight } = size;
      const aspectRatio = img.width / img.height;
      
      let newWidth = targetWidth;
      let newHeight = targetHeight;
      
      if (img.width > img.height) {
        newHeight = targetWidth / aspectRatio;
      } else {
        newWidth = targetHeight * aspectRatio;
      }

      // Don't upscale images
      if (newWidth > img.width && newHeight > img.height) {
        newWidth = img.width;
        newHeight = img.height;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw and resize
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to resize image'));
            return;
          }

          // Create new file with optimized size
          const resizedFile = new File(
            [blob], 
            file.name, 
            { 
              type: 'image/jpeg', // Convert all to JPEG for consistency
              lastModified: Date.now() 
            }
          );
          
          resolve(resizedFile);
        },
        'image/jpeg',
        size.quality || 0.9
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Optimizes an image file by resizing to multiple sizes
 */
export const optimizeImage = async (file: File) => {
  try {
    // Resize to medium size for web display
    const optimized = await resizeImage(file, IMAGE_SIZES.medium);
    
    // Generate thumbnail
    const thumbnail = await resizeImage(file, IMAGE_SIZES.thumbnail);
    
    return {
      original: file,
      optimized,
      thumbnail,
      success: true
    };
  } catch (error) {
    console.error('Image optimization failed:', error);
    return {
      original: file,
      optimized: file, // Fallback to original
      thumbnail: file, // Fallback to original
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Validates image file type and size
 */
export const validateImageFile = (file: File) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Supported types: JPG, PNG, WebP`
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size: 10MB`
    };
  }

  return { valid: true };
};

/**
 * Generates SEO-friendly filename
 */
export const generateSEOFilename = (
  originalName: string,
  aircraftInfo: { year: number; make: string; model: string }
) => {
  const { year, make, model } = aircraftInfo;
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();
  
  const seoName = `${year}-${make}-${model}-aircraft-photo-${timestamp}`.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  return `${seoName}.${extension}`;
};