/**
 * Check if digit text string has a valid form
 * @param {string} text The digit-only text to be tested
 * @param {number?} desiredLength The exact desired length
 * @returns true or false, depending on verification success
 */
export const validateDigitText = (
  text: string | null,
  desiredLength: number = 0
): string | null => {
  if (!text || !text.match(/^[0-9]+$/) || text.length !== desiredLength)
    return `Το πεδίο πρέπει να αποτελείται από ακριβώς ${desiredLength} ψηφία (0-9)`;

  return null;
};
