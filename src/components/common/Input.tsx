import React from 'react';

interface InputProps {
  label?: string;
  error?: string;
  className?: string;
  [key: string]: any;
}

const Input = ({ label, error, className = '', ...props }: InputProps) => (
  <label className="block text-sm">
    {label && <span className="mb-1 block font-medium text-slate-700">{label}</span>}
    <input
      {...props}
      className={`w-full rounded-md border px-3 py-2 text-sm ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </label>
);

export default Input;