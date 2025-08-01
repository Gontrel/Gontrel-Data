import {
  Play,
  Pause,
  Star,
  Clock,
} from "lucide-react";
import Icon from "../svgs/Icons";

interface VideoOverlayProps {
  isPaused: boolean;
  onTogglePlay: () => void;
  restaurantName: string;
  rating: number;
  tiktokUsername: string;
}

export const VideoOverlay = ({
  isPaused,
  onTogglePlay,
  restaurantName,
  rating,
  tiktokUsername,
}: VideoOverlayProps) => {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 to-transparent cursor-pointer rounded-[30px]"
      onClick={onTogglePlay}
    >
      <div />
      <section></section>

      <section>
        <div className="text-white flex flex-col justify-start w-[197px]  pl-[19px] ">
          <div className="flex items-center justify-between pt-4">
            <h2 className="text-[22px] font-figtree leading-[22px] font-bold">
              {restaurantName}
            </h2>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <span>{rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Icon name="tiktokIcon" />
              <span>{tiktokUsername}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {/* {isPaused && (
          <div className="bg-black bg-opacity-50 rounded-full p-4">
            <Play className="text-white w-12 h-12" fill="currentColor" />
          </div>
        )} */}
        </div>
        <div className="flex flex-row justify-around mb-[27px] mt-[20px] ml-4">
          <button className="flex items-center  text-white text-semibold bg-gradient-to-r from-[#B405FE] to-[#1D5FF5] text-[13px] leading-[22px] rounded-full py-[7px] px-[10px] ">
            <Icon name="carIcon" />
            <span className="pl-1">75 min</span>
          </button>
          <button className="flex items-center  text-white text-semibold bg-gradient-to-r from-[#B405FE] to-[#1D5FF5] text-[13px] leading-[22px] rounded-full py-[7px] px-[10px]">
            <Icon name="bookIcon" />
            <span className="pl-1">Menu</span>
          </button>
          <button className="flex items-center  text-white text-semibold bg-gradient-to-r from-[#B405FE] to-[#1D5FF5] text-[13px] leading-[22px] rounded-full py-[7px] px-[10px]">
            <Icon name="calendarIcon" />
            <span className="pl-1">Book</span>
          </button>
          <button className="flex items-center  text-white text-semibold bg-gradient-to-r from-[#B405FE] to-[#1D5FF5] text-[13px] leading-[22px] rounded-full py-[7px] px-[10px]">
            <Clock size={20} />
            <span className="pl-1">12:00pm - 2:00pm</span>
          </button>
        </div>
      </section>
    </div>
  );
};
