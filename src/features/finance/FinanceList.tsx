import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, Wallet, ArrowLeft } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';

export default function FinanceList() {
  const navigate = useNavigate();
  const entries = useFinanceStore((state) => state.entries);
  const deleteEntry = useFinanceStore((state) => state.deleteEntry);
  const togglePayment = useFinanceStore((state) => state.togglePayment);
  const isPaidThisMonth = useFinanceStore((state) => state.isPaidThisMonth);
  const getTotalAmount = useFinanceStore((state) => state.getTotalAmount);
  const getPaidAmount = useFinanceStore((state) => state.getPaidAmount);
  const getUnpaidAmount = useFinanceStore((state) => state.getUnpaidAmount);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useFinanceStore((state) => state.isHydrated);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const currentMonthKey = format(new Date(), 'yyyy-MM');
  const currentMonthDisplay = format(new Date(), 'MMMM yyyy');

  const totalAmount = getTotalAmount();
  const paidAmount = getPaidAmount(currentMonthKey);
  const unpaidAmount = getUnpaidAmount(currentMonthKey);

  const handleDelete = useCallback((id: string) => {
    deleteEntry(id);
    setShowDeleteConfirm(null);
  }, [deleteEntry]);

  const handleTogglePayment = useCallback((id: string) => {
    togglePayment(id, currentMonthKey);
  }, [togglePayment, currentMonthKey]);

  if (!isHydrated) {
    return (
      <div className="p-4 text-center text-slate-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Monthly Expenses</h1>
          <p className="text-sm text-slate-500">{currentMonthDisplay}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-500/30">
          <div className="text-xs text-blue-100 mb-1">Total</div>
          <div className="text-lg font-bold">{formatCurrency(totalAmount, currency)}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg shadow-emerald-500/30">
          <div className="text-xs text-emerald-100 mb-1">Paid</div>
          <div className="text-lg font-bold">{formatCurrency(paidAmount, currency)}</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-4 text-white shadow-lg shadow-red-500/30">
          <div className="text-xs text-red-100 mb-1">Unpaid</div>
          <div className="text-lg font-bold">{formatCurrency(unpaidAmount, currency)}</div>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => navigate('/finance/form?action=add')}
        className="w-full btn-primary flex items-center justify-center gap-2"
        aria-label="Add new finance entry"
      >
        <Plus size={20} />
        Add Entry
      </button>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500 mb-1">No entries yet</p>
          <p className="text-sm text-slate-400">Tap "Add Entry" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const isPaid = isPaidThisMonth(entry.id, currentMonthKey);
            
            return (
              <div
                key={entry.id}
                className={`card hover:shadow-md transition-all duration-200 p-4 ${
                  isPaid ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">{entry.title}</h3>
                    <div className={`text-2xl font-bold ${
                      isPaid ? 'text-emerald-600' : 'text-slate-800'
                    }`}>
                      {formatCurrency(entry.amount, currency)}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleTogglePayment(entry.id)}
                    className={`p-3 rounded-2xl transition-all duration-200 ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-600 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <Check size={22} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className={`text-sm font-medium ${
                    isPaid ? 'text-emerald-600' : 'text-slate-500'
                  }`}>
                    {isPaid ? '✓ Paid this month' : '○ Unpaid'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/finance/form?action=edit&id=${entry.id}`)}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <Edit size={18} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(entry.id)}
                      className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {showDeleteConfirm === entry.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 mb-3">
                      Delete "{entry.title}"?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="flex-1 btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
