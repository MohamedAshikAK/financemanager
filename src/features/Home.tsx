import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, CreditCard, AlertCircle, Plus } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { useDebtStore } from '../store/debtStore';
import { useCreditBillStore } from '../store/creditBillStore';
import { useSettingsStore } from '../store/settingsStore';
import { formatCurrency } from '../utils/currency';
import { getMonthStart, getMonthEnd, isDueSoon, isOverdue } from '../utils/date';

export default function Home() {
  const navigate = useNavigate();
  const entries = useFinanceStore((state) => state.entries);
  const debts = useDebtStore((state) => state.debts);
  const bills = useCreditBillStore((state) => state.bills);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useFinanceStore((state) => state.isHydrated);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setCurrentMonth(new Date());
  }, []);

  const monthStart = getMonthStart(currentMonth);
  const monthEnd = getMonthEnd(currentMonth);

  const monthlyIncome = entries
    .filter(e => {
      const date = new Date(e.date);
      return e.type === 'income' && date >= monthStart && date <= monthEnd;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyExpenses = entries
    .filter(e => {
      const date = new Date(e.date);
      return e.type === 'expense' && date >= monthStart && date <= monthEnd;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = monthlyIncome - monthlyExpenses;

  const pendingDebts = debts.filter(d => !d.isPaid).length;
  const upcomingBills = bills.filter(b => !b.isPaid && isDueSoon(b.dueDate)).length;
  const overdueBills = bills.filter(b => !b.isPaid && isOverdue(b.dueDate)).length;

  if (!isHydrated) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">Balance (This Month)</span>
          <Wallet size={20} />
        </div>
        <div className="text-3xl font-bold mb-4">
          {formatCurrency(balance, currency)}
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-green-300" />
            <span className="text-sm">
              In: {formatCurrency(monthlyIncome, currency)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown size={16} className="text-red-300" />
            <span className="text-sm">
              Out: {formatCurrency(monthlyExpenses, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={18} className="text-orange-500" />
            <span className="text-sm text-gray-600">Pending Debts</span>
          </div>
          <div className="text-2xl font-semibold text-gray-800">
            {pendingDebts}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className={overdueBills > 0 ? 'text-red-500' : 'text-yellow-500'} />
            <span className="text-sm text-gray-600">
              {overdueBills > 0 ? 'Overdue Bills' : 'Upcoming Bills'}
            </span>
          </div>
          <div className="text-2xl font-semibold text-gray-800">
            {overdueBills > 0 ? overdueBills : upcomingBills}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/finance?action=add&type=expense')}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Expense
          </button>
          <button
            onClick={() => navigate('/finance?action=add&type=income')}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Income
          </button>
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">All Sections</h2>
        <div className="space-y-2">
          <button
            onClick={() => navigate('/finance')}
            className="w-full bg-white hover:bg-gray-50 p-4 rounded-xl text-left flex items-center justify-between transition-colors shadow-sm border border-gray-100"
          >
            <span className="font-medium text-gray-800">Finance</span>
            <Wallet size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => navigate('/debt')}
            className="w-full bg-white hover:bg-gray-50 p-4 rounded-xl text-left flex items-center justify-between transition-colors shadow-sm border border-gray-100"
          >
            <span className="font-medium text-gray-800">Debts</span>
            <CreditCard size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => navigate('/bills')}
            className="w-full bg-white hover:bg-gray-50 p-4 rounded-xl text-left flex items-center justify-between transition-colors shadow-sm border border-gray-100"
          >
            <span className="font-medium text-gray-800">Credit Bills</span>
            <AlertCircle size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => navigate('/groups')}
            className="w-full bg-white hover:bg-gray-50 p-4 rounded-xl text-left flex items-center justify-between transition-colors shadow-sm border border-gray-100"
          >
            <span className="font-medium text-gray-800">Groups</span>
            <AlertCircle size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => navigate('/contacts')}
            className="w-full bg-white hover:bg-gray-50 p-4 rounded-xl text-left flex items-center justify-between transition-colors shadow-sm border border-gray-100"
          >
            <span className="font-medium text-gray-800">Contacts</span>
            <AlertCircle size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
