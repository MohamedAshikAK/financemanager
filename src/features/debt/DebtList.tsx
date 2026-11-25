import { useState, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowDownLeft, ArrowUpRight, CreditCard, ArrowLeft, History, CheckCircle, ArrowRight } from 'lucide-react';
import { useDebtStore } from '../../store/debtStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { ListSkeleton } from '../../components/LoadingSkeleton';
import type { DebtRecord } from '../../store/debtStore';

function DebtList() {
  const navigate = useNavigate();
  const debts = useDebtStore((state) => state.debts);
  const getContact = useContactStore((state) => state.getContact);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useDebtStore((state) => state.isHydrated);
  const settleDebt = useDebtStore((state) => state.settleDebt);
  const settleAllDebtsForContact = useDebtStore((state) => state.settleAllDebtsForContact);

  const [filter, setFilter] = useState<'all' | 'owed-to-me' | 'owed-by-me' | 'history'>('all');
  const [showSettleAllConfirm, setShowSettleAllConfirm] = useState<string | null>(null);

  const totalOwedToMe = useMemo(() => {
    return debts
      .filter(d => d.type === 'owed-to-me' && !d.isPaid)
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [debts]);

  const totalOwedByMe = useMemo(() => {
    return debts
      .filter(d => d.type === 'owed-by-me' && !d.isPaid)
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [debts]);

  // Group debts by contact
  const groupedDebts = useMemo(() => {
    const groups: Record<string, DebtRecord[]> = {};
    
    debts.forEach(debt => {
      if (!debt.isPaid) {
        if (!groups[debt.personId]) {
          groups[debt.personId] = [];
        }
        groups[debt.personId].push(debt);
      }
    });
    
    return groups;
  }, [debts]);

  // Filter grouped debts based on filter
  const filteredGroups = useMemo(() => {
    const result: Record<string, DebtRecord[]> = {};
    
    Object.entries(groupedDebts).forEach(([personId, debts]) => {
      if (filter === 'all') {
        result[personId] = debts;
      } else if (filter === 'owed-to-me') {
        const owedToMeDebts = debts.filter(d => d.type === 'owed-to-me');
        if (owedToMeDebts.length > 0) {
          result[personId] = owedToMeDebts;
        }
      } else if (filter === 'owed-by-me') {
        const owedByMeDebts = debts.filter(d => d.type === 'owed-by-me');
        if (owedByMeDebts.length > 0) {
          result[personId] = owedByMeDebts;
        }
      }
    });
    
    return result;
  }, [groupedDebts, filter]);

  const filteredDebts = useMemo(() => {
    return debts.filter(debt => {
      if (filter === 'history') return debt.isPaid && debt.settledAt;
      return debt.type === filter && !debt.isPaid;
    });
  }, [debts, filter]);

  const handleSettleAll = (personId: string) => {
    settleAllDebtsForContact(personId);
    setShowSettleAllConfirm(null);
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <ArrowDownLeft size={16} className="text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-slate-600">Owed to Me</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalOwedToMe, currency)}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-red-100 rounded-xl">
              <ArrowUpRight size={16} className="text-red-600" />
            </div>
            <span className="text-xs font-medium text-slate-600">Owed by Me</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalOwedByMe, currency)}</div>
        </div>
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

      {Object.keys(filteredGroups).length === 0 && filter !== 'history' ? (
        <div className="text-center py-16">
          <div className="w-20 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={18} className="text-slate-400" />
          </div>
          <p className="text-slate-500 mb-1">No debts found</p>
          <p className="text-sm text-slate-400">Tap "Add Debt" to get started</p>
        </div>
      ) : filter !== 'history' ? (
        <div className="space-y-3">
          {Object.entries(filteredGroups).map(([personId, contactDebts]) => {
            const contact = getContact(personId);
            const totalAmount = contactDebts.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
            const lastDate = contactDebts.reduce((latest, d) => 
              new Date(d.createdAt) > new Date(latest.createdAt) ? d : latest, 
              contactDebts[0]
            );
            const hasOwedToMe = contactDebts.some(d => d.type === 'owed-to-me');
            const hasOwedByMe = contactDebts.some(d => d.type === 'owed-by-me');

            return (
              <div
                key={personId}
                className="card hover:shadow-md transition-all duration-200 p-3"
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/debt/contact/${personId}`)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {contact?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 truncate">{contact?.name || 'Unknown'}</h3>
                        <div className="text-xs text-slate-500">
                          {contactDebts.length} debt{contactDebts.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className={`text-lg font-bold ${
                        hasOwedToMe && !hasOwedByMe ? 'text-emerald-600' : 
                        hasOwedByMe && !hasOwedToMe ? 'text-red-600' : 'text-slate-800'
                      }`}>
                        {formatCurrency(totalAmount, currency)}
                      </div>
                      <div className="text-xs text-slate-500">
                        Added: {formatDate(lastDate.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0 ml-3">
                    <button
                      onClick={() => setShowSettleAllConfirm(personId)}
                      className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-xl transition-colors flex-shrink-0"
                      title="Settle All"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/debt/form?action=add&personId=${personId}`)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors flex-shrink-0"
                      title="Add Debt"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/debt/contact/${personId}`)}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0"
                      title="View Details"
                    >
                      <ArrowRight size={16} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {showSettleAllConfirm === personId && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-600 mb-3">
                      Settle all {contactDebts.length} debts for {contact?.name || 'Unknown'}? They will be moved to history.
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowSettleAllConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
                      <button onClick={() => handleSettleAll(personId)} className="flex-1 btn-primary">Settle All</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // History view - show individual settled debts
        <div className="space-y-3">
          {filteredDebts.map((debt) => {
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
          })}
        </div>
      )}
    </div>
  );
}

export default memo(DebtList);
