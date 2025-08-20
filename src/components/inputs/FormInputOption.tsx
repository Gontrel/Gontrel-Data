import React from "react";

interface FormSelectOptionProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

const FormSelectOption: React.FC<FormSelectOptionProps> = ({
  label,
  name,
  value,
  options,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-xl font-medium text-[#2E3032] leading-[100%]">
        {label}
      </label>
      <select
        name={name}
        className="w-full border border-[#D5D5D5] rounded-[20px] mt-[19px] px-[22px] py-[28px] placeholder-[#9DA1A5] placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelectOption;
