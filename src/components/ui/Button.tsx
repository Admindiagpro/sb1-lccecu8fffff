import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-brand-primary text-brand-secondary hover:bg-brand-yellow-400 focus:ring-brand-yellow-300 font-semibold shadow-md hover:shadow-lg transition-all duration-200',
    secondary: 'bg-brand-secondary text-brand-primary hover:bg-brand-black-800 focus:ring-brand-black-500 font-semibold shadow-md hover:shadow-lg transition-all duration-200',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 font-semibold shadow-md hover:shadow-lg transition-all duration-200',
    warning: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400 font-semibold shadow-md hover:shadow-lg transition-all duration-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-brand-secondary hover:bg-brand-yellow-50 focus:ring-brand-yellow-300 font-medium'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};