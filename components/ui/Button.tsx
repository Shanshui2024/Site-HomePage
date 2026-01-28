import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
}

/**
 * Button component with support for different variants and sizes.
 * Ensures minimum touch target size of 44x44px for accessibility (Requirement 8.4).
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    // Base styles - ensures minimum 44x44px touch target
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    // Variant styles
    const variantStyles = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
      ghost: 'hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500',
    };
    
    // Size styles - all sizes meet minimum 44x44px requirement
    const sizeStyles = {
      sm: 'min-h-[44px] min-w-[44px] px-4 py-2 text-sm',
      md: 'min-h-[44px] min-w-[44px] px-6 py-3 text-base',
      lg: 'min-h-[48px] min-w-[48px] px-8 py-4 text-lg',
    };
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();
    
    return (
      <button
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
