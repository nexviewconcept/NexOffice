import React from 'react';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  return <button ref={ref} {...props} className={`bg-blue-500 text-white rounded px-4 py-2 ${props.className || ''}`} />;
});
Button.displayName = 'Button';
