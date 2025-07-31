import React from "react";
import { LucideIcon } from "lucide-react";

interface TableHeaderProps {
  icon?: LucideIcon;
  title: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2">
    {Icon && <Icon className="w-4.5 h-4.5 text-[#8A8A8A]" />}
    <span className="font-semibold text-lg text-[#2E3032]">{title}</span>
  </div>
);
