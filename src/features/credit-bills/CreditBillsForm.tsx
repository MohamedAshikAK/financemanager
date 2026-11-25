import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useCreditBillStore } from '../../store/creditBillStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../utils/date';
import { sanitizeInput } from '../../utils/sanitize';
import { useToastStore } from '../../store/toastStore';

interface FormData {
  cardName: string;
  currentAmount: number;
  dueDate: string;
}

export default function CreditBillsForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addBill = useCreditBillStore((state) => state.addBill);
  const updateBill = useCreditBillStore((state) => state.updateBill);
  const getBill = useCreditBillStore((state) => state.getBill);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useCreditBillStore((state) => state.isHydrated);
  const { addToast } = useToastStore();

  const action = searchParams.get('action') || 'add';
  const billId = searchParams.get('id');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      cardName: '',
      currentAmount: 0,
      dueDate: formatDate(new Date(), 'yyyy-MM-dd'),
    },
  });

  // Load bill data when editing
  useEffect(() => {
    if (action === 'edit' && billId && isHydrated) {
      setIsLoading(true);
      const bill = getBill(billId);
      if (bill) {
        setValue('cardName', bill.cardName);
        setValue('currentAmount', bill.currentAmount);
        setValue('dueDate', formatDate(new Date(bill.dueDate), 'yyyy-MM-dd'));
      } else {
        navigate('/bills');
      }
      setIsLoading(false);
    }
  }, [action, billId, isHydrated, getBill, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const sanitizedData = {
        cardName: sanitizeInput(data.cardName),
        currentAmount: data.currentAmount,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      if (action === 'edit' && billId) {
        updateBill(billId, sanitizedData);
      } else {
        addBill({
          ...sanitizedData,
          isPaid: false,
        });
      }
      navigate('/bills');
    } catch (error) {
      console.error('Error saving bill:', error);
      addToast('error', 'Failed to save bill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-3 text-center text-slate-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate('/bills')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">
          {action === 'add' ? 'Add Bill' : 'Edit Bill'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Card Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Card Name *
          </label>
          <input
            type="text"
            {...register('cardName', { required: 'Card name is required' })}
            placeholder="e.g., HDFC Credit Card"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          {errors.cardName && (
            <p className="text-red-500 text-sm mt-1">{errors.cardName.message}</p>
          )}
        </div>

        {/* Current Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Current Bill Amount ({currency}) *
          </label>
          <input
            type="number"
            inputMode="numeric"
            step="0.01"
            {...register('currentAmount', {
              required: 'Amount is required',
              min: { value: 0, message: 'Amount cannot be negative' },
            })}
            placeholder="0.00"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          {errors.currentAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.currentAmount.message}</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Due Date *
          </label>
          <input
            type="date"
            inputMode="date"
            {...register('dueDate', { required: 'Due date is required' })}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Save size={18} />
          {isSubmitting ? 'Saving...' : 'Save Bill'}
        </button>
      </form>
    </div>
  );
}
