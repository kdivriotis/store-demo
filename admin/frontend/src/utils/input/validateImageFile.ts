/**
 * Check if given file is an image (jpg, jpeg, png)
 * @param {File| undefined} imageFile The file to be tested
 * @returns True or false, depending on whether given file is an image
 */
export const validateImageFile = (imageFile: File | undefined): boolean => {
  if (!imageFile) return false;
  const imageNamePattern = /^.+\.(png|jpeg|jpg)$/;
  const imageTypePattern = /^image\/(png|jpeg|jpg)$/;
  return (
    imageNamePattern.test(imageFile.name.toLowerCase()) &&
    imageTypePattern.test(imageFile.type)
  );
};
