import React from "react";

interface FormSelectOptionProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
}

const FormSelectOption: React.FC<FormSelectOptionProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
  placeholder,
}) => {
  return (
    <div className="w-full">
      <label className="block text-xl font-medium text-[#2E3032] leading-[100%] mb-[19px]">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          className={`w-full border rounded-[20px] px-[22px] py-4 placeholder-[#9DA1A5] 
            placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3] 
            bg-white appearance-none ${
              error ? "border-red-500" : "border-[#D5D5D5]"
            }`}
          value={value}
          onChange={onChange}
          style={{ backgroundColor: "#fff" }}
        >
          {/* Render a disabled placeholder option if provided */}
          {placeholder && (
            <option
              value=""
              disabled
              className="bg-white"
              style={{ backgroundColor: "#fff" }}
            >
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="capitalize bg-white"
              style={{ backgroundColor: "#fff" }}
            >
              {option?.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormSelectOption;
