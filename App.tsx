import React, { useState, useEffect, useMemo } from 'react';
import { Wallet, Globe } from 'lucide-react';
import { Expense, FilterState, CURRENCIES, Currency } from './types';
import { getExpenses, saveExpenses, getCurrencyCode, saveCurrencyCode } from './services/storage';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryCards from './components/SummaryCards';
import FilterBar from './components/FilterBar';
import ExpenseChart from './components/ExpenseChart';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currencyCode, setCurrencyCode] = useState<string>(getCurrencyCode());
  const [filters, setFilters] = useState<FilterState>(() => {
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return {
      month: monthStr,
      category: 'All',
      search: '',
    };
  });

  // Derived currency object
  const currency = useMemo(() => {
    return CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  }, [currencyCode]);

  // Load from storage on mount
  useEffect(() => {
    const loaded = getExpenses();
    setExpenses(loaded);
  }, []);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setCurrencyCode(newCode);
    saveCurrencyCode(newCode);
  };

  // Handler to add expense
  const handleAddExpense = (newExpense: Expense) => {
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
  };

  // Handler to delete expense
  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
  };

  // Compute filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // 1. Filter by Month
      // expense.date is YYYY-MM-DD, filter.month is YYYY-MM
      if (!expense.date.startsWith(filters.month)) return false;

      // 2. Filter by Category
      if (filters.category !== 'All' && expense.category !== filters.category) return false;

      // 3. Filter by Search (Notes)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const noteMatch = expense.note.toLowerCase().includes(searchLower);
        if (!noteMatch) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort desc date
  }, [expenses, filters]);

  // Compute totals
  const summary = useMemo(() => {
    const totalOverall = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Total for the selected month
    const currentMonthTotal = expenses
      .filter(e => e.date.startsWith(filters.month))
      .reduce((sum, e) => sum + e.amount, 0);

    return { totalOverall, currentMonthTotal };
  }, [expenses, filters.month]);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Wallet size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">Check Your Wallet</h1>
              <p className="text-xs text-slate-500 font-medium">Track your spending, simply.</p>
            </div>
          </div>
          
          {/* Currency Selector */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-slate-400 text-sm mr-2">
              <Globe size={14} />
              <span>Currency</span>
            </div>
            <select 
              value={currencyCode} 
              onChange={handleCurrencyChange}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Summary Section */}
        <SummaryCards 
          totalOverall={summary.totalOverall} 
          totalMonth={summary.currentMonthTotal}
          count={filteredExpenses.length}
          currencySymbol={currency.symbol}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form & Filters */}
          <div className="lg:col-span-1 space-y-6">
             <ExpenseForm onAddExpense={handleAddExpense} currencySymbol={currency.symbol} />
             
             <FilterBar filters={filters} onFilterChange={setFilters} />
             
             {/* Chart in sidebar for desktop */}
             <div className="hidden lg:block">
               <ExpenseChart expenses={filteredExpenses} currencySymbol={currency.symbol} />
             </div>
          </div>

          {/* Right Column: List & Chart (Mobile) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="lg:hidden">
               <ExpenseChart expenses={filteredExpenses} currencySymbol={currency.symbol} />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-800">Transactions</h2>
              <span className="text-sm text-slate-500">
                {new Date(filters.month).toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' })}
              </span>
            </div>

            <ExpenseList 
              expenses={filteredExpenses} 
              onDeleteExpense={handleDeleteExpense} 
              currencySymbol={currency.symbol}
            />
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-8">
        Check Your Wallet – Expense Tracker | Mini Project
      </footer>
    </div>
  );
};

export default App;