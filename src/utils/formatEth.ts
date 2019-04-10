/**
 * Converts a wei value to a more easily readable format
 * @param wei - The amount to format in wei.
 */
export function formatEth(
  wei: number,
): { formattedAmount: number; unit: string } {
  let formattedAmount = wei
  let unit = 'WEI'
  if (wei >= 1e6 && wei < 1e15) {
    formattedAmount = formattedAmount / 1e9
    unit = 'GWEI'
  } else if (wei >= 1e15) {
    formattedAmount = formattedAmount / 1e18
    unit = 'ETH'
  }
  return { formattedAmount, unit }
}
