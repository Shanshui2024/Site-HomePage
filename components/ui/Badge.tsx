import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Badge component for displaying tags, labels, and tech stack items.
 * Used for blog post tags and technology stack display (Requirement 4.3).
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className = '', children, ...props }, ref) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-colors';
    
    // Variant styles with blue theme
    const variantStyles = {
      default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      success: 'bg-green-100 text-green-700 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      danger: 'bg-red-100 text-red-700 hover:bg-red-200',
    };
    
    // Size styles
    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();
    
    return (
      <span
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
