import { ColumnDef } from '@tanstack/react-table';
import { PendingVideoType } from '@/types/restaurant';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { TABLE_COLUMN_SIZES } from "@/constants";
import { getBgColor, getTextColor } from '@/lib/tableUtils';
import { PillButton } from '@/components/ui/PillButton';
import { TableHeader } from './utils';

/**
 * Creates column definitions for pending videos table
 */
export const createPendingVideosColumns = (): ColumnDef<PendingVideoType>[] => [
    {
      accessorKey: 'id',
      header: () => (
        <TableHeader title="#" />
      ),
      cell: ({ row, table }) => {
        const { pageSize, pageIndex } = table.getState().pagination;
        const rowIndex = row.index + 1;
        const calculatedId = (pageIndex * pageSize) + rowIndex;

        return (
          <div className="font-medium text-[#181D1F] w-fit truncate">
            {calculatedId}
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.ID,
      meta: { sticky: true }
    },
    {
      accessorKey: 'name',
      header: () => (
        <TableHeader title="Restaurant name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-[#181D1F] max-w-60 truncate">
          {row.getValue('name')}
        </div>
      ),
      minSize: TABLE_COLUMN_SIZES.NAME,
      meta: { sticky: true }
    },
    {
      accessorKey: 'video',
      header: () => (
        <TableHeader iconName="videoIcon" title="Video" />
      ),
      cell: ({ row }) => {
        const videos = row.original.videos;
        return (
          <div className="flex flex-col gap-y-2 w-fit">
            <PillButton text={`${videos.length} video${videos.length > 1 ? 's' : ''}`} textColor={getTextColor(videos)} bgColor={getBgColor(videos)} />
            <button onClick={() => {
              // TODO: Open video modal
            }} className="text-left text-blue-500">
              View
            </button>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.VIDEO,
    },
    {
      accessorKey: 'addedBy',
      header: () => (
        <TableHeader iconName="calendarIcon" title="Added by" />
      ),
      cell: ({ row }) => {
        const addedBy = row.getValue('addedBy') as { name: string; profileImage: string };

        return (
          <div className="flex items-center w-full gap-2 px-2 py-1 text-left">
            <Image
              src={addedBy.profileImage}
              alt={addedBy.name}
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
            <span className="font-medium text-black">{addedBy.name}</span>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.ADDED_BY,
    },
    {
      accessorKey: 'dateAdded',
      header: () => (
        <TableHeader iconName="calendarIcon" title="Date added" />
      ),
      cell: ({ row }) => {
        const dateAdded = row.getValue('dateAdded') as Date;

        return (
          <div className="relative">
            <div
              className="flex items-center w-full gap-2 px-2 py-1 text-left"
            >
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