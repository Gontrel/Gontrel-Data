'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableContentProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  className?: string;
}

/**
 * Reusable expandable content component
 */
export function ExpandableContent({
  trigger,
  children,
  expanded: controlledExpanded,
  onToggle,
  className = ''
}: ExpandableContentProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    if (onToggle) {
      onToggle(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded transition-colors w-full text-left"
      >
        {trigger}
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-80">
          {children}
        </div>
      )}
    </div>
  );
}