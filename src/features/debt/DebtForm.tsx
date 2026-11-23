import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useDebtStore } from '../../store/debtStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../utils/date';

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

  const action = searchParams.get('action') || 'add';
  const debtId = searchParams.get('id');
  const prefillPersonId = searchParams.get('personId') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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
      if (action === 'edit' && debtId) {
        updateDebt(debtId, {
          amount: data.amount,
          type: data.type,
          personId: data.personId,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
          note: data.note || undefined,
        });
      } else {
        addDebt({
          amount: data.amount,
          type: data.type,
          personId: data.personId,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
          note: data.note || undefined,
          isPaid: false,
        });
      }
      navigate('/debt');
    } catch (error) {
      console.error('Error saving debt:', error);
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
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/debt')}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {action === 'add' ? 'Add Debt' : 'Edit Debt'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
          <select
            {...register('type', { required: 'Type is required' })}
            className="input-field"
            disabled={isSubmitting}
          >
            <option value="owed-to-me">Owed to Me</option>
            <option value="owed-by-me">Owed by Me</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Person *</label>
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
          {contacts.length === 0 && <p className="text-sm text-gray-500 mt-1">No contacts found. Add contacts first.</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Amount ({currency}) *</label>
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date (optional)</label>
          <input
            type="date"
            {...register('dueDate')}
            className="input-field"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Note (optional)</label>
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
          <Save size={20} />
          {isSubmitting ? 'Saving...' : 'Save Debt'}
        </button>
      </form>
    </div>
  );
}
