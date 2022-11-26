/**
 * Check if number string has a valid form
 * @param {string} text The number string to be tested
 * @returns error message (string) in case of invalid string, otherwise null
 */
export const validateFloat = (text: string): string | null => {
  if (!text) return "Το πεδίο δε μπορεί να είναι κενό";
  if (isNaN(parseFloat(text))) return "Εισάγετε έναν έγκυρο πραγματικό αριθμό";

  return null;
};
