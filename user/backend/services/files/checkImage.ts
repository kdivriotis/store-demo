import path from "path";
import fs from "fs";

/**
 * Get check if an image file (.jpg, .jpeg, .png) with specific name exists in given subdirectory of /public/uploads
 * @param {string} directory The directory to look for the image
 * @param {string} name The image's name
 * @return Image's name if it exists or null otherwise
 */
export const checkImage = async (
  directory: string,
  name: string
): Promise<string | null> => {
  const fullPath = path.join(process.cwd(), "public", "uploads", directory);
  // Check if image exists as .jpg file
  try {
    const jpgImage = path.join(fullPath, `${name}.jpg`);
    await fs.promises.access(jpgImage, fs.constants.F_OK);
    return `${name}.jpg`;
  } catch (err) {}

  // Check if image exists as .jpeg file
  try {
    const jpegImage = path.join(fullPath, `${name}.jpeg`);
    await fs.promises.access(jpegImage, fs.constants.F_OK);
    return `${name}.jpeg`;
  } catch (err) {}

  // Check if image exists as .png file
  try {
    const pngImage = path.join(fullPath, `${name}.png`);
    await fs.promises.access(pngImage, fs.constants.F_OK);
    return `${name}.png`;
  } catch (err) {
    return null;
  }
};
