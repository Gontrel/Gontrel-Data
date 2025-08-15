import React from "react";
import { LucideIcon } from "lucide-react";
import Icon from "@/components/svgs/Icons";
import { TIconNames } from "@/components/svgs/IconNames";

interface TableHeaderProps {
  icon?: LucideIcon;
  iconName?: TIconNames;
  title: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ icon: IconElement, iconName, title }) => (
  <div className="flex items-center gap-2.5">
    {IconElement && <IconElement className="w-4.5 h-4.5 text-[#9DA1A5]" />}
    {iconName && <Icon name={iconName} className="w-4.5 h-4.5 text-[#9DA1A5]" />}
    <span className="font-semibold text-lg text-[#2E3032]">{title}</span>
  </div>
);
