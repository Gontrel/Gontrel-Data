import { Play, Pause, Star, Clock, BookOpen, Calendar, Car } from 'lucide-react';

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
  tiktokUsername
}: VideoOverlayProps) => {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/60 to-transparent cursor-pointer"
      onClick={onTogglePlay}
    >
      <div />
      <div className="text-white">
        <h2 className="text-3xl font-bold">{restaurantName}</h2>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.012 2.002c-5.517 0-9.99 4.473-9.99 9.99 0 5.518 4.473 9.99 9.99 9.99s9.99-4.472 9.99-9.99c0-5.517-4.473-9.99-9.99-9.99zm0 18.002c-4.414 0-8.002-3.588-8.002-8.002s3.588-8.002 8.002-8.002 8.002 3.588 8.002 8.002-3.588 8.002-8.002 8.002zm1.74-11.053c.483-.223.81-.72 1.012-1.22.348-.853.33-1.932-.05-2.78-.48-1.062-1.59-1.78-2.73-1.78-.45 0-.88.13-1.27.37-.81.5-1.26 1.4-1.26 2.33 0 .18.02.35.05.52.12.7.48 1.32.96 1.76.48.44 1.1.7 1.75.7.18 0 .36-.03.53-.08zm-3.33 4.31c-.02 0-.04 0-.06-.02-.59-.18-1.03-.6-1.3-1.12-.39-.75-.3-1.68.22-2.32.4-.48.96-.79 1.57-.87.52-.07 1.04.07 1.5.42.46.34.79.83.92 1.38.15.65.02 1.33-.35 1.88-.41.6-1.04.98-1.74 1.03-.25.02-.5 0-.76-.02z"/>
            </svg>
            <span>{tiktokUsername}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {isPaused && (
          <div className="bg-black bg-opacity-50 rounded-full p-4">
            <Play className="text-white w-12 h-12" fill="currentColor" />
          </div>
        )}
      </div>
      <div className="flex justify-around">
        <button className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
          <Car size={20} />
          <span>75 min</span>
        </button>
        <button className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
          <BookOpen size={20} />
          <span>Menu</span>
        </button>
        <button className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
          <Calendar size={20} />
          <span>Book</span>
        </button>
        <button className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
          <Clock size={20} />
          <span>12:00pm - 2:00pm</span>
        </button>
      </div>
    </div>
  );
};
