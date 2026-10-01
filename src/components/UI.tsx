import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
  key?: string | number;
}

export function Card({ children, className = '', title, onClick }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`bg-panel/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl shadow-custom ${onClick ? 'cursor-pointer hover:bg-white/5' : ''} ${className}`}
    >
      {title && <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider opacity-80">{title}</h3>}
      {children}
    </motion.div>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const variants = {
    primary: 'gradient-accent text-white font-medium shadow-lg hover:brightness-110 active:scale-95',
    secondary: 'bg-white/10 hover:bg-white/20 text-white font-medium active:scale-95',
    outline: 'border border-white/20 hover:bg-white/5 text-white active:scale-95',
    danger: 'bg-red-500/80 hover:bg-red-500 text-white font-medium active:scale-95',
    ghost: 'hover:bg-white/5 text-white active:scale-95'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative card-blur max-w-lg w-full p-8 rounded-3xl shadow-2xl z-10"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
        <div className="mb-6 text-gray-300">
          {children}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </motion.div>
    </div>
  );
}
