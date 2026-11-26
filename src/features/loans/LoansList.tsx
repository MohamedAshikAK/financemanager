import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, CreditCard, Check } from 'lucide-react';
import { useLoanStore } from '../../store/loansStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export default function LoansList() {
  const navigate = useNavigate();
  const loans = useLoanStore((state) => state.loans);
  const contacts = useContactStore((state) => state.contacts);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useLoanStore((state) => state.isHydrated);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const getContact = (personId: string) => contacts.find((c) => c.id === personId);

  const handleDelete = useCallback((id: string) => {
    useLoanStore.getState().deleteLoan(id);
    setShowDeleteConfirm(null);
  }, []);

  if (!isHydrated) {
    return (
      <div className="p-3 text-center text-slate-600">
        Loading...
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
        <h1 className="text-xl font-bold text-slate-800">Loan & Chits</h1>
      </div>

      <button onClick={() => navigate('/loans/form?action=add')} className="w-full btn-primary flex items-center justify-center gap-2" aria-label="Add new loan">
        <Plus size={18} />
        Add Loan
      </button>

      {loans.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={18} className="text-slate-400" />
          </div>
          <p className="text-slate-500 mb-1">No loans yet</p>
          <p className="text-sm text-slate-400">Tap "Add Loan" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => {
            const contact = getContact(loan.personId);
            const totalPaid = loan.payments.reduce((sum, p) => sum + p.amount, 0);
            const remainingBalance = loan.initialAmount - totalPaid;
            const progressPercent = (totalPaid / loan.initialAmount) * 100;

            return (
              <div
                key={loan.id}
                className={`card hover:shadow-md transition-all duration-200 p-3 ${
                  loan.isPaid ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/loans/${loan.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {contact?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate">{loan.title}</h3>
                        <div className="text-xs text-slate-500 capitalize">{loan.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-xs text-slate-500">
                        {loan.payments.length} payment{loan.payments.length !== 1 ? 's' : ''}
                      </div>
                      <div className={`text-sm font-bold ${
                        loan.isPaid ? 'text-emerald-600' : 'text-slate-800'
                      }`}>
                        {formatCurrency(remainingBalance, currency)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDate(loan.startDate)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {progressPercent.toFixed(0)}% paid
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0 ml-3">
                    <button onClick={() => navigate(`/loans/${loan.id}`)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors flex-shrink-0">
                      <Check size={16} />
                    </button>
                    <button onClick={() => navigate(`/loans/form?action=edit&id=${loan.id}`)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0">
                      <Edit size={16} className="text-slate-600" />
                    </button>
                    <button onClick={() => setShowDeleteConfirm(loan.id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {showDeleteConfirm === loan.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 mb-3">Delete "{loan.title}"?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
                      <button onClick={() => handleDelete(loan.id)} className="flex-1 btn-danger">Delete</button>
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
