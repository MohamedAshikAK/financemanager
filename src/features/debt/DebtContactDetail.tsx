import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit, ArrowDownLeft, ArrowUpRight, Plus, CheckCircle } from 'lucide-react';
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
  const settleDebt = useDebtStore((state) => state.settleDebt);
  const getContact = useContactStore((state) => state.getContact);
  const currency = useSettingsStore((state) => state.currency);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSettleConfirm, setShowSettleConfirm] = useState<string | null>(null);

  const contact = contactId ? getContact(contactId) : null;
  const contactDebts = debts.filter(debt => debt.personId === contactId && !debt.isPaid);
  const totalAmount = contactDebts.reduce((sum, debt) => sum + (Number(debt.amount) || 0), 0);

  const handleDelete = (id: string) => {
    deleteDebt(id);
    setShowDeleteConfirm(null);
  };

  const handleSettle = (id: string) => {
    settleDebt(id);
    setShowSettleConfirm(null);
  };

  const handleAddDebt = () => {
    navigate(`/debt/form?action=add&personId=${contactId}`);
  };

  if (!contact) {
    return <div className="p-3 text-center text-slate-600">Contact not found</div>;
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/debt')} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">{contact.name}</h1>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white shadow-lg shadow-blue-500/30">
        <div className="text-sm text-blue-100 mb-1">Total Amount</div>
        <div className="text-3xl font-bold">{formatCurrency(totalAmount, currency)}</div>
        <div className="text-xs text-blue-200 mt-1">{contactDebts.length} debt{contactDebts.length !== 1 ? 's' : ''}</div>
      </div>

      <button onClick={handleAddDebt} className="w-full btn-primary flex items-center justify-center gap-2">
        <Plus size={18} />
        Add Debt
      </button>

      {contactDebts.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="mb-1">No debts for this contact</p>
          <p className="text-sm">Tap "Add Debt" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contactDebts.map((debt) => {
            const overdue = debt.dueDate ? isOverdue(debt.dueDate) : false;
            const dueSoon = debt.dueDate ? isDueSoon(debt.dueDate) : false;

            return (
              <div key={debt.id} className="card hover:shadow-md transition-all duration-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-xl flex-shrink-0 ${debt.type === 'owed-to-me' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {debt.type === 'owed-to-me' ? <ArrowDownLeft size={16} className="text-emerald-600" /> : <ArrowUpRight size={16} className="text-red-600" />}
                      </div>
                      <h3 className="font-semibold text-slate-800 truncate">{debt.type === 'owed-to-me' ? 'Owed to me' : 'Owed by me'}</h3>
                    </div>
                    <div className={`text-lg font-bold ${debt.type === 'owed-to-me' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(debt.amount, currency)}
                    </div>
                    <div className="text-xs font-medium mt-1 text-slate-500">
                      Added: {formatDate(debt.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setShowSettleConfirm(debt.id)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors flex-shrink-0" title="Settle debt">
                      <CheckCircle size={16} />
                    </button>
                    <button onClick={() => navigate(`/debt/form?action=edit&id=${debt.id}`)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0">
                      <Edit size={16} className="text-slate-600" />
                    </button>
                    <button onClick={() => setShowDeleteConfirm(debt.id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {debt.note && <div className="text-sm text-slate-600 mt-2">{debt.note}</div>}

                {showSettleConfirm === debt.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 mb-3">Settle this debt? It will be moved to history.</p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowSettleConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
                      <button onClick={() => handleSettle(debt.id)} className="flex-1 btn-primary">Settle</button>
                    </div>
                  </div>
                )}

                {showDeleteConfirm === debt.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 mb-3">Delete this debt?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
                      <button onClick={() => handleDelete(debt.id)} className="flex-1 btn-danger">Delete</button>
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
