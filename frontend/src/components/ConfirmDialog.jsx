import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card max-w-sm text-center p-6">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-xs text-slate-600 mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={onCancel} className="btn-secondary text-xs">
            Cancel
          </button>
          <button onClick={onConfirm} className={isDanger ? "btn-danger text-xs" : "btn-primary text-xs"}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
