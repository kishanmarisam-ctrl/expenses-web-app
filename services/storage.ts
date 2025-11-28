import { Expense } from '../types';

const STORAGE_KEY = 'buckwheat_expenses';
const CURRENCY_KEY = 'buckwheat_currency';

export const getExpenses = (): Expense[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load expenses", e);
    return [];
  }
};

export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.error("Failed to save expenses", e);
  }
};

export const getCurrencyCode = (): string => {
  try {
    return localStorage.getItem(CURRENCY_KEY) || 'USD';
  } catch (e) {
    return 'USD';
  }
};

export const saveCurrencyCode = (code: string): void => {
  try {
    localStorage.setItem(CURRENCY_KEY, code);
  } catch (e) {
    console.error("Failed to save currency", e);
  }
};
