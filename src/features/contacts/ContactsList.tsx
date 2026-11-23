import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, User, Phone, Mail } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';

export default function ContactsList() {
  const navigate = useNavigate();
  const contacts = useContactStore((state) => state.contacts);
  const deleteContact = useContactStore((state) => state.deleteContact);
  const isHydrated = useContactStore((state) => state.isHydrated);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteContact(id);
    setShowDeleteConfirm(null);
  };

  if (!isHydrated) {
    return <div className="p-4 text-center text-slate-600">Loading...</div>;
  }

  return (
    <div className="p-5 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Contacts</h1>

      <button onClick={() => navigate('/contacts/form?action=add')} className="w-full btn-primary flex items-center justify-center gap-2">
        <Plus size={20} />
        Add Contact
      </button>

      {contacts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500 mb-1">No contacts yet</p>
          <p className="text-sm text-slate-400">Tap "Add Contact" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="card hover:shadow-md transition-all duration-200 p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1">{contact.name}</h3>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={14} />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={14} />
                      <span>{contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => navigate(`/contacts/form?action=edit&id=${contact.id}`)} className="flex-1 btn-secondary flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Edit
                </button>
                <button onClick={() => setShowDeleteConfirm(contact.id)} className="flex-1 btn-danger flex items-center justify-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
              {showDeleteConfirm === contact.id && (
                <div className="mt-4 pt-4 border-t border-slate-100">
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
