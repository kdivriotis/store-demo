/**
 * Check if text field has a valid form
 * @param {string} text The text to be tested
 * @param {number?} maxLength The maximum length for text input
 * @returns {string | null}, depending on verification success (if not null, value contains the failure message)
 */
export const validateText = (
  text: string | null,
  maxLength: number = 0
): string | null => {
  if (!text || text.trim().length === 0)
    return "Το πεδίο δε μπορεί να είναι κενό";

  if (maxLength && text.trim().length > maxLength)
    return `Το πεδίο δε μπορεί να υπερβαίνει τους ${maxLength} χαρακτήρες`;

  return null;
};
