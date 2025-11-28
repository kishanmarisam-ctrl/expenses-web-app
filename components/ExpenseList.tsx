import React from 'react';
import { Trash2, ShoppingBag, Coffee, Plane, Receipt, Clapperboard, HelpCircle } from 'lucide-react';
import { Expense, Category } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  currencySymbol: string;
}

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'Food': return <Coffee size={18} />;
    case 'Shopping': return <ShoppingBag size={18} />;
    case 'Travel': return <Plane size={18} />;
    case 'Bills': return <Receipt size={18} />;
    case 'Entertainment': return <Clapperboard size={18} />;
    default: return <HelpCircle size={18} />;
  }
};

const getCategoryColor = (category: Category) => {
   switch (category) {
    case 'Food': return 'text-orange-600 bg-orange-50';
    case 'Shopping': return 'text-blue-600 bg-blue-50';
    case 'Travel': return 'text-sky-600 bg-sky-50';
    case 'Bills': return 'text-red-600 bg-red-50';
    case 'Entertainment': return 'text-purple-600 bg-purple-50';
    default: return 'text-slate-600 bg-slate-100';
  }
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense, currencySymbol }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center h-full">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <Receipt className="text-slate-300" size={48} />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">No expenses found</h3>
        <p className="text-slate-500 mt-1">Adjust your filters or add a new expense to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Note</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-50 transition-colors group">
                <td className="py-4 px-6 text-sm text-slate-600 whitespace-nowrap">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-sm">
                  <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                    {getCategoryIcon(expense.category)}
                    {expense.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-600 max-w-xs truncate">
                  {expense.note || <span className="text-slate-300 italic">No notes</span>}
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-slate-800 text-right">
                  {currencySymbol}{expense.amount.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete Expense"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
