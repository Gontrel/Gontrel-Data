'use client';

interface ActionButton {
  label?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant: 'success' | 'primary' | 'danger';
  disabled?: boolean;
  active?: boolean;
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
        return 'text-blue-500 disabled:text-[#B0D3FB]';
      case 'danger':
        return 'text-[#C50000]';
      default:
        return 'text-blue-500 disabled:text-[#B0D3FB]';
    }
  };

  const getActiveVariantStyles = (variant: ActionButton['variant']) => {
    switch (variant) {
      case 'success':
        return 'disabled:bg-[#E6F9E6] disabled:text-[#006B03] bg-[#009543]';
      case 'primary':
        return 'disabled:opacity-50 disabled:bg-blue-500 disabled bg-blue-500';
      case 'danger':
        return 'disabled:bg-[#FDE6E6] disabled:text-[#ED0000] bg-[#C50000]';
      default:
        return 'disabled:opacity-50 disabled:bg-blue-500 bg-blue-500';
    }
  };

  return (
    <div className={`relative flex flex-row gap-2.5 ${className}`}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`flex items-center gap-2 font-medium border-[#F0EEEE] rounded-[10px] px-2 py-1.5 transition-colors w-full justify-center cursor-pointer disabled:cursor-not-allowed ${action.active
            ? `text-white ${getActiveVariantStyles(action.variant)}`
              : `bg-[#F9F9F9] ${getVariantStyles(action.variant)}`
            }`}
        >
          {action.icon && action.icon}
          {action.label && <span>{action.label}</span>}
        </button>
      ))}
    </div>
  );
}