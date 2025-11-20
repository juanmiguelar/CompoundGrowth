import React from 'react';

interface InputGroupProps {
  label: string;
  value: number | string;
  onChange: (val: any) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  type?: 'number' | 'text';
  placeholder?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min = 0,
  type = "number",
  placeholder
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (type === 'number') {
       const num = parseFloat(rawValue);
       onChange(isNaN(num) ? 0 : num);
    } else {
       onChange(rawValue);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          min={type === 'number' ? min : undefined}
          step={type === 'number' ? step : undefined}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`block w-full rounded-md border-slate-300 bg-white py-2.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'}`}
        />
        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};