import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../utils/date';
import { sanitizeInput } from '../../utils/sanitize';

interface FormData {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note: string;
}

export default function FinanceForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addEntry = useFinanceStore((state) => state.addEntry);
  const updateEntry = useFinanceStore((state) => state.updateEntry);
  const getEntry = useFinanceStore((state) => state.getEntry);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useFinanceStore((state) => state.isHydrated);

  const action = searchParams.get('action') || 'add';
  const entryId = searchParams.get('id');
  const prefillType = searchParams.get('type') as 'income' | 'expense' | null;

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      amount: 0,
      type: prefillType || 'expense',
      category: '',
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      note: '',
    },
  });

  useEffect(() => {
    if (action === 'edit' && entryId && isHydrated) {
      setIsLoading(true);
      const entry = getEntry(entryId);
      if (entry) {
        setValue('title', entry.title);
        setValue('amount', entry.amount);
        setValue('type', entry.type);
        setValue('category', entry.category);
        setValue('date', formatDate(new Date(entry.date), 'yyyy-MM-dd'));
        setValue('note', entry.note || '');
      } else {
        navigate('/finance');
      }
      setIsLoading(false);
    }
  }, [action, entryId, isHydrated, getEntry, setValue, navigate]);

  useEffect(() => {
    if (prefillType) {
      setValue('type', prefillType);
    }
  }, [prefillType, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const sanitizedData = {
        title: sanitizeInput(data.title),
        amount: data.amount,
        type: data.type,
        category: sanitizeInput(data.category),
        date: new Date(data.date).toISOString(),
        note: data.note ? sanitizeInput(data.note) : undefined,
      };

      if (action === 'edit' && entryId) {
        updateEntry(entryId, sanitizedData);
      } else {
        addEntry(sanitizedData);
      }
      navigate('/finance');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
          onClick={() => navigate('/finance')}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">
          {action === 'add' ? 'Add Entry' : 'Edit Entry'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g., Grocery shopping"
            className="input-field"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Amount ({currency}) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="999999999"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
              max: { value: 999999999, message: 'Amount is too large' },
            })}
            placeholder="0.00"
            className="input-field"
            disabled={isSubmitting}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}
