export const convertAmountFromOnChainToHumanReadable = (
  amount: number,
  decimals: number
) => {
  return amount / 10 ** decimals;
};

export const convertAmountFromHumanReadableToOnChain = (
  amount: number,
  decimals: number
) => {
  return amount * 10 ** decimals;
};
