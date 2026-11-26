import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useLoanStore } from '../../store/loansStore';
import { useContactStore } from '../../store/contactStore';
import { useToastStore } from '../../store/toastStore';

interface FormData {
  title: string;
  initialAmount: string;
  type: 'loan' | 'chit' | 'other';
  personId: string;
  startDate: string;
  dueDate: string;
}

export default function LoanForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addLoan = useLoanStore((state) => state.addLoan);
  const updateLoan = useLoanStore((state) => state.updateLoan);
  const getLoan = useLoanStore((state) => state.getLoan);
  const contacts = useContactStore((state) => state.contacts);
  const isHydrated = useLoanStore((state) => state.isHydrated);
  const { addToast } = useToastStore();

  const action = searchParams.get('action') || 'add';
  const loanId = searchParams.get('id');

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
      title: '',
      initialAmount: '',
      type: 'loan',
      personId: '',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: '',
    },
  });

  useEffect(() => {
    if (action === 'edit' && loanId && isHydrated) {
      setIsLoading(true);
      const loan = getLoan(loanId);
      if (loan) {
        setValue('title', loan.title);
        setValue('initialAmount', String(loan.initialAmount));
        setValue('type', loan.type);
        setValue('personId', loan.personId);
        setValue('startDate', loan.startDate.split('T')[0]);
        setValue('dueDate', loan.dueDate ? loan.dueDate.split('T')[0] : '');
      } else {
        navigate('/loans');
      }
      setIsLoading(false);
    }
  }, [action, loanId, isHydrated, getLoan, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const sanitizedData = {
        title: data.title,
        initialAmount: Number(data.initialAmount) || 0,
        type: data.type,
        personId: data.personId,
        startDate: new Date(data.startDate).toISOString(),
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      };

      if (action === 'edit' && loanId) {
        updateLoan(loanId, sanitizedData);
      } else {
        addLoan({
          ...sanitizedData,
          isPaid: false,
        });
      }
      navigate('/loans');
    } catch (error) {
      console.error('Error saving loan:', error);
      addToast('error', 'Failed to save loan. Please try again.');
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
          onClick={() => navigate('/loans')}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          {action === 'add' ? 'Add Loan' : 'Edit Loan'}
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g., Gold Loan"
              className="input-field"
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('initialAmount', { required: 'Amount is required', min: { value: 0.01, message: 'Amount must be greater than 0' } })}
              placeholder="0.00"
              className="input-field"
              disabled={isSubmitting}
              inputMode="numeric"
            />
            {errors.initialAmount && <p className="text-red-500 text-sm mt-1">{errors.initialAmount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setValue('type', 'loan')}
                className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
                  watch('type') === 'loan'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                disabled={isSubmitting}
              >
                Loan
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'chit')}
                className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
                  watch('type') === 'chit'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                disabled={isSubmitting}
              >
                Chit
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'other')}
                className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
                  watch('type') === 'other'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                disabled={isSubmitting}
              >
                Other
              </button>
            </div>
            <input type="hidden" {...register('type', { required: 'Type is required' })} />
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
          </div>

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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
            <input
              type="date"
              {...register('startDate', { required: 'Start date is required' })}
              className="input-field"
              disabled={isSubmitting}
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date (Optional)</label>
            <input
              type="date"
              {...register('dueDate')}
              className="input-field"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || contacts.length === 0}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Loan'}
          </button>
        </form>
      )}
    </div>
  );
}
