/**
 * Generate a random password for reset password functionality
 * @param {number} length The desired length of the generated password
 * @returns The generated password
 */
export const generatePassword = (length: number): string => {
  const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const integers = "0123456789";
  const specialCharacters = "!@#$%^&*()_-+=";

  const passwordCharacters = `${alpha}${integers}${specialCharacters}`;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += passwordCharacters.charAt(
      Math.floor(Math.random() * passwordCharacters.length)
    );
  }

  return password;
};
