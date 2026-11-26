import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, AlertCircle, Plus, ArrowRight, User, Calendar, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useLoanStore } from '../store/loansStore';
import { useMonthlyDebtStore } from '../store/monthlyDebtStore';
import { useCreditBillStore } from '../store/creditBillStore';
import { useSettingsStore } from '../store/settingsStore';
import { formatCurrency } from '../utils/currency';
import { isDueSoon, isOverdue } from '../utils/date';

function Home() {
  const navigate = useNavigate();
  const loans = useLoanStore((state) => state.loans);
  const monthlyDebts = useMonthlyDebtStore((state) => state.monthlyDebts);
  const bills = useCreditBillStore((state) => state.bills);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useLoanStore((state) => state.isHydrated);

  const pendingLoans = loans.filter(l => !l.isPaid);
  const pendingMonthlyDebts = monthlyDebts.filter(d => !d.isPaid);
  
  const owedToMe = pendingMonthlyDebts
    .filter(d => d.type === 'owed-to-me')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const owedByMe = pendingMonthlyDebts
    .filter(d => d.type === 'owed-by-me')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const netBalance = owedToMe - owedByMe;
  
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
      <div className={`bg-gradient-to-br rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden ${
        netBalance > 0 
          ? 'from-emerald-600 via-emerald-700 to-teal-800 shadow-emerald-500/30' 
          : netBalance < 0 
          ? 'from-red-600 via-red-700 to-rose-800 shadow-red-500/30' 
          : 'from-slate-600 via-slate-700 to-slate-800 shadow-slate-500/30'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white/80">Monthly Debt Balance</span>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="text-4xl font-bold mb-6 tracking-tight">
            {netBalance > 0 ? '+' : ''}{formatCurrency(Math.abs(netBalance), currency)}
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/30 rounded-lg">
                <TrendingUp size={16} />
              </div>
              <div>
                <div className="text-xs text-white/70">Owed to Me</div>
                <div className="font-semibold">{formatCurrency(owedToMe, currency)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-500/30 rounded-lg">
                <TrendingDown size={16} />
              </div>
              <div>
                <div className="text-xs text-white/70">Owed by Me</div>
                <div className="font-semibold">{formatCurrency(owedByMe, currency)}</div>
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
            <span className="text-sm font-medium text-slate-600">Loan & Chits</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">
            {pendingLoans.length}
          </div>
        </div>
        <div className="stat-card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar size={18} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">Monthly Debts</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">
            {pendingMonthlyDebts.length}
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
            onClick={() => navigate('/loans/form?action=add')}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2 rounded-xl font-semibold flex items-center justify-between px-6 shadow-lg shadow-purple-500/30 transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Plus size={18} />
              </div>
              <span>Add Loan/Chit</span>
            </div>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/monthly-debt/form?action=add')}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-2 rounded-xl font-semibold flex items-center justify-between px-6 shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Plus size={18} />
              </div>
              <span>Add Monthly Debt</span>
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
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="p-2.5 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                <Wallet size={16} className="text-blue-600" />
              </div>
              <span className="font-semibold text-slate-800 text-sm truncate">Expense</span>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
          </button>
          <button
            onClick={() => navigate('/loans')}
            className="w-full card hover:shadow-md transition-all duration-200 p-3 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="p-2.5 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                <CreditCard size={16} className="text-purple-600" />
              </div>
              <span className="font-semibold text-slate-800 text-sm truncate">Loan & Chits</span>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
          </button>
          <button
            onClick={() => navigate('/monthly-debt')}
            className="w-full card hover:shadow-md transition-all duration-200 p-3 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="p-2.5 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <span className="font-semibold text-slate-800 text-sm truncate">Monthly Debts</span>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
          </button>
          <button
            onClick={() => navigate('/bills')}
            className="w-full card hover:shadow-md transition-all duration-200 p-3 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="p-2.5 bg-amber-100 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                <AlertCircle size={16} className="text-amber-600" />
              </div>
              <span className="font-semibold text-slate-800 text-sm truncate">Credit Bills</span>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
          </button>
          <button
            onClick={() => navigate('/contacts')}
            className="w-full card hover:shadow-md transition-all duration-200 p-3 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="p-2.5 bg-teal-100 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                <User size={16} className="text-teal-600" />
              </div>
              <span className="font-semibold text-slate-800 text-sm truncate">Contacts</span>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(Home);
