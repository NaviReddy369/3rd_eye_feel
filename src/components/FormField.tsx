import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  maxLength?: number;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  options = [],
  maxLength,
  rows = 4,
}) => {
  const inputClasses = `
    w-full px-4 py-3 rounded-lg bg-tech-gray border border-tech-border
    text-tech-text placeholder-tech-text-muted
    focus:bg-tech-gray-light focus:border-tech-cyan/50 focus:outline-none
    transition-all duration-300
    ${error ? 'border-red-500/60 focus:border-red-500' : ''}
  `;

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-tech-text">
        {label}
        {required && <span className="text-tech-cyan ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          rows={rows}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          <option value="" className="bg-tech-gray text-tech-text">
            {placeholder || 'Select an option'}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-tech-gray text-tech-text">
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type === 'number' ? 'number' : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      
      {error && (
        <p id={`${name}-error`} className="text-red-400 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
      
      {maxLength && type === 'textarea' && (
        <p className="text-tech-text-muted text-xs text-right">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
};

export default FormField;
