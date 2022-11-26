import path from "path";
import fs from "fs";

/**
 * Delete a directory and all contents (recursively) if it exists in given subdirectory of /public/uploads
 * @param {string} directory The path of the directory to be deleted
 * @param {string} name The directory's name
 * @return true or false based on success
 */
export const deleteDirectory = async (
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
    await fs.promises.access(fullPath, fs.constants.F_OK);
    await fs.promises.rmdir(fullPath, {
      recursive: true,
      maxRetries: 3,
      retryDelay: 100,
    });
    return true;
  } catch (err) {
    return false;
  }
};
