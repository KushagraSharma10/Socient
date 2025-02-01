import { memo } from 'react';

const ConfirmationModal = memo(({ 
  isOpen, 
  message, 
  confirmText, 
  cancelText, 
  onConfirm, 
  onCancel, 
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg max-w-md w-full mx-4">
        <p className="text-gray-800 dark:text-gray-200 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-700 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-50"
          >
            {cancelText || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : confirmText || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmationModal.displayName = 'ConfirmationModal';
export default ConfirmationModal;