import { Copy } from "lucide-react";
import { useVideoStore } from "@/stores/videoStore";
import Image from "next/image";
import Icon from "../svgs/Icons";
import { VideoData } from "@/interfaces/restaurants";

interface VideoCardProps {
  video: VideoData;
  onEdit: (id: string) => void;
}

export const VideoCard = ({ video, onEdit }: VideoCardProps) => {
  const { removeVideo } = useVideoStore();

  const isApproved = video.status === "approved";
  const isPending = video.status === "pending";
  const isRejected = video.status === "rejected";

  return (
    <div
      className={`flex flex-row ${
        isRejected ? "bg-[#FDE6E6]" : "bg-[#F0F1F2]"
      } p-4 pe-11 rounded-lg gap-4 items-start`}
    >
      <Image
        src={video?.thumbUrl || "/placeholder-image.png"}
        alt="Video thumbnail"
        className="rounded-md object-cover"
        width={80}
        height={80}
      />
      <div className="flex flex-col gap-y-3 justify-between w-full">
        {/* Link + copy */}
        <div className="flex flex-row gap-2 text-blue-500">
          <Icon name="linkIcon" className="max-w-4 max-h-4" fill="#9DA1A5" />
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate hover:underline max-w-3xs"
          >
            {video.url}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(video.url)}
            className="text-gray-400 hover:text-gray-600"
            title="Copy link"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {video.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <hr className="border-gray-200" />

        {/* Buttons OR Status */}
        <div className="mt-4 flex gap-2 items-center">
          {isApproved || isPending ? (
            <span
              className={`px-3 py-1 rounded-md text-sm font-semibold ${
                isApproved
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isApproved ? "Approved" : "Pending"}
            </span>
          ) : (
            <>
              <button
                onClick={() => onEdit(video.id)}
                className="px-4 py-1.5 border border-blue-500 text-blue-500 rounded-md font-semibold hover:bg-blue-50"
                title="Edit video"
              >
                Edit
              </button>
              <button
                onClick={() => removeVideo(video.id)}
                className="px-4 py-1.5 border border-red-500 text-red-500 rounded-md font-semibold hover:bg-red-50"
                title="Remove video"
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
