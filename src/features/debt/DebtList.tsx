import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowDownLeft, ArrowUpRight, ChevronRight, CreditCard, ArrowLeft } from 'lucide-react';
import { useDebtStore } from '../../store/debtStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { isOverdue, isDueSoon } from '../../utils/date';
import { ListSkeleton } from '../../components/LoadingSkeleton';

export default function DebtList() {
  const navigate = useNavigate();
  const debts = useDebtStore((state) => state.debts);
  const getContact = useContactStore((state) => state.getContact);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useDebtStore((state) => state.isHydrated);

  const [filter, setFilter] = useState<'all' | 'owed-to-me' | 'owed-by-me'>('all');

  const filteredDebts = debts.filter(debt => {
    if (filter === 'all') return !debt.isPaid;
    return debt.type === filter && !debt.isPaid;
  });

  const groupedDebts = filteredDebts.reduce((acc, debt) => {
    const key = debt.personId;
    if (!acc[key]) {
      acc[key] = {
        personId: debt.personId,
        totalAmount: 0,
        debts: [],
        type: debt.type,
      };
    }
    acc[key].totalAmount += Number(debt.amount) || 0;
    acc[key].debts.push(debt);
    return acc;
  }, {} as Record<string, { personId: string; totalAmount: number; debts: any[]; type: string }>);

  if (!isHydrated) {
    return (
      <div className="p-5 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-6 bg-slate-200 rounded animate-pulse flex-1" />
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          <div className="flex-1 h-8 bg-slate-200 rounded-xl animate-pulse" />
          <div className="flex-1 h-8 bg-slate-200 rounded-xl animate-pulse" />
          <div className="flex-1 h-8 bg-slate-200 rounded-xl animate-pulse" />
        </div>
        <ListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Debts</h1>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            filter === 'all'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('owed-to-me')}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            filter === 'owed-to-me'
              ? 'bg-white text-emerald-600 shadow-md'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          Owed to Me
        </button>
        <button
          onClick={() => setFilter('owed-by-me')}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            filter === 'owed-by-me'
              ? 'bg-white text-red-600 shadow-md'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          Owed by Me
        </button>
      </div>

      <button
        onClick={() => navigate('/debt/form?action=add')}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Debt
      </button>

      {Object.keys(groupedDebts).length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500 mb-1">No debts found</p>
          <p className="text-sm text-slate-400">Tap "Add Debt" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.values(groupedDebts).map((group) => {
            const contact = getContact(group.personId);
            const hasOverdue = group.debts.some(d => d.dueDate && isOverdue(d.dueDate));
            const hasDueSoon = group.debts.some(d => d.dueDate && isDueSoon(d.dueDate));

            return (
              <div
                key={group.personId}
                onClick={() => navigate(`/debt/contact/${group.personId}`)}
                className={`card hover:shadow-md transition-all duration-200 p-4 cursor-pointer ${
                  hasOverdue
                    ? 'border-red-300'
                    : hasDueSoon
                    ? 'border-amber-300'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-xl ${
                        group.type === 'owed-to-me' ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        {group.type === 'owed-to-me' ? (
                          <ArrowDownLeft size={18} className="text-emerald-600" />
                        ) : (
                          <ArrowUpRight size={18} className="text-red-600" />
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-800">{contact?.name || 'Unknown'}</h3>
                    </div>
                    <div className={`text-2xl font-bold ${
                      group.type === 'owed-to-me' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {group.type === 'owed-to-me' ? '+' : '-'}
                      {formatCurrency(group.totalAmount, currency)}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {group.debts.length} debt{group.debts.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
