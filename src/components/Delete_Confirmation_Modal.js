// src/components/DeleteConfirmationModal.jsx
import React, { useEffect, useRef } from "react";
import { FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, employeeName }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) onClose();
    };
    
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
   
      <div 
        ref={modalRef}
        className="bg-white bg-opacity-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 border border-white border-opacity-20 glassmorphism-effect"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 bg-opacity-20 rounded-full">
                <FiAlertTriangle className="text-2xl text-red-300" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Employee</h3>
            </div>         
          </div>

          <div className="my-6">
            <p className="text-white text-opacity-90 mb-2">
              {employeeName 
                ? `Are you sure you want to delete ${employeeName}?` 
                : "Are you sure you want to delete this employee?"
              }
            </p>
            <p className="text-sm text-white text-opacity-70">
              This action cannot be undone. All associated data will be permanently removed from the system.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3 mt-8">
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <FiTrash2 className="text-lg" />
              Delete Employee
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10 rounded-xl text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
        .glassmorphism-effect {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36);
        }
      `}</style>
    </div>
  );
};

export default DeleteConfirmationModal;