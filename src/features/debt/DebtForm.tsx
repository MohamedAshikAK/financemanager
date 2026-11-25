import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useDebtStore } from '../../store/debtStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../utils/date';
import { sanitizeInput } from '../../utils/sanitize';
import { useToastStore } from '../../store/toastStore';

interface FormData {
  amount: number;
  type: 'owed-to-me' | 'owed-by-me';
  personId: string;
  dueDate: string;
  note: string;
}

export default function DebtForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addDebt = useDebtStore((state) => state.addDebt);
  const updateDebt = useDebtStore((state) => state.updateDebt);
  const getDebt = useDebtStore((state) => state.getDebt);
  const contacts = useContactStore((state) => state.contacts);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useDebtStore((state) => state.isHydrated);
  const { addToast } = useToastStore();

  const action = searchParams.get('action') || 'add';
  const debtId = searchParams.get('id');
  const prefillPersonId = searchParams.get('personId') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      amount: 0,
      type: 'owed-to-me',
      personId: prefillPersonId,
      dueDate: formatDate(new Date(), 'yyyy-MM-dd'),
      note: '',
    },
  });

  useEffect(() => {
    if (action === 'edit' && debtId && isHydrated) {
      setIsLoading(true);
      const debt = getDebt(debtId);
      if (debt) {
        setValue('amount', debt.amount);
        setValue('type', debt.type);
        setValue('personId', debt.personId);
        setValue('dueDate', debt.dueDate ? formatDate(new Date(debt.dueDate), 'yyyy-MM-dd') : '');
        setValue('note', debt.note || '');
      } else {
        navigate('/debt');
      }
      setIsLoading(false);
    }
  }, [action, debtId, isHydrated, getDebt, setValue, navigate]);

  useEffect(() => {
    if (prefillPersonId) {
      setValue('personId', prefillPersonId);
    }
  }, [prefillPersonId, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const sanitizedData = {
        amount: data.amount,
        type: data.type,
        personId: data.personId,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        note: data.note ? sanitizeInput(data.note) : undefined,
      };

      if (action === 'edit' && debtId) {
        updateDebt(debtId, sanitizedData);
      } else {
        addDebt({
          ...sanitizedData,
          isPaid: false,
        });
      }
      navigate('/debt');
    } catch (error) {
      console.error('Error saving debt:', error);
      addToast('error', 'Failed to save debt. Please try again.');
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
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/debt')}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          {action === 'add' ? 'Add Debt' : 'Edit Debt'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Type *</label>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setValue('type', 'owed-to-me')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                watch('type') === 'owed-to-me'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Owed to Me
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'owed-by-me')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                watch('type') === 'owed-by-me'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Owed by Me
            </button>
          </div>
          <input type="hidden" {...register('type', { required: 'Type is required' })} />
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Person *</label>
          <select
            {...register('personId', { required: 'Person is required' })}
            className="input-field"
            disabled={isSubmitting}
          >
            <option value="">Select person</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>{contact.name}</option>
            ))}
          </select>
          {errors.personId && <p className="text-red-500 text-sm mt-1">{errors.personId.message}</p>}
          {contacts.length === 0 && <p className="text-sm text-slate-500 mt-1">No contacts found. Add contacts first.</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Amount ({currency}) *</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
            placeholder="0.00"
            className="input-field"
            disabled={isSubmitting}
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date (optional)</label>
          <input
            type="date"
            {...register('dueDate')}
            className="input-field"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Note (optional)</label>
          <textarea
            {...register('note')}
            placeholder="Add a note..."
            rows={3}
            className="input-field resize-none"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || contacts.length === 0}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {isSubmitting ? 'Saving...' : 'Save Debt'}
        </button>
      </form>
    </div>
  );
}
