import React from 'react';

export default function Button({ 
  children, 
  icon: Icon, 
  onClick, 
  className = '', 
  type = 'button',
  variant = 'primary'
}) {
  const baseStyles = "flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold shadow-sm transition-all active:scale-95";
  
  const variants = {
    primary: "bg-[#FF8303] hover:bg-[#e67400] text-white shadow-orange-500/20",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-gray-500/10",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
  };

  const combinedStyles = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={combinedStyles}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
}
