/**
 * Check if digit text string has a valid form
 * @param {string} text The digit-only text to be tested
 * @param {number?} maxLength The maximum length for text input
 * @returns true or false, depending on verification success
 */
export const validateDigitText = (
  text: string,
  maxLength: number = 0
): string | null => {
  if (!text.match(/^[0-9]+$/) || text.length !== maxLength)
    return `Το πεδίο πρέπει να αποτελείται από ακριβώς ${maxLength} ψηφία (0-9)`;

  return null;
};
