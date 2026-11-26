import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useLoanStore } from '../../store/loansStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export default function LoanDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const getLoan = useLoanStore((state) => state.getLoan);
  const deleteLoan = useLoanStore((state) => state.deleteLoan);
  const deletePayment = useLoanStore((state) => state.deletePayment);
  const contacts = useContactStore((state) => state.contacts);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useLoanStore((state) => state.isHydrated);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPaymentDeleteConfirm, setShowPaymentDeleteConfirm] = useState<string | null>(null);

  const loan = id ? getLoan(id) : undefined;
  const contact = loan ? contacts.find((c) => c.id === loan.personId) : undefined;
  const totalPaid = loan ? loan.payments.reduce((sum, p) => sum + p.amount, 0) : 0;
  const remainingBalance = loan ? loan.initialAmount - totalPaid : 0;
  const progressPercent = loan ? (totalPaid / loan.initialAmount) * 100 : 0;

  const handleDelete = useCallback(() => {
    if (id) {
      deleteLoan(id);
      navigate('/loans');
    }
  }, [id, deleteLoan, navigate]);

  const handleDeletePayment = useCallback((paymentId: string) => {
    if (id) {
      deletePayment(id, paymentId);
      setShowPaymentDeleteConfirm(null);
    }
  }, [id, deletePayment]);

  useEffect(() => {
    if (!loan && isHydrated) {
      navigate('/loans');
    }
  }, [loan, isHydrated, navigate]);

  if (!loan) {
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
          onClick={() => navigate('/loans')}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 truncate">{loan.title}</h1>
      </div>

      <div className="card p-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-slate-500">Lender</p>
            <p className="font-semibold text-slate-800">{contact?.name || 'Unknown'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Type</p>
            <p className="font-semibold text-slate-800 capitalize">{loan.type}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-slate-50 rounded-xl p-2 text-center">
            <p className="text-xs text-slate-500">Initial</p>
            <p className="font-bold text-slate-800">{formatCurrency(loan.initialAmount, currency)}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-2 text-center">
            <p className="text-xs text-slate-500">Paid</p>
            <p className="font-bold text-emerald-600">{formatCurrency(totalPaid, currency)}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-2 text-center">
            <p className="text-xs text-slate-500">Remaining</p>
            <p className="font-bold text-blue-600">{formatCurrency(remainingBalance, currency)}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <div className="text-center text-sm text-slate-500 mt-1">
            {progressPercent.toFixed(1)}% paid
          </div>
        </div>
      </div>

      <button onClick={() => navigate(`/loans/${id}/payment`)} className="w-full btn-primary flex items-center justify-center gap-2">
        <Plus size={18} />
        Add Payment
      </button>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Payment History</h2>
        {loan.payments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No payments yet
          </div>
        ) : (
          <div className="space-y-2">
            {loan.payments.map((payment) => (
              <div key={payment.id} className="card p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{formatCurrency(payment.amount, currency)}</p>
                  <p className="text-xs text-slate-500">{formatDate(payment.date)}</p>
                  {payment.note && <p className="text-xs text-slate-400 mt-1">{payment.note}</p>}
                </div>
                <button onClick={() => setShowPaymentDeleteConfirm(payment.id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => navigate(`/loans/form?action=edit&id=${id}`)} className="flex-1 btn-secondary flex items-center justify-center gap-2">
          <Edit size={18} />
          Edit
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className="flex-1 btn-danger flex items-center justify-center gap-2">
          <Trash2 size={18} />
          Delete
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="card p-4">
          <p className="text-sm text-slate-600 mb-3">Delete "{loan.title}"? This will also delete all payment history.</p>
          <div className="flex gap-2">
            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 btn-secondary">Cancel</button>
            <button onClick={handleDelete} className="flex-1 btn-danger">Delete</button>
          </div>
        </div>
      )}

      {showPaymentDeleteConfirm && (
        <div className="card p-4">
          <p className="text-sm text-slate-600 mb-3">Delete this payment?</p>
          <div className="flex gap-2">
            <button onClick={() => setShowPaymentDeleteConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
            <button onClick={() => handleDeletePayment(showPaymentDeleteConfirm)} className="flex-1 btn-danger">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
