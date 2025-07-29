import { Link, Copy } from 'lucide-react';
import { VideoData, useVideoStore } from '@/stores/videoStore';

interface VideoCardProps {
  video: VideoData;
  onEdit: (id: string) => void;
}

export const VideoCard = ({ video, onEdit }: VideoCardProps) => {
  const { removeVideo } = useVideoStore();

  return (
    <div className="bg-gray-100 p-4 rounded-lg flex gap-4 items-start">
      <img 
        src="/placeholder-image.png" // Replace with actual thumbnail if available
        alt="Video thumbnail" 
        className="w-20 h-20 rounded-md object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-blue-500 font-semibold">
          <Link size={16} />
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
            {video.url}
          </a>
          <button onClick={() => navigator.clipboard.writeText(video.url)} className="text-gray-400 hover:text-gray-600">
            <Copy size={16} />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {video.tags.map(tag => (
            <span key={tag} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => onEdit(video.id)}
            className="px-4 py-1.5 border border-blue-500 text-blue-500 rounded-md font-semibold hover:bg-blue-50"
          >
            Edit
          </button>
          <button 
            onClick={() => removeVideo(video.id)}
            className="px-4 py-1.5 border border-red-500 text-red-500 rounded-md font-semibold hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
