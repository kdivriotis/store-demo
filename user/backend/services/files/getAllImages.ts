import path from "path";
import fs from "fs";

/**
 * Get all image files (.jpg, .jpeg, .png) from given subdirectory of /public/uploads
 * @param {string} directory The directory to look for images
 * @return Array of strings with the found images' names or null in case of failure
 */
export const getAllImages = async (
  directory: string
): Promise<string[] | null> => {
  const fullPath = path.join(process.cwd(), "public", "uploads", directory);
  try {
    const files = await fs.promises.readdir(fullPath);
    return files.filter(
      (file) =>
        path.extname(file) === ".jpg" ||
        path.extname(file) === ".jpeg" ||
        path.extname(file) === ".png"
    );
  } catch (err) {
    return null;
  }
};
