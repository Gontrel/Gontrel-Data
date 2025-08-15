'use client';

import { useState, useEffect } from 'react';
import { Input } from '../ui/Input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * Search bar component with debounced input
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...', 
  debounceMs = 300
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, onChange, debounceMs]);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg pl-10 bg-white border border-[#D9D9D9] h-14 w-92 text-lg font-medium"
      />
    </div>
  );
}