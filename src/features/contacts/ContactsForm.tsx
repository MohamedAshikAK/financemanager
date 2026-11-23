import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { sanitizeInput, sanitizeEmail, sanitizePhone } from '../../utils/sanitize';

interface FormData {
  name: string;
  phone: string;
  email: string;
}

export default function ContactsForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addContact = useContactStore((state) => state.addContact);
  const updateContact = useContactStore((state) => state.updateContact);
  const getContact = useContactStore((state) => state.getContact);
  const isHydrated = useContactStore((state) => state.isHydrated);

  const action = searchParams.get('action') || 'add';
  const contactId = searchParams.get('id');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
    },
  });

  // Load contact data when editing
  useEffect(() => {
    if (action === 'edit' && contactId && isHydrated) {
      setIsLoading(true);
      const contact = getContact(contactId);
      if (contact) {
        setValue('name', contact.name);
        setValue('phone', contact.phone || '');
        setValue('email', contact.email || '');
      } else {
        navigate('/contacts');
      }
      setIsLoading(false);
    }
  }, [action, contactId, isHydrated, getContact, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const sanitizedData = {
        name: sanitizeInput(data.name),
        phone: data.phone ? sanitizePhone(data.phone) : undefined,
        email: data.email ? sanitizeEmail(data.email) : undefined,
      };

      if (action === 'edit' && contactId) {
        updateContact(contactId, sanitizedData);
      } else {
        addContact(sanitizedData);
      }
      navigate('/contacts');
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Failed to save contact. Please try again.');
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
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/contacts')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">
          {action === 'add' ? 'Add Contact' : 'Edit Contact'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            placeholder="e.g., John Doe"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone (optional)
          </label>
          <input
            type="tel"
            {...register('phone')}
            placeholder="e.g., +1 234 567 8900"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email (optional)
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="e.g., john@example.com"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Save size={20} />
          {isSubmitting ? 'Saving...' : 'Save Contact'}
        </button>
      </form>
    </div>
  );
}
