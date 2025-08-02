import { ColumnDef } from '@tanstack/react-table';
import { SubmittedRestaurantType } from '@/types/restaurant';
import { Check, X } from 'lucide-react';
import { ActionButtons } from '../../ui/ActionButtons';
import { ExternalLink } from '../../ui/ExternalLink';
import { formatDate } from '@/lib/utils';
import { TABLE_COLUMN_SIZES } from "@/constants";
import { TableStatusEnum } from "@/types/enums";
import { getBgColor, getTextColor } from '@/lib/tableUtils';
import { PillButton } from '@/components/ui/PillButton';
import { TableHeader } from './utils';

/**
 * Creates column definitions for submitted restaurants table
 * @param handleResubmit - Handler for resubmit action
 */
export const createSubmittedRestaurantsColumns = (
  handleResubmit: (restaurant: SubmittedRestaurantType) => void
): ColumnDef<SubmittedRestaurantType>[] => [
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
        const posts = row.original.posts;
        const isPending = videos.pending > 0;
        let text = `${videos.pending}/${videos.total} video${videos.total > 1 ? 's' : ''}`;

        if (isPending) {
          text = videos.pending > 1 ? `${videos.pending} videos` : `${videos.pending} video`;
        }

        return (
          <div className="flex flex-col gap-y-2 w-fit">
            <PillButton text={text} textColor={getTextColor(posts)} bgColor={getBgColor(posts)} />
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
      accessorKey: 'website',
      header: () => (
        <TableHeader iconName="linkIcon" title="Website" />
      ),
      cell: ({ row }) => {
        const url = row.getValue('website') as string;
        return (
          <ExternalLink href={url} title={url}>
            <span className="text-black">View website</span>
          </ExternalLink>
        );
      },
      minSize: TABLE_COLUMN_SIZES.WEBSITE,
    },
    {
      accessorKey: 'address',
      header: () => (
        <TableHeader iconName="mapPinIcon" title="Address" />
      ),
      cell: ({ row }) => {
        const { content, status } = row.original.address;
        const maplink = row.original.mapLink ?? '';
        const isApproved = status === TableStatusEnum.APPROVED;
        const isPending = status === TableStatusEnum.PENDING;

        return (
          <div className={`flex flex-col gap-y-2 ${!isPending && 'items-center'}`}>
            <ExternalLink
              href={maplink}
              title={`View ${content} on Google Maps`}
            >
              <span className="text-black truncate max-w-52">{content}</span>
            </ExternalLink>
            {!isPending && (
              <ActionButtons
              actions={[
                {
                  icon: isApproved ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />,
                  onClick: () => {},
                  variant: isApproved ? 'success' : 'danger',
                  active: true,
                  disabled: true,
                  label: isApproved ? 'Approved' : 'Declined'
                }
              ]}
              className="w-64 h-9"
              />
            )}
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.ADDRESS,
    },
    {
      accessorKey: 'menu',
      header: () => (
        <TableHeader iconName="linkIcon" title="Menu link" />
      ),
      cell: ({ row }) => {
        const { content, status } = row.original.menu;
        const isApproved = status === TableStatusEnum.APPROVED;
        const isPending = status === TableStatusEnum.PENDING;
        return (
          <div className={`flex flex-col gap-y-2 ${!isPending && 'items-center'}`}>
            <ExternalLink href={content} title={content}>
              <span className="text-black">View link</span>
            </ExternalLink>
            {!isPending && (
              <ActionButtons
                actions={[
                  {
                    icon: isApproved ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />,
                    onClick: () => {},
                    variant: isApproved ? 'success' : 'danger',
                    active: true,
                    disabled: true,
                    label: isApproved ? 'Approved' : 'Declined'
                  }
                ]}
                className="w-64 h-9"
              />
            )}
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.MENU_LINK,
    },
    {
      accessorKey: 'reservation',
      header: () => (
        <TableHeader iconName="linkIcon" title="Reservation link" />
      ),
      cell: ({ row }) => {
        const { content, status } = row.original.reservation;
        const isApproved = status === TableStatusEnum.APPROVED;
        const isPending = status === TableStatusEnum.PENDING;
        return (
          <div className={`flex flex-col gap-y-2 ${!isPending && 'items-center'}`}>
            <ExternalLink href={content} title={content}>
              <span className="text-black">View link</span>
            </ExternalLink>
            {!isPending && (
              <ActionButtons
              actions={[
                {
                  icon: isApproved ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />,
                  onClick: () => {},
                  variant: isApproved ? 'success' : 'danger',
                  active: true,
                  disabled: true,
                  label: isApproved ? 'Approved' : 'Declined'
                }
              ]}
              className="w-64 h-9"
            />
            )}
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.RESERVATION_LINK,
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
              className="flex items-center gap-2 px-2 py-1 w-full text-left"
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
    {
      id: 'action',
      header: () => (
        <TableHeader title="Actions" />
      ),
      cell: ({ row }) => {
        const isPending = row.original.videos.pending > 0 || row.original.address.status === TableStatusEnum.PENDING || row.original.menu.status === TableStatusEnum.PENDING || row.original.reservation.status === TableStatusEnum.PENDING;
        return (
          !isPending && <ActionButtons
            actions={[
              {
                label: 'Resubmit',
                onClick: () => handleResubmit(row.original),
                variant: 'primary',
                disabled: false,
              },
            ]}
            className="w-42.5 h-12"
          />
        );
      },
      minSize: TABLE_COLUMN_SIZES.ACTIONS,
    },
  ];