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
        return 'text-blue-500';
      case 'danger':
        return 'text-[#C50000]';
      default:
        return 'text-blue-500';
    }
  };

  const getActiveVariantStyles = (variant: ActionButton['variant']) => {
    switch (variant) {
      case 'success':
        return 'bg-[#009543] text-white';
      case 'primary':
        return 'bg-blue-500 text-white';
      case 'danger':
        return 'bg-[#C50000] text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className={`relative flex flex-row gap-2.5 ${className}`}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`flex items-center gap-2 font-medium border-[#F0EEEE] rounded-[10px] px-2 py-1.5 transition-colors w-full justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${action.active
              ? getActiveVariantStyles(action.variant)
              : `bg-[#F9F9F9] ${getVariantStyles(action.variant)}`
            }`}
        >
          {action.label && <span>{action.label}</span>}
          {action.icon && action.icon}
        </button>
      ))}
    </div>
  );
}