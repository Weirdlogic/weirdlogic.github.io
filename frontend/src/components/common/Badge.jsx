// src/components/common/Badge.jsx
export const Badge = ({ children, variant }) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };
  
    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${variants[variant] || variants.default}`}>
        {children}
      </span>
    );
  };
  