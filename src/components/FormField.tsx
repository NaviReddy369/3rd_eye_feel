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
    w-full px-4 py-3 sm:px-4 sm:py-3 md:px-5 md:py-3.5 rounded-lg 
    bg-tech-gray border border-tech-border
    text-tech-text text-base sm:text-base placeholder-tech-text-muted
    focus:bg-tech-gray-light focus:border-tech-cyan/50 focus:outline-none
    focus:ring-2 focus:ring-tech-cyan/20 focus:ring-offset-0
    transition-all duration-300
    min-h-[44px] sm:min-h-[48px]
    touch-manipulation
    ${error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20' : ''}
  `;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={name} 
        className="block text-sm sm:text-base font-semibold text-tech-text mb-1.5"
      >
        {label}
        {required && <span className="text-tech-cyan ml-1" aria-label="required">*</span>}
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
        <div className="relative">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            className={`
              ${inputClasses}
              appearance-none
              pr-10
              cursor-pointer
              bg-tech-gray bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300d9ff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat
              hover:bg-tech-gray-light
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <option value="" className="bg-tech-gray text-tech-text" disabled>
              {placeholder || 'Select an option'}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-tech-gray text-tech-text">
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
        <div className="flex items-start gap-2 mt-2" role="alert">
          <svg 
            className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p id={`${name}-error`} className="text-red-400 text-sm sm:text-base leading-relaxed">
            {error}
          </p>
        </div>
      )}
      
      {maxLength && type === 'textarea' && (
        <p className="text-tech-text-muted text-xs sm:text-sm text-right mt-1">
          <span className={value.length > maxLength * 0.9 ? 'text-yellow-400' : ''}>
            {value.length}
          </span>
          /{maxLength} characters
        </p>
      )}
    </div>
  );
};

export default FormField;
