import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useMonthlyDebtStore } from '../../store/monthlyDebtStore';
import { useContactStore } from '../../store/contactStore';
import { useToastStore } from '../../store/toastStore';

interface FormData {
  amount: string;
  type: 'owed-to-me' | 'owed-by-me';
  personId: string;
}

export default function MonthlyDebtForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addMonthlyDebt = useMonthlyDebtStore((state) => state.addMonthlyDebt);
  const updateMonthlyDebt = useMonthlyDebtStore((state) => state.updateMonthlyDebt);
  const getMonthlyDebt = useMonthlyDebtStore((state) => state.getMonthlyDebt);
  const contacts = useContactStore((state) => state.contacts);
  const isHydrated = useMonthlyDebtStore((state) => state.isHydrated);
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
      amount: '',
      type: 'owed-by-me',
      personId: prefillPersonId,
    },
  });

  useEffect(() => {
    if (action === 'edit' && debtId && isHydrated) {
      setIsLoading(true);
      const debt = getMonthlyDebt(debtId);
      if (debt) {
        setValue('amount', String(debt.amount));
        setValue('type', debt.type);
        setValue('personId', debt.personId);
      } else {
        navigate('/monthly-debt');
      }
      setIsLoading(false);
    }
  }, [action, debtId, isHydrated, getMonthlyDebt, setValue, navigate]);

  useEffect(() => {
    if (prefillPersonId) {
      setValue('personId', prefillPersonId);
    }
  }, [prefillPersonId, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const sanitizedData = {
        amount: Number(data.amount) || 0,
        type: data.type,
        personId: data.personId,
      };

      if (action === 'edit' && debtId) {
        updateMonthlyDebt(debtId, sanitizedData);
      } else {
        addMonthlyDebt({
          ...sanitizedData,
          isPaid: false,
        });
      }
      navigate('/monthly-debt');
    } catch (error) {
      console.error('Error saving monthly debt:', error);
      addToast('error', 'Failed to save monthly debt. Please try again.');
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
          onClick={() => navigate('/monthly-debt')}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          aria-label="Go back to monthly debts"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          {action === 'add' ? 'Add Debt' : 'Edit Debt'}
        </h1>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 mb-2">No contacts found</p>
          <p className="text-sm text-slate-400 mb-4">Please add a contact first</p>
          <button
            onClick={() => navigate('/contacts')}
            className="btn-primary"
          >
            Go to Contacts
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Contact</label>
            <select
              {...register('personId', { required: 'Contact is required' })}
              className="input-field"
              disabled={isSubmitting}
            >
              <option value="">Select a contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
            {errors.personId && <p className="text-red-500 text-sm mt-1">{errors.personId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setValue('type', 'owed-by-me')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  watch('type') === 'owed-by-me'
                    ? 'bg-white text-red-600 shadow-md'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                Owed by Me
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'owed-to-me')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  watch('type') === 'owed-to-me'
                    ? 'bg-white text-emerald-600 shadow-md'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                Owed to Me
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount</label>
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
              inputMode="numeric"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || contacts.length === 0}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Monthly Debt'}
          </button>
        </form>
      )}
    </div>
  );
}
