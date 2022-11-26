/**
 * Check if post link has a valid form (starting with character and contains only characters, numbers, - or _)
 * @param {string} text The link to be tested
 * @param {number?} maxLength The maximum length for text input
 * @returns {string | null}, depending on verification success (if not null, value contains the failure message)
 */
export const validatePostLink = (
  text: string,
  maxLength: number = 0
): string | null => {
  if (!text.match(/^[a-zA-Z]/))
    return "Το πεδίο πρέπει να ξεκινάει από πεζό ή κεφαλαίο λατινικό χαρακτήρα (a-z ή A-Z)";

  if (!text.match(/^[a-zA-Z0-9\-_]+$/))
    return "Το πεδίο πρέπει να αποτελείται μόνο από λατινικούς χαρακτήρες, αριθμούς και τα σύμβολα _ και - (a-z, A-Z, 0-9, -, _)";

  if (text.length > maxLength)
    return `Το πεδίο δε μπορεί να υπερβαίνει τους ${maxLength} χαρακτήρες`;

  return null;
};
