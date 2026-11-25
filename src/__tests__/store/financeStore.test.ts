import { renderHook, act } from '@testing-library/react';
import { useFinanceStore } from '../../store/financeStore';

describe('financeStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add entry', () => {
    const { result } = renderHook(() => useFinanceStore());
    act(() => {
      result.current.addEntry({
        title: 'Test',
        amount: 100,
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString(),
        isRecurring: false,
      });
    });
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].title).toBe('Test');
  });

  it('should delete entry', () => {
    const { result } = renderHook(() => useFinanceStore());
    act(() => {
      result.current.addEntry({
        title: 'Test',
        amount: 100,
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString(),
        isRecurring: false,
      });
    });
    const id = result.current.entries[0].id;
    act(() => {
      result.current.deleteEntry(id);
    });
    expect(result.current.entries).toHaveLength(0);
  });

  it('should calculate total amount', () => {
    const { result } = renderHook(() => useFinanceStore());
    act(() => {
      result.current.addEntry({
        title: 'Income',
        amount: 1000,
        type: 'income',
        category: 'Salary',
        date: new Date().toISOString(),
        isRecurring: false,
      });
      result.current.addEntry({
        title: 'Expense',
        amount: 500,
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString(),
        isRecurring: false,
      });
    });
    expect(result.current.getTotalAmount()).toBe(500);
  });
});
