/**
 * Check if email has a valid form
 * @param {string} email The email to be tested
 * @param {number?} maxLength The maximum length for email input
 * @returns {string | null}, depending on verification success (if not null, value contains the failure message)
 */
export const validateEmail = (
  email: string | null,
  maxLength: number = 0
): string | null => {
  if (!email || email.length === 0) return "Το πεδίο δε μπορεί να είναι κενό";

  if (maxLength && email.length > maxLength)
    return `Το πεδίο δε μπορεί να υπερβαίνει τους ${maxLength} χαρακτήρες`;

  if (
    !email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    return "Ελέγξτε το email που πληκτρολογήσατε και προσπαθήστε ξανά";

  return null;
};
