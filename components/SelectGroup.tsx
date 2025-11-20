import React from 'react';

interface Option {
  label: string;
  value: number | string;
}

interface SelectGroupProps {
  label: string;
  value: number | string;
  options: Option[];
  onChange: (val: any) => void;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="block w-full rounded-md border-0 bg-white py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};