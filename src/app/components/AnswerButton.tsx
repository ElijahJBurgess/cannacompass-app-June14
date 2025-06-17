import { LucideIcon } from 'lucide-react';

interface AnswerButtonProps {
  label: string;
  Icon: LucideIcon;
  isSelected: boolean;
  onClick: () => void;
}

export const AnswerButton = ({
  label,
  Icon,
  isSelected,
  onClick,
}: AnswerButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-lg transition w-full text-left ${
      isSelected ? 'bg-green-700 text-white' : 'bg-green-50 hover:bg-green-100 text-gray-900'
    }`}
  >
    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-green-700'}`} />
    <span className="font-medium">{label}</span>
  </button>
); 