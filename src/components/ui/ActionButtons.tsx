'use client';

interface ActionButton {
  label: string;
  onClick: () => void;
  variant: 'success' | 'primary' | 'danger';
  disabled?: boolean;
}

interface ActionButtonsProps {
  actions: ActionButton[];
  className?: string;
}

/**
 * Reusable action buttons component
 */
export function ActionButtons({ actions, className = '' }: ActionButtonsProps) {
  const getVariantStyles = (variant: ActionButton['variant']) => {
    switch (variant) {
      case 'success':
        return 'text-[#009543]';
      case 'primary':
        return 'text-[#0070F3]';
      case 'danger':
        return 'text-[#C50000]';
      default:
        return 'text-[#0070F3]';
    }
  };

  return (
    <div className={`relative flex flex-row gap-2.5 ${className}`}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`flex items-center gap-2 font-medium bg-[#F9F9F9] border-[#F0EEEE] rounded-[10px] px-2 py-1.5 transition-colors w-full justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles(action.variant)}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}