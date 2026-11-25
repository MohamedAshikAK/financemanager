import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, CreditCard, ArrowLeft } from 'lucide-react';
import { useCreditBillStore } from '../../store/creditBillStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate, isOverdue, isDueSoon } from '../../utils/date';
import { ListSkeleton } from '../../components/LoadingSkeleton';

function CreditBillsList() {
  const navigate = useNavigate();
  const bills = useCreditBillStore((state) => state.bills);
  const deleteBill = useCreditBillStore((state) => state.deleteBill);
  const settleBill = useCreditBillStore((state) => state.settleBill);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useCreditBillStore((state) => state.isHydrated);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    deleteBill(id);
    setShowDeleteConfirm(null);
  }, [deleteBill]);

  const handleSettle = useCallback((id: string) => {
    settleBill(id);
  }, [settleBill]);

  if (!isHydrated) {
    return (
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-12 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-6 bg-slate-200 rounded animate-pulse flex-1" />
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
        <h1 className="text-xl font-bold text-slate-800">Credit Bills</h1>
      </div>

      <button onClick={() => navigate('/bills/form?action=add')} className="w-full btn-primary flex items-center justify-center gap-2" aria-label="Add new credit bill">
        <Plus size={18} aria-hidden="true" />
        Add Bill
      </button>

      {bills.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={18} className="text-slate-400" />
          </div>
          <p className="text-slate-500 mb-1">No credit bills yet</p>
          <p className="text-sm text-slate-400">Tap "Add Bill" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bills.map((bill) => {
            const overdue = !bill.isPaid && isOverdue(bill.dueDate);
            const dueSoon = !bill.isPaid && isDueSoon(bill.dueDate);

            return (
              <div
                key={bill.id}
                className={`card hover:shadow-md transition-all duration-200 p-3 ${
                  overdue ? 'border-red-300' : dueSoon ? 'border-amber-300' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-xl flex-shrink-0">
                        <CreditCard size={16} className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-800 truncate">{bill.cardName}</h3>
                    </div>
                    {bill.dueDate && (
                      <div className={`text-xs font-medium mt-1 ${
                        overdue ? 'text-red-600' : dueSoon ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {overdue ? `Overdue: ${formatDate(bill.dueDate)}` : dueSoon ? `Due: ${formatDate(bill.dueDate)}` : formatDate(bill.dueDate)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`text-lg font-bold ${
                      bill.isPaid ? 'text-emerald-600' : overdue ? 'text-red-600' : dueSoon ? 'text-amber-600' : 'text-slate-800'
                    }`}>
                      {bill.isPaid ? 'Settled' : formatCurrency(bill.currentAmount, currency)}
                    </div>
                    {!bill.isPaid && bill.currentAmount > 0 && (
                      <button onClick={() => handleSettle(bill.id)} className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-xl transition-colors flex-shrink-0">
                        <Check size={16} />
                      </button>
                    )}
                    <button onClick={() => navigate(`/bills/form?action=edit&id=${bill.id}`)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0">
                      <Edit size={16} className="text-slate-600" />
                    </button>
                    <button onClick={() => setShowDeleteConfirm(bill.id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {showDeleteConfirm === bill.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 mb-3">Delete "{bill.cardName}"?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
                      <button onClick={() => handleDelete(bill.id)} className="flex-1 btn-danger">Delete</button>
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

export default memo(CreditBillsList);
