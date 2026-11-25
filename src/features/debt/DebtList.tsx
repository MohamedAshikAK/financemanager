import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowDownLeft, ArrowUpRight, ChevronRight, CreditCard, ArrowLeft, History, CheckCircle } from 'lucide-react';
import { useDebtStore } from '../../store/debtStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { isOverdue, isDueSoon, formatDate } from '../../utils/date';
import { ListSkeleton } from '../../components/LoadingSkeleton';

export default function DebtList() {
  const navigate = useNavigate();
  const debts = useDebtStore((state) => state.debts);
  const getContact = useContactStore((state) => state.getContact);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useDebtStore((state) => state.isHydrated);
  const settleDebt = useDebtStore((state) => state.settleDebt);

  const [filter, setFilter] = useState<'all' | 'owed-to-me' | 'owed-by-me' | 'history'>('all');
  const [showSettleConfirm, setShowSettleConfirm] = useState<string | null>(null);

  const filteredDebts = useMemo(() => {
    return debts.filter(debt => {
      if (filter === 'all') return !debt.isPaid;
      if (filter === 'history') return debt.isPaid && debt.settledAt;
      return debt.type === filter && !debt.isPaid;
    });
  }, [debts, filter]);

  const handleSettle = (id: string) => {
    settleDebt(id);
    setShowSettleConfirm(null);
  };

  if (!isHydrated) {
    return (
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-12 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-6 bg-slate-200 rounded animate-pulse flex-1" />
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <div className="flex-1 h-8 bg-slate-200 rounded-xl animate-pulse" />
          <div className="flex-1 h-8 bg-slate-200 rounded-xl animate-pulse" />
          <div className="flex-1 h-8 bg-slate-200 rounded-xl animate-pulse" />
        </div>
        <ListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          aria-label="Go back to home"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Debts</h1>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
            filter === 'all'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('owed-to-me')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
            filter === 'owed-to-me'
              ? 'bg-white text-emerald-600 shadow-md'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          Owed to Me
        </button>
        <button
          onClick={() => setFilter('owed-by-me')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
            filter === 'owed-by-me'
              ? 'bg-white text-red-600 shadow-md'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          Owed by Me
        </button>
        <button
          onClick={() => setFilter('history')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
            filter === 'history'
              ? 'bg-white text-slate-600 shadow-md'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          History
        </button>
      </div>

      {filter !== 'history' && (
        <button
          onClick={() => navigate('/debt/form?action=add')}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Debt
        </button>
      )}

      {filteredDebts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {filter === 'history' ? <History size={18} className="text-slate-400" /> : <CreditCard size={18} className="text-slate-400" />}
          </div>
          <p className="text-slate-500 mb-1">{filter === 'history' ? 'No settled debts' : 'No debts found'}</p>
          <p className="text-sm text-slate-400">{filter === 'history' ? 'Settled debts will appear here' : 'Tap "Add Debt" to get started'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filter === 'history' ? (
            // History view - show individual settled debts
            filteredDebts.map((debt) => {
              const contact = getContact(debt.personId);
              return (
                <div key={debt.id} className="card hover:shadow-md transition-all duration-200 p-3 opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-xl ${
                          debt.type === 'owed-to-me' ? 'bg-emerald-100' : 'bg-red-100'
                        }`}>
                          {debt.type === 'owed-to-me' ? (
                            <ArrowDownLeft size={18} className="text-emerald-600" />
                          ) : (
                            <ArrowUpRight size={18} className="text-red-600" />
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-800">{contact?.name || 'Unknown'}</h3>
                      </div>
                      <div className={`text-xl font-bold ${
                        debt.type === 'owed-to-me' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {debt.type === 'owed-to-me' ? '+' : '-'}
                        {formatCurrency(debt.amount, currency)}
                      </div>
                      {debt.settledAt && (
                        <div className="text-xs text-slate-500 mt-1">
                          Settled on {formatDate(debt.settledAt)}
                        </div>
                      )}
                    </div>
                    <History size={18} className="text-slate-400" />
                  </div>
                </div>
              );
            })
          ) : (
            // Grouped view for pending debts - show individual debts with settle buttons
            filteredDebts.map((debt) => {
              const contact = getContact(debt.personId);
              const overdue = debt.dueDate ? isOverdue(debt.dueDate) : false;
              const dueSoon = debt.dueDate ? isDueSoon(debt.dueDate) : false;

              return (
                <div
                  key={debt.id}
                  className={`card hover:shadow-md transition-all duration-200 p-3 ${
                    overdue ? 'border-red-300' : dueSoon ? 'border-amber-300' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-xl ${
                          debt.type === 'owed-to-me' ? 'bg-emerald-100' : 'bg-red-100'
                        }`}>
                          {debt.type === 'owed-to-me' ? (
                            <ArrowDownLeft size={18} className="text-emerald-600" />
                          ) : (
                            <ArrowUpRight size={18} className="text-red-600" />
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-800">{contact?.name || 'Unknown'}</h3>
                      </div>
                      <div className={`text-xl font-bold ${
                        debt.type === 'owed-to-me' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {debt.type === 'owed-to-me' ? '+' : '-'}
                        {formatCurrency(debt.amount, currency)}
                      </div>
                      {debt.dueDate && (
                        <div className={`text-xs font-medium mt-1 ${
                          overdue ? 'text-red-600' : dueSoon ? 'text-amber-600' : 'text-slate-500'
                        }`}>
                          {overdue ? `Overdue: ${formatDate(debt.dueDate)}` : dueSoon ? `Due: ${formatDate(debt.dueDate)}` : formatDate(debt.dueDate)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowSettleConfirm(debt.id)}
                      className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors"
                      title="Settle debt"
                    >
                      <CheckCircle size={18} />
                    </button>
                  </div>
                  {debt.note && <div className="text-sm text-slate-600 mt-2">{debt.note}</div>}
                  {showSettleConfirm === debt.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-sm text-slate-600 mb-3">Settle this debt? It will be moved to history.</p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowSettleConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
                        <button onClick={() => handleSettle(debt.id)} className="flex-1 btn-primary">Settle</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
