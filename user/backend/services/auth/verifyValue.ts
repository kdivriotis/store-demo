import { compare } from "bcryptjs";

/**
 * Verify if given value is equal to given hashed value
 *
 * @param {string} value The initial (not hashed) value
 * @param {string} hashedValue The hashed value to be compared to the initial value
 * @return {boolean} True or false, depending if the initial value is equal to the hashed value
 */
export const verifyValue = async (
  value: string,
  hashedValue: string
): Promise<boolean> => {
  const isValid = await compare(value, hashedValue);
  return isValid;
};
