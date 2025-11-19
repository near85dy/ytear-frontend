import type { ReactNode } from "react";
import ReactDOM from "react-dom";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({ children, isOpen, onClose }: BaseModalProps) => {  
  if(!isOpen) return null;
  
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm"
      onClick={() => {onClose()}}
    >
      <div
        className="bg-brand-dark rounded-lg shadow-lg p-4 max-w-lg w-full bg-gray-100"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};
