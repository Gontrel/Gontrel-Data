import { Clock } from "lucide-react";
import Icon from "../svgs/Icons";
import { TIconNames } from "../svgs/IconNames";

interface ButtonProps {
  icon: TIconNames | React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

interface CreateDefaultVideoButtonsProps {
  deliveryTime: string;
  openingHours: string;
  menuLink: string;
  bookLink: string;
  onDeliveryClick: () => void;
  onHoursClick: () => void;
}

interface CTAButtonsProps {
  buttons: ButtonProps[];
  className?: string;
}

export const CTAButtons = ({
  buttons,
  className = ""
}: CTAButtonsProps) => {
  return (
    <div className={`flex flex-row justify-start gap-2 m-4 ${className} w-full overflow-x-auto`}>
      {buttons.map((button, index) => (
        button.href ? (
        <a
          key={index}
          href={button.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`hover:cursor-pointer flex flex-row items-center text-white text-semibold bg-gradient-to-r from-[#B405FE] to-[#1D5FF5] text-sm leading-[22px] rounded-[20px] py-1.5 px-2 ${button.className || ""}`}
        >
          {typeof button.icon === "string" ? (
            <Icon name={button.icon as TIconNames} />
          ) : (
            button.icon
          )}
          <span className="pl-1">{button.label}</span>
          </a>
        ) : (
          <button
            key={index}
            onClick={button.onClick}
            className={`hover:cursor-pointer flex flex-row items-center text-white text-semibold bg-gradient-to-r from-[#B405FE] to-[#1D5FF5] text-sm leading-[22px] rounded-[20px] py-1.5 px-2 ${button.className || ""}`}
          >
            {typeof button.icon === "string" ? (
              <Icon name={button.icon as TIconNames} />
            ) : (
              button.icon
            )}
            <span className="pl-1">{button.label}</span>
          </button>
        )
      ))}
    </div>
  );
};

export const createDefaultVideoButtons = ({
  deliveryTime = "75 min",
  openingHours = "12:00pm - 2:00pm",
  menuLink = "",
  bookLink = "",
  onDeliveryClick = () => {},
  onHoursClick = () => {}
}: CreateDefaultVideoButtonsProps): ButtonProps[] => [
  {
    icon: "carIcon",
    label: deliveryTime,
    onClick: onDeliveryClick,
  },
  {
    icon: "bookIcon",
    label: "Menu",
    href: menuLink,
  },
  {
    icon: "bookCalendarIcon",
    label: "Book",
    href: bookLink,
  },
  {
    icon: <Clock size={20} />,
    label: openingHours,
    onClick: onHoursClick,
  },
];