import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, CreditCard, AlertTriangle } from 'lucide-react';
import { useCreditBillStore } from '../../store/creditBillStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate, isOverdue, isDueSoon } from '../../utils/date';

export default function CreditBillsList() {
  const navigate = useNavigate();
  const bills = useCreditBillStore((state) => state.bills);
  const deleteBill = useCreditBillStore((state) => state.deleteBill);
  const settleBill = useCreditBillStore((state) => state.settleBill);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useCreditBillStore((state) => state.isHydrated);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteBill(id);
    setShowDeleteConfirm(null);
  };

  const handleSettle = (id: string) => {
    settleBill(id);
  };

  if (!isHydrated) {
    return <div className="p-4 text-center text-slate-600">Loading...</div>;
  }

  return (
    <div className="p-5 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Credit Bills</h1>

      <button onClick={() => navigate('/bills/form?action=add')} className="w-full btn-primary flex items-center justify-center gap-2">
        <Plus size={20} />
        Add Bill
      </button>

      {bills.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={32} className="text-slate-400" />
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
                className={`card hover:shadow-md transition-all duration-200 p-4 ${
                  overdue ? 'border-red-300' : dueSoon ? 'border-amber-300' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <CreditCard size={18} className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-800">{bill.cardName}</h3>
                    </div>
                    <div className={`text-2xl font-bold ${
                      bill.isPaid ? 'text-emerald-600' : overdue ? 'text-red-600' : dueSoon ? 'text-amber-600' : 'text-slate-800'
                    }`}>
                      {bill.isPaid ? 'Settled' : formatCurrency(bill.currentAmount, currency)}
                    </div>
                  </div>
                  {!bill.isPaid && bill.currentAmount > 0 && (
                    <button onClick={() => handleSettle(bill.id)} className="p-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-2xl transition-colors">
                      <Check size={22} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  {bill.dueDate && (
                    <span className={`text-sm font-medium ${overdue ? 'text-red-600' : dueSoon ? 'text-amber-600' : 'text-slate-500'}`}>
                      {overdue ? `Overdue: ${formatDate(bill.dueDate)}` : dueSoon ? `Due: ${formatDate(bill.dueDate)}` : formatDate(bill.dueDate)}
                    </span>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/bills/form?action=edit&id=${bill.id}`)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                      <Edit size={18} className="text-slate-600" />
                    </button>
                    <button onClick={() => setShowDeleteConfirm(bill.id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={18} className="text-red-500" />
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
