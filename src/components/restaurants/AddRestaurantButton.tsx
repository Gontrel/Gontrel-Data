import { Plus } from 'lucide-react';

/**
 * Props for AddRestaurantButton component
 */
interface AddRestaurantButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Add Restaurant Button Component
 * A reusable button component for adding new restaurants
 */
export const AddRestaurantButton: React.FC<AddRestaurantButtonProps> = ({
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      className={`bg-blue-500 text-white px-3 py-4 rounded-[10px] hover:bg-blue-600 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Add new restaurant"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center gap-2 justify-center">
        <Plus className="w-6 h-6" />
        Add Restaurant
      </span>
    </button>
  );
};