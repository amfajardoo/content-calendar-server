const currencyDecimals: Record<string, number> = {
	USD: 2,
	EUR: 2,
	JPY: 0,
	BTC: 8,
};

export function getDecimalsForCurrency(currency: string): number {
	return currencyDecimals[currency] ?? 2;
}

export function toCurrency(value: unknown, decimals = 2): number {
	if (value === null || value === undefined) return 0;
	return Number(Number(value).toFixed(decimals));
}
