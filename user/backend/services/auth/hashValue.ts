import { hash } from "bcryptjs";

/**
 * Generate hashed value (salt = 10)
 *
 * @param {string} value The value to be hashed using bcrypt
 * @return {string} The hashed value
 */
export const hashValue = async (value: string): Promise<string> => {
  const hashedValue = await hash(value, 10);
  return hashedValue;
};
