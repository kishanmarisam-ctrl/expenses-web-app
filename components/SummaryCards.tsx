import React from 'react';
import { DollarSign, Calendar, CreditCard, Coins } from 'lucide-react';

interface SummaryCardsProps {
  totalOverall: number;
  totalMonth: number;
  count: number;
  currencySymbol: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ totalOverall, totalMonth, count, currencySymbol }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Monthly Total */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 transition-transform hover:-translate-y-1 duration-300">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
          <Calendar size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">This Month</p>
          <h3 className="text-2xl font-bold text-slate-800">{currencySymbol}{totalMonth.toFixed(2)}</h3>
        </div>
      </div>

      {/* Overall Total */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 transition-transform hover:-translate-y-1 duration-300">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
          <Coins size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Total Spent</p>
          <h3 className="text-2xl font-bold text-slate-800">{currencySymbol}{totalOverall.toFixed(2)}</h3>
        </div>
      </div>

      {/* Transaction Count */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 transition-transform hover:-translate-y-1 duration-300">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
          <CreditCard size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Total Transactions</p>
          <h3 className="text-2xl font-bold text-slate-800">{count}</h3>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
