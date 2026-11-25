import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, CreditCard, AlertCircle, Plus, ArrowRight, User } from 'lucide-react';
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
      <div className="p-3 text-center text-slate-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-3 space-y-6">
      {/* Modern Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-blue-100">Balance (This Month)</span>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Wallet size={18} />
            </div>
          </div>
          <div className="text-4xl font-bold mb-6 tracking-tight">
            {formatCurrency(balance, currency)}
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/30 rounded-lg">
                <TrendingUp size={16} />
              </div>
              <div>
                <div className="text-xs text-blue-200">Income</div>
                <div className="font-semibold">{formatCurrency(monthlyIncome, currency)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-500/30 rounded-lg">
                <TrendingDown size={16} />
              </div>
              <div>
                <div className="text-xs text-blue-200">Expenses</div>
                <div className="font-semibold">{formatCurrency(monthlyExpenses, currency)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="stat-card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <CreditCard size={18} className="text-orange-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">Pending Debts</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">
            {pendingDebts}
          </div>
        </div>
        <div className="stat-card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-3 rounded-xl ${overdueBills > 0 ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <AlertCircle size={18} className={overdueBills > 0 ? 'text-red-600' : 'text-yellow-600'} />
            </div>
            <span className="text-sm font-medium text-slate-600">
              {overdueBills > 0 ? 'Overdue' : 'Upcoming'}
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-800">
            {overdueBills > 0 ? overdueBills : upcomingBills}
          </div>
        </div>
      </div>

      {/* Modern Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/debt/form?action=add')}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2 rounded-xl font-semibold flex items-center justify-between px-6 shadow-lg shadow-purple-500/30 transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Plus size={18} />
              </div>
              <span>Add Debt</span>
            </div>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Modern Navigation Cards */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">All Sections</h2>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/finance')}
            className="w-full card hover:shadow-md transition-all duration-200 p-3 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                <Wallet size={18} className="text-blue-600" />
              </div>
              <span className="font-semibold text-slate-800">Finance</span>
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </button>
          <button
            onClick={() => navigate('/debt')}
            className="w-full card hover:shadow-md transition-all duration-200 p-3 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                <CreditCard size={18} className="text-purple-600" />
              </div>
              <span className="font-semibold text-slate-800">Debts</span>
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </button>
          <button
            onClick={() => navigate('/bills')}
            className="w-full card hover:shadow-md transition-all duration-200 p-3 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <div className="p-3 bg-amber-100 rounded-xl group-hover:scale-110 transition-transform">
                <AlertCircle size={18} className="text-amber-600" />
              </div>
              <span className="font-semibold text-slate-800">Credit Bills</span>
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
          </button>
          <button
            onClick={() => navigate('/contacts')}
            className="w-full card hover:shadow-md transition-all duration-200 p-3 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <div className="p-3 bg-teal-100 rounded-xl group-hover:scale-110 transition-transform">
                <User size={18} className="text-teal-600" />
              </div>
              <span className="font-semibold text-slate-800">Contacts</span>
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
