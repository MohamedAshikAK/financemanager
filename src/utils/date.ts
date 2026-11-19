import { format, startOfMonth, endOfMonth, isAfter, isBefore, addDays, addMonths, subMonths, startOfDay, endOfDay } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
};

export const formatShortDate = (date: string | Date): string => {
  return formatDate(date, 'MMM dd');
};

export const getMonthStart = (date: Date = new Date()): Date => {
  return startOfMonth(date);
};

export const getMonthEnd = (date: Date = new Date()): Date => {
  return endOfMonth(date);
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return !isBefore(date, startDate) && !isAfter(date, endDate);
};

export const getDaysUntil = (date: string | Date): number => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = startOfDay(new Date());
  const target = startOfDay(targetDate);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isOverdue = (date: string | Date): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = endOfDay(new Date());
  return isBefore(targetDate, today);
};

export const isDueSoon = (date: string | Date, days: number = 7): boolean => {
  const daysUntil = getDaysUntil(date);
  return daysUntil >= 0 && daysUntil <= days;
};

export { addMonths, subMonths };
