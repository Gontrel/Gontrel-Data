import React from "react";

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-xl font-medium text-[#2E3032] leading-[100%]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full border border-[#D5D5D5] rounded-[20px] mt-[19px] px-[22px] py-[28px] placeholder-[#9DA1A5] placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
