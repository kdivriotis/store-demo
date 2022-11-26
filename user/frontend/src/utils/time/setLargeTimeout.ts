/**
 * Extend setTimeout function to accept timeout values larger than 2^31-1 (maximum timeout value)
 * @param {Function} callback The callback function to be executed after the timeout has expired
 * @param {number} delay The delay time in milliseconds until timeout expiration
 * @returns {ReturnType<typeof setTimeout>} Timeout that can be used for clearTimeout etc (same as setTimeout's return)
 */
export const setLargeTimeout = (
  callback: Function,
  delay: number
): ReturnType<typeof setTimeout> => {
  const maxDelay = Math.pow(2, 31) - 1; // calculate the maximum delay value

  // given delay is larger than the maximum delay:
  if (delay > maxDelay) {
    const newDelay = delay - maxDelay; // decrement the delay by maxDelay

    return setTimeout(() => setLargeTimeout(callback, newDelay), maxDelay); // recursively call setLargeTimeout until delay is <= maximum
  }

  // given delay is below the maximum delay: call setTimeout with the given delay and callback function
  return setTimeout(() => callback(), delay);
};
