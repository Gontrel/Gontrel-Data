import { ColumnDef } from "@tanstack/react-table";
import { TableHeader } from "@/components/restaurants/columns/utils";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { ReportedVideoTypes } from "@/types";
import { formatDate } from "@/lib/utils";
import Image from "next/image";



/**
 * Creates column definitions for pending user videos table
 */
export const createReportedVideosColumns = (
  handleOpenVideoPreview: (data: ReportedVideoTypes) => void
): ColumnDef<ReportedVideoTypes>[] => [

  {
    accessorKey: "reporter",
    header: () => <TableHeader  iconName="personIcon"  title="Reporter" />,
    cell: ({ row }) => {
        const reportedBy = row.original?.user?.displayName
        const reporterProfile = row.original?.user?.profileImage
          return (
        <div className="flex items-center w-full gap-2 px-2 py-1 text-left">
          <Image
            src={reporterProfile ?? "/images/user.png"}
            alt={reportedBy ?? "Gontrel"}
            width={40}
            height={40}
            className="object-cover rounded-full"
          />
          <span className="font-medium text-black">{reportedBy ?? ""}</span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.NAME,
    meta: { sticky: true },
  },
{
  accessorKey: "video",
  header: () => <TableHeader iconName="videoIcon" title="Video" />,
  cell: ({ row }) => {
    const postThumbUrl = row.original?.post?.thumbUrl;

    return (
      <div className="flex justify-center">
        <Image
          src={postThumbUrl ?? "/images/location.png"}
          alt="video thumbnail"
          width={60}
          height={60}
          className="object-cover rounded-full cursor-pointer"
          onClick={() => handleOpenVideoPreview(row.original)}
        />
      </div>
    );
  },
  minSize: TABLE_COLUMN_SIZES.NAME,
},
  
  {
    accessorKey: "uploader",
    header: () => <TableHeader iconName="personIcon" title="Uploader" />,
    cell: ({ row }) => {
      const uploadedBy =  row.original.post.user?.displayName ?? row.original?.post?.adminPost?.admin?.name
      const uploadedByProfile = row.original.post.user?.profileImage ??  row.original?.post?.adminPost?.admin?.profileImage
     
      return (
        <div className="flex items-center w-full gap-2 px-2 py-1 text-left">
          <Image
            src={uploadedByProfile ?? "/images/user.png"}
            alt={uploadedBy ?? "Gontrel"}
            width={40}
            height={40}
            className="object-cover rounded-full"
          />
          <span className="font-medium text-black">{uploadedBy ?? ""}</span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "comment",
    header: () => <TableHeader iconName="calendarIcon" title="Comment" />,
    cell: ({ row }) => {
      const comment = row.original?.reason
      return (
        <div className="relative">
          <div className="flex justify-center items-center w-full gap-2 px-2 py-1">
            <span className="text-[#181D1F] font-medium">
              {comment}
            </span>
          </div>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.STATUS,
  },
    {
    accessorKey: "status",
    header: () => <TableHeader iconName="statusIcon" title="status" />,
    cell: ({ row }) => {
      const status = row.original?.status;
      return (
        <div className="relative">
          <div className="flex justify-center items-center w-full gap-2 px-2 py-1 text-center">
            <span className="text-[#181D1F] font-medium">
              {status}
            </span>
          </div>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.STATUS,
  },

  {
    accessorKey: "dateAdded",
    header: () => <TableHeader iconName="calendarIcon" title="Date added" />,
    cell: ({ row }) => {
      const dateAdded = new Date(row.original?.createdAt);

      return (
        <div className="relative">
          <div className="flex items-center w-full gap-2 px-2 py-1 text-left">
            <span className="text-[#181D1F] font-medium">
              {formatDate(dateAdded)}
            </span>
          </div>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
  },
];

