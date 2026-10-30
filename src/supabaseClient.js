import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Compresses an image in the browser using HTML5 Canvas.
 * Reduces 5MB-10MB mobile/camera uploads down to ~80KB-160KB WebP/JPEG,
 * preserving high visual quality while dramatically saving bandwidth and storage.
 */
export async function compressImage(file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) {
  if (
    !file ||
    !file.type ||
    !file.type.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Attempt WebP compression (supported by 97%+ browsers)
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size > 0 && blob.size < file.size) {
              const newName = file.name.replace(/\.[^.]+$/, '.webp');
              const compressedFile = new File([blob], newName, { type: 'image/webp' });
              resolve(compressedFile);
            } else {
              // Try JPEG if WebP blob wasn't smaller or not supported
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob && jpegBlob.size > 0 && jpegBlob.size < file.size) {
                    const newName = file.name.replace(/\.[^.]+$/, '.jpeg');
                    const compressedJpeg = new File([jpegBlob], newName, { type: 'image/jpeg' });
                    resolve(compressedJpeg);
                  } else {
                    resolve(file);
                  }
                },
                'image/jpeg',
                quality
              );
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a file to the "media" bucket with automatic client-side compression
 * and 30-day CDN cache headers to ensure Supabase bandwidth stays well within free quotas.
 */
export async function uploadMediaFile(file, folder = 'misc') {
  let fileToUpload = file;
  try {
    fileToUpload = await compressImage(file);
    if (fileToUpload !== file) {
      console.log(
        `Optimized upload: ${(file.size / 1024).toFixed(1)} KB -> ${(fileToUpload.size / 1024).toFixed(1)} KB`
      );
    }
  } catch (err) {
    console.warn('Image compression skipped, uploading original:', err);
  }

  const fileExt = fileToUpload.name.split('.').pop() || 'webp';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  // 30-day cache control header prevents repeat egress on page reloads
  const { error } = await supabase.storage.from('media').upload(fileName, fileToUpload, {
    cacheControl: '2592000', // 30 days
    upsert: true,
    contentType: fileToUpload.type,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('media').getPublicUrl(fileName);
  return data.publicUrl;
}
