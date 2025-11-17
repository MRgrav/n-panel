'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
    width?: string;
  showCloseButton?: boolean;
}

const CustomModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,

  children,
  width,
  showCloseButton = true,
}) => {

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; 
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;


  return createPortal(
    <div className=" fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
      style={{ width: width || '500px' }}
        className={`relative } bg-white rounded-3xl shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {(showCloseButton) && (
            <div className="absolute top-0 right-0 p-4">
                {showCloseButton && (
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <X className="w-6 h-6" z-6/>
                    </button>
                )}
            </div>  
             
        )}
        
        <div className="p-4 max-h-[96vh] overflow-y-auto bg-[#F8F9FB] rounded-2xl">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CustomModal;