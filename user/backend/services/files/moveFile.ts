import path from "path";
import fs from "fs";

/**
 * Move a file with specific name from a given subdirectory of /public/uploads to another subdirectory
 * @param {string} from The directory to move the file from
 * @param {string} to The directory to move the file to
 * @param {string} name The name of the file to be moved
 * @return True or False based on success
 */
export const moveFile = async (
  from: string,
  to: string,
  name: string
): Promise<boolean> => {
  const pathFrom = path.join(process.cwd(), "public", "uploads", from, name);
  const pathTo = path.join(process.cwd(), "public", "uploads", to, name);

  try {
    await fs.promises.access(pathFrom, fs.constants.F_OK);
    await fs.promises.rename(pathFrom, pathTo);
    return true;
  } catch (err) {
    return false;
  }
};
