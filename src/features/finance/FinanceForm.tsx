import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../utils/date';

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

  // Load entry data when editing
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

  // Pre-fill type from URL params
  useEffect(() => {
    if (prefillType) {
      setValue('type', prefillType);
    }
  }, [prefillType, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      if (action === 'edit' && entryId) {
        updateEntry(entryId, {
          title: data.title,
          amount: data.amount,
          type: data.type,
          category: data.category,
          date: new Date(data.date).toISOString(),
          note: data.note || undefined,
        });
      } else {
        addEntry({
          title: data.title,
          amount: data.amount,
          type: data.type,
          category: data.category,
          date: new Date(data.date).toISOString(),
          note: data.note || undefined,
        });
      }
      navigate('/finance');
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/finance')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          {action === 'add' ? 'Add Entry' : 'Edit Entry'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g., Grocery shopping"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ({currency}) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Save size={20} />
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}
