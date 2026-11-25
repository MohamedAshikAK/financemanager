import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, User, ArrowLeft } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { ListSkeleton } from '../../components/LoadingSkeleton';

function ContactsList() {
  const navigate = useNavigate();
  const contacts = useContactStore((state) => state.contacts);
  const deleteContact = useContactStore((state) => state.deleteContact);
  const isHydrated = useContactStore((state) => state.isHydrated);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    deleteContact(id);
    setShowDeleteConfirm(null);
  }, [deleteContact]);

  if (!isHydrated) {
    return (
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-12 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-6 bg-slate-200 rounded animate-pulse flex-1" />
        </div>
        <ListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          aria-label="Go back to home"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Contacts</h1>
      </div>

      <button onClick={() => navigate('/contacts/form?action=add')} className="w-full btn-primary flex items-center justify-center gap-2" aria-label="Add new contact">
        <Plus size={18} aria-hidden="true" />
        Add Contact
      </button>

      {contacts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={18} className="text-slate-400" />
          </div>
          <p className="text-slate-500 mb-1">No contacts yet</p>
          <p className="text-sm text-slate-400">Tap "Add Contact" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="card hover:shadow-md transition-all duration-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{contact.name}</h3>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => navigate(`/contacts/form?action=edit&id=${contact.id}`)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <Edit size={16} className="text-slate-600" />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(contact.id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
              {showDeleteConfirm === contact.id && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-sm text-slate-600 mb-3">Delete "{contact.name}"?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
                    <button onClick={() => handleDelete(contact.id)} className="flex-1 btn-danger">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(ContactsList);
