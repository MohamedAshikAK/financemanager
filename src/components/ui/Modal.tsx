import { memo, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:bg-[#1c1c1e] dark:border-[#38383a] w-full max-w-md animate-scale-in">
        {title && (
          <div className="p-4 border-b border-slate-200/50 dark:border-[#38383a]">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h2>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default memo(Modal);
