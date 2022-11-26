/**
 * Round a given number to a certain number of decimal digits
 * @param {number} value The number to be converted
 * @param {number} decimals The number of decimal digits
 * @returns The rounded number
 */
export const round = (value: number, decimals: number): number => {
  return parseFloat(
    Math.round(parseFloat(value + "e" + decimals)) + "e-" + decimals
  );
};
