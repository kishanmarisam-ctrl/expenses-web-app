import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense, Category } from '../types';

interface ExpenseChartProps {
  expenses: Expense[];
  currencySymbol: string;
}

const COLORS: Record<Category, string> = {
  Food: '#f97316', // orange-500
  Travel: '#0ea5e9', // sky-500
  Shopping: '#2563eb', // blue-600
  Bills: '#dc2626', // red-600
  Entertainment: '#9333ea', // purple-600
  Other: '#64748b', // slate-500
};

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses, currencySymbol }) => {
  const data = useMemo(() => {
    const map = new Map<Category, number>();
    expenses.forEach((e) => {
      const current = map.get(e.category) || 0;
      map.set(e.category, current + e.amount);
    });

    const result = Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    })).filter(item => item.value > 0);
    
    // Sort descending
    return result.sort((a, b) => b.value - a.value);
  }, [expenses]);

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80 flex items-center justify-center text-slate-400 text-sm">
        Not enough data to display chart.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Expenses by Category</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as Category] || '#cbd5e1'} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${currencySymbol}${value.toFixed(2)}`, 'Amount']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
