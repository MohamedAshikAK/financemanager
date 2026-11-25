import { formatCurrency } from '../../utils/currency';

describe('formatCurrency', () => {
  it('should format amount in INR', () => {
    expect(formatCurrency(1000, 'INR')).toBe('₹1,000');
  });

  it('should format amount in USD', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000');
  });

  it('should format amount in EUR', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0, 'INR')).toBe('₹0');
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(1000000, 'INR')).toBe('₹10,00,000');
  });
});
