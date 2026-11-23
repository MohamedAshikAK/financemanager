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
    return (
      <div className="p-4 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Credit Bills
      </h1>

      {/* Add Button */}
      <button
        onClick={() => navigate('/bills/form?action=add')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-4 transition-colors"
      >
        <Plus size={20} />
        Add Bill
      </button>

      {/* Bills List */}
      {bills.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No credit bills yet</p>
          <p className="text-sm">Tap "Add Bill" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bills.map((bill) => {
            const overdue = !bill.isPaid && isOverdue(bill.dueDate);
            const dueSoon = !bill.isPaid && isDueSoon(bill.dueDate);

            return (
              <div
                key={bill.id}
                className={`bg-white rounded-xl p-4 shadow-sm border ${
                  overdue
                    ? 'border-red-300'
                    : dueSoon
                    ? 'border-yellow-300'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard size={18} className="text-blue-600" />
                      <h3 className="font-medium text-gray-800">{bill.cardName}</h3>
                    </div>
                    <div className={`font-semibold ${
                      bill.isPaid
                        ? 'text-green-600'
                        : overdue
                        ? 'text-red-600'
                        : 'text-gray-800'
                    }`}>
                      {bill.isPaid
                        ? 'Settled'
                        : formatCurrency(bill.currentAmount, currency)}
                    </div>
                  </div>
                  
                  {/* Settle Button (only if not paid) */}
                  {!bill.isPaid && bill.currentAmount > 0 && (
                    <button
                      onClick={() => handleSettle(bill.id)}
                      className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                      title="Mark as settled"
                    >
                      <Check size={18} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    {bill.dueDate && (
                      <span className={`text-xs flex items-center gap-1 ${
                        overdue
                          ? 'text-red-600 font-medium'
                          : dueSoon
                          ? 'text-yellow-600 font-medium'
                          : 'text-gray-500'
                      }`}>
                        {overdue && <AlertTriangle size={14} />}
                        {bill.isPaid
                          ? 'Settled'
                          : overdue
                          ? `Overdue: ${formatDate(bill.dueDate)}`
                          : dueSoon
                          ? `Due: ${formatDate(bill.dueDate)}`
                          : formatDate(bill.dueDate)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/bills/form?action=edit&id=${bill.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(bill.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === bill.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">
                      Delete "{bill.cardName}"?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
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
