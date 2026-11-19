import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Check } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';

export default function FinanceList() {
  const navigate = useNavigate();
  const entries = useFinanceStore((state) => state.entries);
  const deleteEntry = useFinanceStore((state) => state.deleteEntry);
  const togglePayment = useFinanceStore((state) => state.togglePayment);
  const isPaidThisMonth = useFinanceStore((state) => state.isPaidThisMonth);
  const getTotalAmount = useFinanceStore((state) => state.getTotalAmount);
  const getPaidAmount = useFinanceStore((state) => state.getPaidAmount);
  const getUnpaidAmount = useFinanceStore((state) => state.getUnpaidAmount);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useFinanceStore((state) => state.isHydrated);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Get current month key (e.g., "2024-01")
  const currentMonthKey = format(new Date(), 'yyyy-MM');
  const currentMonthDisplay = format(new Date(), 'MMMM yyyy');

  const totalAmount = getTotalAmount();
  const paidAmount = getPaidAmount(currentMonthKey);
  const unpaidAmount = getUnpaidAmount(currentMonthKey);

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setShowDeleteConfirm(null);
  };

  const handleTogglePayment = (id: string) => {
    togglePayment(id, currentMonthKey);
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
      {/* Header with Month */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Monthly Expenses
        </h1>
        <p className="text-sm text-gray-500">
          {currentMonthDisplay}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="text-xs text-blue-700 mb-1">Total</div>
          <div className="text-lg font-semibold text-blue-800">
            {formatCurrency(totalAmount, currency)}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <div className="text-xs text-green-700 mb-1">Paid</div>
          <div className="text-lg font-semibold text-green-800">
            {formatCurrency(paidAmount, currency)}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <div className="text-xs text-red-700 mb-1">Unpaid</div>
          <div className="text-lg font-semibold text-red-800">
            {formatCurrency(unpaidAmount, currency)}
          </div>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => navigate('/finance/form?action=add')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-4 transition-colors"
      >
        <Plus size={20} />
        Add Entry
      </button>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No entries yet</p>
          <p className="text-sm">Tap "Add Entry" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const isPaid = isPaidThisMonth(entry.id, currentMonthKey);
            
            return (
              <div
                key={entry.id}
                className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${
                  isPaid ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{entry.title}</h3>
                    <div className={`font-semibold ${
                      isPaid ? 'text-green-600' : 'text-gray-800'
                    }`}>
                      {formatCurrency(entry.amount, currency)}
                    </div>
                  </div>
                  
                  {/* Tick Mark */}
                  <button
                    onClick={() => handleTogglePayment(entry.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isPaid
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Check size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {isPaid ? 'Paid this month' : 'Unpaid'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/finance/form?action=edit&id=${entry.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(entry.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === entry.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">
                      Delete "{entry.title}"?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
