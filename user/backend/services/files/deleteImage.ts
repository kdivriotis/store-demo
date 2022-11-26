import path from "path";
import fs from "fs";

/**
 * Delete an image file (.jpg, .jpeg, .png) with specific name if it exists in given subdirectory of /public/uploads
 * @param {string} directory The directory to look for the image
 * @param {string} name The image's name
 */
export const deleteImage = async (
  directory: string,
  name: string
): Promise<void> => {
  const fullPath = path.join(process.cwd(), "public", "uploads", directory);
  // Check if image exists as .jpg file
  try {
    const jpgImage = path.join(fullPath, `${name}.jpg`);
    await fs.promises.access(jpgImage, fs.constants.F_OK);
    await fs.promises.unlink(jpgImage);
    return;
  } catch (err) {}

  // Check if image exists as .jpeg file
  try {
    const jpegImage = path.join(fullPath, `${name}.jpeg`);
    await fs.promises.access(jpegImage, fs.constants.F_OK);
    await fs.promises.unlink(jpegImage);
    return;
  } catch (err) {}

  // Check if image exists as .png file
  try {
    const pngImage = path.join(fullPath, `${name}.png`);
    await fs.promises.access(pngImage, fs.constants.F_OK);
    await fs.promises.unlink(pngImage);
    return;
    return;
  } catch (err) {
    return;
  }
};
