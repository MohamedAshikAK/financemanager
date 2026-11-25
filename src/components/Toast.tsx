import { Toast } from '../types';

export function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-slide-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : toast.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-2 text-slate-400 hover:text-slate-600"
            aria-label="Close notification"
          >
            ×
          </button>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
