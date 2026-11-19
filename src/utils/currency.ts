export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  const numStr = value.replace(/[^\d.-]/g, '');
  return parseFloat(numStr) || 0;
};
