import { ColumnDef } from '@tanstack/react-table';
import { PendingVideoType } from '@/types/restaurant';
import { Calendar, Video } from 'lucide-react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { TABLE_COLUMN_SIZES } from '@/constant/table';
import { getBgColor, getTextColor, updateSetValue } from '@/lib/tableUtils';
import { PillButton } from '@/components/ui/PillButton';

/**
 * Creates column definitions for pending videos table
 * @param expandedRows - Set of expanded row IDs
 * @param setExpandedRows - Function to update expanded rows
 * @param onApprove - Handler for approve action
 * @param onDecline - Handler for decline action
 */
export const createPendingVideosColumns = (
  expandedRows: Set<string>,
  setExpandedRows: (rows: Set<string>) => void
): ColumnDef<PendingVideoType>[] => [
    {
      accessorKey: 'id',
      header: () => (
        <div className="flex items-center gap-2">
          <span>#</span>
        </div>
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
      accessorKey: 'restaurantId',
      header: () => (
        <div className="flex items-center gap-2">
          <span>Restaurant ID</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-[#181D1F] max-w-60 truncate">
          {row.getValue('restaurantId')}
        </div>
      ),
      minSize: TABLE_COLUMN_SIZES.NAME,
    },
    {
      accessorKey: 'video',
      header: () => (
        <div className="flex items-center gap-2">
          <Video className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Video</span>
        </div>
      ),
      cell: ({ row }) => {
        const videos = row.original.videos;
        return (
          <div className="flex flex-col gap-y-2 w-fit">
            <PillButton text={`${videos.length} video${videos.length > 1 ? 's' : ''}`} textColor={getTextColor(videos)} bgColor={getBgColor(videos)} />
            <button onClick={() => {
              // TODO: Open video modal
            }} className="text-blue-500 text-left">
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
        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Added by</span>
        </div>
      ),
      cell: ({ row }) => {
        const addedBy = row.getValue('addedBy') as { name: string; profileImage: string };

        return (
          <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
            <Image
              src={addedBy.profileImage}
              alt={addedBy.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="text-black font-medium">{addedBy.name}</span>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.ADDED_BY,
    },
    {
      accessorKey: 'dateAdded',
      header: () => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Date added</span>
        </div>
      ),
      cell: ({ row }) => {
        const dateAdded = row.getValue('dateAdded') as Date;
        const isExpanded = expandedRows.has(row.id);

        return (
          <div className="relative">
            <button
              onClick={() => {
                setExpandedRows(updateSetValue(expandedRows, row.id, !isExpanded));
              }}
              className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded transition-colors w-full text-left"
            >
              <span className="text-[#181D1F] font-medium">
                {formatDate(dateAdded)}
              </span>
            </button>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
    },
  ];