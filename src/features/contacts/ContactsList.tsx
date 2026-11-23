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
    return (
      <div className="p-4 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Contacts
      </h1>

      {/* Add Button */}
      <button
        onClick={() => navigate('/contacts/form?action=add')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-4 transition-colors"
      >
        <Plus size={20} />
        Add Contact
      </button>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No contacts yet</p>
          <p className="text-sm">Tap "Add Contact" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{contact.name}</h3>
                  {contact.phone && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Phone size={14} />
                      {contact.phone}
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Mail size={14} />
                      {contact.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/contacts/form?action=edit&id=${contact.id}`)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(contact.id)}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm === contact.id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">
                    Delete "{contact.name}"?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
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
