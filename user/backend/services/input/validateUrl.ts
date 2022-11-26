/**
 * Check if URL field has a valid form
 * @param {string} url The url to be tested
 * @returns {string | null}, depending on verification success (if not null, value contains the failure message)
 */
export const validateUrl = (url: string): string | null => {
  let constructedUrl;
  if (!url || url.trim().length === 0)
    return "Το πεδίο δε μπορεί να είναι κενό";

  try {
    constructedUrl = new URL(url);
    if (!/https/.test(constructedUrl.protocol)) {
      return "Ο σύνδεσμος πρέπει να έχει τη μορφή https://www.mysite.gr";
    }
  } catch (error) {
    return "Ο σύνδεσμος πρέπει να έχει τη μορφή https://www.mysite.gr";
  }
  return null;
};
