import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit, Check, ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';
import { useDebtStore } from '../../store/debtStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate, isOverdue, isDueSoon } from '../../utils/date';

export default function DebtContactDetail() {
  const navigate = useNavigate();
  const { contactId } = useParams<{ contactId: string }>();
  const debts = useDebtStore((state) => state.debts);
  const deleteDebt = useDebtStore((state) => state.deleteDebt);
  const markAsPaid = useDebtStore((state) => state.markAsPaid);
  const getContact = useContactStore((state) => state.getContact);
  const currency = useSettingsStore((state) => state.currency);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const contact = contactId ? getContact(contactId) : null;
  const contactDebts = debts.filter(debt => debt.personId === contactId && !debt.isPaid);

  // Ensure proper number addition
  const totalAmount = contactDebts.reduce((sum, debt) => sum + (Number(debt.amount) || 0), 0);

  const handleDelete = (id: string) => {
    deleteDebt(id);
    setShowDeleteConfirm(null);
  };

  const handleMarkPaid = (id: string) => {
    markAsPaid(id);
  };

  const handleAddDebt = () => {
    navigate(`/debt/form?action=add&personId=${contactId}`);
  };

  if (!contact) {
    return (
      <div className="p-4 text-center text-gray-600">
        Contact not found
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/debt')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          {contact.name}
        </h1>
      </div>

      {/* Total */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div className="text-sm text-blue-700 mb-1">Total Amount</div>
        <div className="text-2xl font-bold text-blue-800">
          {formatCurrency(totalAmount, currency)}
        </div>
        <div className="text-xs text-blue-600 mt-1">
          {contactDebts.length} debt{contactDebts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Add Debt Button */}
      <button
        onClick={handleAddDebt}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-4 transition-colors"
      >
        <Plus size={20} />
        Add Debt
      </button>

      {/* Debts List */}
      {contactDebts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No debts for this contact</p>
          <p className="text-sm">Tap "Add Debt" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contactDebts.map((debt) => {
            const overdue = debt.dueDate ? isOverdue(debt.dueDate) : false;
            const dueSoon = debt.dueDate ? isDueSoon(debt.dueDate) : false;

            return (
              <div
                key={debt.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {debt.type === 'owed-to-me' ? (
                        <ArrowDownLeft size={18} className="text-green-600" />
                      ) : (
                        <ArrowUpRight size={18} className="text-red-600" />
                      )}
                      <h3 className="font-medium text-gray-800">
                        {debt.type === 'owed-to-me' ? 'Owed to me' : 'Owed by me'}
                      </h3>
                    </div>
                    <div className={`font-semibold ${
                      debt.type === 'owed-to-me' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(debt.amount, currency)}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleMarkPaid(debt.id)}
                    className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                    title="Mark as paid"
                  >
                    <Check size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    {debt.dueDate && (
                      <span className={`text-xs ${
                        overdue
                          ? 'text-red-600 font-medium'
                          : dueSoon
                          ? 'text-yellow-600 font-medium'
                          : 'text-gray-500'
                      }`}>
                        {overdue
                          ? `Overdue: ${formatDate(debt.dueDate)}`
                          : dueSoon
                          ? `Due: ${formatDate(debt.dueDate)}`
                          : formatDate(debt.dueDate)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/debt/form?action=edit&id=${debt.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(debt.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {debt.note && (
                  <div className="text-sm text-gray-600 mt-2">
                    {debt.note}
                  </div>
                )}

                {/* Delete Confirmation */}
                {showDeleteConfirm === debt.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">
                      Delete this debt?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(debt.id)}
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
