import { ColumnDef } from '@tanstack/react-table';
import { PendingRestaurantType } from '@/types/restaurant';
import { PendingRestaurantStatusKey } from '@/hooks/usePendingRestaurants';
import { MapPin, Link, Calendar, Check, X } from 'lucide-react';
import { ActionButtons } from '../../ui/ActionButtons';
import { ExternalLink } from '../../ui/ExternalLink';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { TABLE_COLUMN_SIZES, TableStatus } from '@/constant/table';
import { getBgColor, getTextColor, updateSetValue } from '@/lib/tableUtils';
import { PillButton } from '@/components/ui/PillButton';

/**
 * Creates column definitions for pending restaurants table
 * @param expandedRows - Set of expanded row IDs
 * @param setExpandedRows - Function to update expanded rows
 * @param handleApprove - Handler for approve action
 * @param handleDecline - Handler for decline action
 */
export const createPendingRestaurantsColumns = (
  expandedRows: Set<string>,
  setExpandedRows: (rows: Set<string>) => void,
  handleApprove: (restaurant: PendingRestaurantType, statusKey?: PendingRestaurantStatusKey) => void,
  handleDecline: (restaurant: PendingRestaurantType, statusKey?: PendingRestaurantStatusKey) => void,
  handleSendFeedback: (restaurant: PendingRestaurantType) => void,
  handleSave: (restaurant: PendingRestaurantType) => void
): ColumnDef<PendingRestaurantType>[] => [
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
      accessorKey: 'name',
      header: () => (
        <div className="flex items-center gap-2">
          <span>Restaurant name</span>
        </div>
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
        <div className="flex items-center gap-2">
          <span>Video</span>
        </div>
      ),
      cell: ({ row }) => {
        const videos = row.original.videos;
        return (
          <div className="flex flex-col gap-y-2 w-fit">
            <PillButton text={`${videos.filter(video => video.status !== TableStatus.PENDING).length}/${videos.length} video${videos.length > 1 ? 's' : ''}`} textColor={getTextColor(videos)} bgColor={getBgColor(videos)} />
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
        <div className="flex items-center gap-2">
          <Link className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Website</span>
        </div>
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
        <div className="flex items-center gap-2">
          <MapPin className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Address</span>
        </div>
      ),
      cell: ({ row }) => {
        const { name, status } = row.original.address;
        const maplink = row.original.maplink;
        const isApproved = status === TableStatus.APPROVED;
        const isDeclined = status === TableStatus.DECLINED;

        return (
          <div className="flex flex-col gap-y-2">
            <ExternalLink
              href={maplink}
              title={`View ${name} on Google Maps`}
            >
              <span className="text-black truncate max-w-52">{name}</span>
            </ExternalLink>
            <ActionButtons
              actions={[
                {
                  icon: <Check className="w-6 h-6" />,
                  onClick: () => handleApprove(row.original, 'address'),
                  variant: 'success',
                  active: isApproved
                },
                {
                  icon: <X className="w-6 h-6" />,
                  onClick: () => handleDecline(row.original, 'address'),
                  variant: 'danger',
                  active: isDeclined
                }
              ]}
              className="w-64 h-9"
            />
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.ADDRESS,
    },
    {
      accessorKey: 'menuUrl',
      header: () => (
        <div className="flex items-center gap-2">
          <Link className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Menu link</span>
        </div>
      ),
      cell: ({ row }) => {
        const { url, status } = row.original.menuUrl;
        const isApproved = status === TableStatus.APPROVED;
        const isDeclined = status === TableStatus.DECLINED;
        return (
          <div className="flex flex-col gap-y-2">
            <ExternalLink href={url} title={url}>
              <span className="text-black">View link</span>
            </ExternalLink>
            <ActionButtons
              actions={[
                {
                  icon: <Check className="w-6 h-6" />,
                  onClick: () => handleApprove(row.original, 'menuUrl'),
                  variant: 'success',
                  active: isApproved
                },
                {
                  icon: <X className="w-6 h-6" />,
                  onClick: () => handleDecline(row.original, 'menuUrl'),
                  variant: 'danger',
                  active: isDeclined
                }
              ]}
              className="w-64 h-9"
            />
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.MENU_LINK,
    },
    {
      accessorKey: 'reservationUrl',
      header: () => (
        <div className="flex items-center gap-2">
          <Link className="w-5 h-5 text-[#8A8A8A]" />
          <span>Reservation link</span>
        </div>
      ),
      cell: ({ row }) => {
        const { url, status } = row.original.reservationUrl;
        const isApproved = status === TableStatus.APPROVED;
        const isDeclined = status === TableStatus.DECLINED;
        return (
          <div className="flex flex-col gap-y-2">
            <ExternalLink href={url} title={url}>
              <span className="text-black">View link</span>
            </ExternalLink>
            <ActionButtons
              actions={[
                {
                  icon: <Check className="w-6 h-6" />,
                  onClick: () => handleApprove(row.original, 'reservationUrl'),
                  variant: 'success',
                  active: isApproved
                },
                {
                  icon: <X className="w-6 h-6" />,
                  onClick: () => handleDecline(row.original, 'reservationUrl'),
                  variant: 'danger',
                  active: isDeclined
                }
              ]}
              className="w-64 h-9"
            />
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.RESERVATION_LINK,
    },
    // {
    //   accessorKey: 'openingHours',
    //   header: () => (
    //     <div className="flex items-center gap-2">
    //       <Clock className="w-4.5 h-4.5 text-[#8A8A8A]" />
    //       <span>Opening hours</span>
    //     </div>
    //   ),
    //   cell: ({ row }) => {
    //     const openingHours = row.getValue('openingHours') as Record<string, string>;
    //     const isExpanded = expandedRows.has(`hours-${row.id}`);

    //     return (
    //       <ExpandableContent
    //         trigger={<span className="text-black font-medium">View working hours</span>}
    //         expanded={isExpanded}
    //         onToggle={(expanded) => {
    //           const key = `hours-${row.id}`;
    //           setExpandedRows(updateSetValue(expandedRows, key, expanded));
    //         }}
    //       >
    //         <div className="p-3">
    //           <div className="text-xs font-medium text-gray-500 mb-2">
    //             Working hours
    //           </div>
    //           <div className="space-y-1 text-sm">
    //             {Object.entries(openingHours).map(([day, hours]) => (
    //               <div key={day} className="flex justify-between">
    //                 <span className="font-medium capitalize text-black">{day}</span>
    //                 <span className="text-gray-600">{hours}</span>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       </ExpandableContent>
    //     );
    //   },
    //   minSize: TABLE_COLUMN_SIZES.OPENING_HOURS,
    // },
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
    {
      id: 'action',
      header: () => (
        <div className="flex items-center gap-2">
          <span className="text-black font-medium">Actions</span>
        </div>
      ),
      cell: ({ row }) => {
        const shouldSendFeedback = row.original.videos.some((video) => video.status === TableStatus.DECLINED) || row.original.address.status === TableStatus.DECLINED || row.original.menuUrl.status === TableStatus.DECLINED || row.original.reservationUrl.status === TableStatus.DECLINED;
        return (
          <ActionButtons
            actions={[
              {
                label: shouldSendFeedback ? 'Send Feedback' : 'Save',
                onClick: () => shouldSendFeedback ? handleSendFeedback(row.original) : handleSave(row.original),
                variant: shouldSendFeedback ? 'danger' : 'primary',
                disabled: (
                  row.original.videos.some(
                    (video: { status: TableStatus }) => video.status === TableStatus.PENDING
                  ) ||
                  row.original.address.status === TableStatus.PENDING ||
                  row.original.menuUrl.status === TableStatus.PENDING ||
                  row.original.reservationUrl.status === TableStatus.PENDING
                ),
              },
            ]}
            className="w-42.5 h-12"
          />
        );
      },
      minSize: TABLE_COLUMN_SIZES.ACTIONS,
    },
  ];