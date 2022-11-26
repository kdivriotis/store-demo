/**
 * Convert a given number or string to a string with certain number of digits
 * @param {number | string} value The value to be converter
 * @param {number} digits The number of decimal digits
 * @returns The converted number in string format if it is valid, otherwise 0.<0...0> (depending on number of digits specified)
 */
export const numberToString = (
  value: number | string,
  digits: number
): string => {
  const floatValue = parseFloat(`${value}`);
  if (isNaN(floatValue))
    return Number(0).toLocaleString("en-US", {
      minimumFractionDigits: digits,
      useGrouping: false,
    });

  return floatValue.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    useGrouping: false,
  });
};
