import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';

export default function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-[#222222]/80 flex items-center justify-center z-[9999] p-4" onClick={!isLoading ? onCancel : undefined}>
      <div 
        className="bg-white w-full max-w-[400px] rounded-[24px] p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-[#0B2149] mb-3">{title}</h2>
        <p className="text-gray-600 mb-8 text-sm">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#FF8303] hover:bg-[#e67600] transition-colors flex items-center justify-center disabled:bg-orange-400 min-w-[100px]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
