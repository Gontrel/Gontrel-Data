import { ColumnDef } from '@tanstack/react-table';
import { SubmittedVideoTableTypes } from '@/types/restaurant';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { TABLE_COLUMN_SIZES } from "@/constants";
import { getBgColor, getTextColor } from '@/lib/tableUtils';
import { PillButton } from '@/components/ui/PillButton';
import { TableHeader } from './utils';

/**
 * Creates column definitions for submitted videos table
 */
export const createSubmittedVideosColumns = (): ColumnDef<SubmittedVideoTableTypes>[] => [
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
      accessorKey: 'posts',
      header: () => (
        <TableHeader iconName="videoIcon" title="Video" />
      ),
      cell: ({ row }) => {
        const { status } = row.original;
        const postsLength = 1;
        return (
          <div className="flex flex-col gap-y-2 w-fit">
            <PillButton text={`${postsLength} video${postsLength > 1 ? 's' : ''}`} textColor={getTextColor([{ status }])} bgColor={getBgColor([{ status }])} />
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
      accessorKey: 'comment',
      header: () => (
        <TableHeader title="Comment" />
      ),
      cell: ({ row }) => {
        const comment = row.getValue('comment') as string;

        return (
          <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
            <span className="text-black font-medium">{comment}</span>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.COMMENT,
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