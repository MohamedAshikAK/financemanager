/**
 * Simple input sanitization to prevent XSS attacks
 * This is a basic implementation - for production, consider using DOMPurify
 */

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
};

export const sanitizeNumber = (input: string): number => {
  const sanitized = input.replace(/[^\d.-]/g, '');
  return parseFloat(sanitized) || 0;
};

export const sanitizeEmail = (input: string): string => {
  // Basic email sanitization
  return input
    .replace(/[<>]/g, '')
    .trim()
    .toLowerCase();
};

export const sanitizePhone = (input: string): string => {
  // Allow only digits, +, -, spaces, and parentheses
  return input.replace(/[^\d+\-\s()]/g, '').trim();
};
