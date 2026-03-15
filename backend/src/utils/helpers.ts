export const bettingTime = 5000;

export const profitability = 0.2;

export const maskNumber = (num: number | string, visibleStart = 1, visibleEnd = 1): string => {
	const str = String(num);
	if (str.length <= visibleStart + visibleEnd) return str;
	const hidden = '*'.repeat(str.length - visibleStart - visibleEnd);
	return str.slice(0, visibleStart) + hidden + str.slice(-visibleEnd);
};

export function ceilTo(value: number, decimals: number) {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
}