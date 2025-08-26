"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { mergeClasses } from "@/lib/utils";

/**
 * Option interface for dropdown items
 */
interface DropdownOption {
  value?: string | undefined;
  label: string;
}

/**
 * Props for DropdownFilter component
 */
interface DropdownFilterProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Dropdown filter component with customizable icon and styling
 */
export function DropdownFilter({
  options,
  value,
  onChange,
  placeholder,
  icon,
  className = "",
}: DropdownFilterProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query]);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleOptionClick = (optionValue: string | undefined) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={mergeClasses(
          "flex items-center justify-between w-full h-14 px-4 py-2",
          "bg-white border border-[#D9D9D9] rounded-lg",
          "text-left text-gray-600 font-medium",
          "hover:border-gray-400 focus:outline-none focus:border-blue-500",
          "transition-colors duration-200"
        )}
        aria-haspopup="listbox"
      >
        <div className="flex items-center justify-center gap-1">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {displayText}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-blue-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Filter options"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {filteredOptions?.length > 0 ? (
            filteredOptions?.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option?.value ?? undefined)}
                className={mergeClasses(
                  "w-full px-4 py-3 text-left hover:bg-gray-50",
                  "transition-colors duration-150",
                  option.value === value
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                )}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">No results</div>
          )}
        </div>
      )}
    </div>
  );
}
