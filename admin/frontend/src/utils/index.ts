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

/**
 * Generate a random hex color from a given string
 * @param {string} str The string to be converted to hex color
 * @returns The generated hex color #rrggbb
 */
export const stringToColor = (str: string): string => {
  let hash: number = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color: string = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
};

/**
 * Convert a hex string to rgba string
 * @param {string} hex The hex code in form #rrggbb
 * @param {number} alpha The alpha value (opacity) of the color (from 0-1 ~ if ommited, 1 is the default value)
 * @returns The hex number #rrggbb converted to string rgba(rr, gg, bb, alpha)
 */
export const hexToRGB = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (alpha < 0) alpha = 0;
  else if (alpha > 1) alpha = 1;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
