import {
  Play,
  Star,
} from "lucide-react";
import Icon from "../svgs/Icons";
import { CTAButtons, createDefaultVideoButtons } from "./CTAButtons";

interface VideoOverlayProps {
  onTogglePlay: () => void;
  restaurantName: string;
  rating: number;
  tiktokUsername: string;
  deliveryTime?: string;
  openingHours?: string;
  menuLink?: string;
  bookLink?: string;
  onDeliveryClick?: () => void;
  onHoursClick?: () => void;
}

export const VideoOverlay = ({
  onTogglePlay,
  restaurantName,
  rating,
  tiktokUsername,
  deliveryTime = "75 min",
  openingHours = "12:00pm - 2:00pm",
  menuLink = "",
  bookLink = "",
  onDeliveryClick = () => { },
  onHoursClick = () => { },
}: VideoOverlayProps) => {


  return (
    <div
      className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/30 to-transparent rounded-[15px]"

    >
      <div />
      <section  className="flex flex-col items-start justify-start w-full h-full">
        <div className="flex h-full w-full cursor-pointer" onClick={onTogglePlay}></div>
        <div className="flex flex-col justify-end">
          <div className="text-white flex flex-col justify-start gap-y-3 min-w-[197px] pl-[19px] ">
            <div className="flex items-center justify-start gap-x-2 pt-4">
              <h2 className="text-[22px] font-bold break-words max-w-2xs">
                {restaurantName}
              </h2>
              <div className="flex items-center gap-1 rounded-4xl py-0.5 px-2 bg-black/30 border border-[#635F4E] backdrop-blur-lg">
                <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                <span className="text-sm">{rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="tiktokIcon" width={30} height={30} />
              <span className="text-sm">{tiktokUsername}</span>
            </div>
          </div>
          <CTAButtons
            buttons={createDefaultVideoButtons({
              deliveryTime,
              openingHours,
              menuLink,
              bookLink,
              onDeliveryClick,
              onHoursClick,
            })}
          />
        </div>
      </section>
    </div>
  );
};
