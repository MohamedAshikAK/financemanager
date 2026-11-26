import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useLoanStore } from '../../store/loansStore';
import { useToastStore } from '../../store/toastStore';

interface FormData {
  amount: string;
  date: string;
  note: string;
}

export default function PaymentForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const addPayment = useLoanStore((state) => state.addPayment);
  const getLoan = useLoanStore((state) => state.getLoan);
  const isHydrated = useLoanStore((state) => state.isHydrated);
  const { addToast } = useToastStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  useEffect(() => {
    if (id && isHydrated) {
      const loan = getLoan(id);
      if (!loan) {
        navigate('/loans');
      }
    }
  }, [id, isHydrated, getLoan, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      addPayment(id, {
        amount: Number(data.amount) || 0,
        date: new Date(data.date).toISOString(),
        note: data.note || undefined,
      });
      navigate(`/loans/${id}`);
    } catch (error) {
      console.error('Error adding payment:', error);
      addToast('error', 'Failed to add payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/loans/${id}`)}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Add Payment</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Amount must be greater than 0' } })}
            placeholder="0.00"
            className="input-field"
            disabled={isSubmitting}
            inputMode="numeric"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className="input-field"
            disabled={isSubmitting}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Note (Optional)</label>
          <input
            type="text"
            {...register('note')}
            placeholder="e.g., Monthly installment"
            className="input-field"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {isSubmitting ? 'Saving...' : 'Add Payment'}
        </button>
      </form>
    </div>
  );
}
