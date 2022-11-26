import path from "path";
import fs from "fs";

/**
 * Create a directory in given subdirectory of /public/uploads
 * @param {string} directory The path of the directory to be created
 * @param {string} name The directory's name
 * @return true or false based on success
 */
export const createDirectory = async (
  directory: string,
  name: string
): Promise<boolean> => {
  const fullPath = path.join(
    process.cwd(),
    "public",
    "uploads",
    directory,
    name
  );
  // Check if directory exists and try to delete it recursively
  try {
    await fs.promises.mkdir(fullPath, { recursive: true });
    return true;
  } catch (err) {
    return false;
  }
};
