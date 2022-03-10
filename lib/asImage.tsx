// Converts a file to an image,
// so you can read it's width and height and other deets
export async function asImage(
  file: Blob | MediaSource
): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
}
