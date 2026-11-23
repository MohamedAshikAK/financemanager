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
      personId: '',
      dueDate: formatDate(new Date(), 'yyyy-MM-dd'),
      note: '',
    },
  });

  // Load debt data when editing
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

  // Pre-fill personId from URL params
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
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/debt')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          {action === 'add' ? 'Add Debt' : 'Edit Debt'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            {...register('type', { required: 'Type is required' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="owed-to-me">Owed to Me</option>
            <option value="owed-by-me">Owed by Me</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Person */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Person *
          </label>
          <select
            {...register('personId', { required: 'Person is required' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Select person</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
          {errors.personId && (
            <p className="text-red-500 text-sm mt-1">{errors.personId.message}</p>
          )}
          {contacts.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No contacts found. Add contacts first.
            </p>
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

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date (optional)
          </label>
          <input
            type="date"
            {...register('dueDate')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note (optional)
          </label>
          <textarea
            {...register('note')}
            placeholder="Add a note..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || contacts.length === 0}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Save size={20} />
          {isSubmitting ? 'Saving...' : 'Save Debt'}
        </button>
      </form>
    </div>
  );
}
