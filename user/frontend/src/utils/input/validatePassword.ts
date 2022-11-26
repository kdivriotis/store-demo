/**
 * Check if password matches the following criteria:
 * 1. No whitespaces
 * 2. Has at least 1 character
 * 3. Has at least 1 digit
 * 4. Has at least 1 special character (symbol)
 * 5. Has to be between 8 and 16 characters length
 * @param {string} password The password to be tested
 * @returns A message if the check failed explaining the failure reason, otherwise returns null.
 */
export const validatePassword = (password: string): string | null => {
  const isWhitespace = /^(?=.*\s)/;
  if (isWhitespace.test(password))
    return "Ο κωδικός πρόσβασης δε μπορεί να περιέχει κενούς χαρακτήρες";

  const isValidLength = /^.{8,16}$/;
  if (!isValidLength.test(password))
    return "Ο κωδικός πρόσβασης πρέπει να είναι από 8 έως 16 χαρακτήρες.";

  const isContainsValidCharacters = /^[a-zA-Z0-9!@#$%^&*()_\-+=]+$/;
  if (!isContainsValidCharacters.test(password))
    return "Ο κωδικός πρόσβασης πρέπει να αποτελείται μόνο από λατινικούς χαρακτήρες, ψηφία και τα σύμβολα !@#$%^&*()_-+=";

  const isContainsCharacter = /^(?=.*[A-Za-z])/;
  if (!isContainsCharacter.test(password))
    return "Ο κωδικός πρόσβασης πρέπει να περιέχει τουλάχιστον έναν λατινικό χαρακτήρα.";

  const isContainsNumber = /^(?=.*[0-9])/;
  if (!isContainsNumber.test(password))
    return "Ο κωδικός πρόσβασης πρέπει να περιέχει τουλάχιστον ένα ψηφίο.";

  const isContainsSymbol = /^(?=.*[!@#$%^&*()_\-+=])/;
  if (!isContainsSymbol.test(password))
    return "Ο κωδικός πρόσβασης πρέπει να περιέχει τουλάχιστον ένα σύμβολο εκ των !@#$%^&*()_-+=";

  return null;
};
