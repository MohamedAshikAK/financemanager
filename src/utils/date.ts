import { format, parseISO, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const getMonthStart = (date: Date): Date => {
  return startOfMonth(date);
};

export const getMonthEnd = (date: Date): Date => {
  return endOfMonth(date);
};

export const isOverdue = (dueDate: string): boolean => {
  const due = parseISO(dueDate);
  const now = new Date();
  return differenceInDays(now, due) > 0;
};

export const isDueSoon = (dueDate: string): boolean => {
  const due = parseISO(dueDate);
  const now = new Date();
  const daysUntilDue = differenceInDays(due, now);
  return daysUntilDue >= 0 && daysUntilDue <= 3;
};
