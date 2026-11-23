import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useDebtStore } from '../../store/debtStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate, isOverdue, isDueSoon } from '../../utils/date';

export default function DebtList() {
  const navigate = useNavigate();
  const debts = useDebtStore((state) => state.debts);
  const deleteDebt = useDebtStore((state) => state.deleteDebt);
  const markAsPaid = useDebtStore((state) => state.markAsPaid);
  const getContact = useContactStore((state) => state.getContact);
  const currency = useSettingsStore((state) => state.currency);
  const isHydrated = useDebtStore((state) => state.isHydrated);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'owed-to-me' | 'owed-by-me'>('all');

  const filteredDebts = debts.filter(debt => {
    if (filter === 'all') return !debt.isPaid;
    return debt.type === filter && !debt.isPaid;
  });

  // Group debts by contact
  const groupedDebts = filteredDebts.reduce((acc, debt) => {
    const key = debt.personId;
    if (!acc[key]) {
      acc[key] = {
        personId: debt.personId,
        totalAmount: 0,
        debts: [],
        type: debt.type,
      };
    }
    // Ensure amount is a number before adding
    acc[key].totalAmount += Number(debt.amount) || 0;
    acc[key].debts.push(debt);
    return acc;
  }, {} as Record<string, { personId: string; totalAmount: number; debts: any[]; type: string }>);

  const handleDelete = (id: string) => {
    deleteDebt(id);
    setShowDeleteConfirm(null);
  };

  const handleMarkPaid = (id: string) => {
    markAsPaid(id);
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
        Debts
      </h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('owed-to-me')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            filter === 'owed-to-me'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Owed to Me
        </button>
        <button
          onClick={() => setFilter('owed-by-me')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            filter === 'owed-by-me'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Owed by Me
        </button>
      </div>

      {/* Add Button */}
      <button
        onClick={() => navigate('/debt/form?action=add')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-4 transition-colors"
      >
        <Plus size={20} />
        Add Debt
      </button>

      {/* Grouped Debts List */}
      {Object.keys(groupedDebts).length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No debts found</p>
          <p className="text-sm">Tap "Add Debt" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.values(groupedDebts).map((group) => {
            const contact = getContact(group.personId);
            const hasOverdue = group.debts.some(d => d.dueDate && isOverdue(d.dueDate));
            const hasDueSoon = group.debts.some(d => d.dueDate && isDueSoon(d.dueDate));

            return (
              <div
                key={group.personId}
                className={`bg-white rounded-xl p-4 shadow-sm border ${
                  hasOverdue
                    ? 'border-red-300'
                    : hasDueSoon
                    ? 'border-yellow-300'
                    : 'border-gray-100'
                }`}
              >
                <div
                  onClick={() => navigate(`/debt/contact/${group.personId}`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {group.type === 'owed-to-me' ? (
                          <ArrowDownLeft size={18} className="text-green-600" />
                        ) : (
                          <ArrowUpRight size={18} className="text-red-600" />
                        )}
                        <h3 className="font-medium text-gray-800">{contact?.name || 'Unknown'}</h3>
                      </div>
                      <div className={`font-semibold ${
                        group.type === 'owed-to-me' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {group.type === 'owed-to-me' ? '+' : '-'}
                        {formatCurrency(group.totalAmount, currency)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {group.debts.length} debt{group.debts.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
