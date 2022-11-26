/**
 * Calculate remaining time from given time until current time (in milliseconds)
 * @param {string} targetTime The target time until which we want to calculate the remaining time
 *
 * @return {number} The remaining time (in milliseconds) from now until given targetTime
 */
export const calculateRemainingTime = (targetTime: string | null) => {
  if (!targetTime) return 0;
  const currentTime: number = new Date().getTime();
  const adjustedTargetTime: number = new Date(targetTime).getTime();
  if (Number.isNaN(adjustedTargetTime)) return 0;

  return adjustedTargetTime - currentTime;
};
