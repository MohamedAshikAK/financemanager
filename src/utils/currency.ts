export const formatCurrency = (amount: number, currency: string = 'INR', locale: string = 'en-IN'): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    // Fallback to simple formatting
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export const parseCurrency = (value: string): number => {
  const numStr = value.replace(/[^\d.-]/g, '');
  return parseFloat(numStr) || 0;
};
