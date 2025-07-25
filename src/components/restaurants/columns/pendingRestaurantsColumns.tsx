import { ColumnDef } from '@tanstack/react-table';
import { PendingRestaurantType } from '@/types/restaurant';
import { MapPin, Link, Clock, Calendar } from 'lucide-react';
import { ActionButtons } from '../../ui/ActionButtons';
import { ExpandableContent } from '../../ui/ExpandableContent';
import { ExternalLink } from '../../ui/ExternalLink';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { TABLE_COLUMN_SIZES } from '@/constant/table';
import { updateSetValue } from '@/lib/tableUtils';

/**
 * Creates column definitions for pending restaurants table
 * @param expandedRows - Set of expanded row IDs
 * @param setExpandedRows - Function to update expanded rows
 * @param onApprove - Handler for approve action
 * @param onUpdateAndApprove - Handler for update and approve action
 * @param onDecline - Handler for decline action
 */
export const createPendingRestaurantsColumns = (
  expandedRows: Set<string>,
  setExpandedRows: (rows: Set<string>) => void,
  onApprove: (restaurant: PendingRestaurantType) => void,
  onUpdateAndApprove: (restaurant: PendingRestaurantType) => void,
  onDecline: (restaurant: PendingRestaurantType) => void
): ColumnDef<PendingRestaurantType>[] => [
    {
      accessorKey: 'id',
      header: () => (
        <div className="flex items-center gap-2">
          <span>#</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-[#181D1F] max-w-60 truncate">
          {row.index + 1}
        </div>
      ),
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
      cell: ({ row }) => (
        <div className="font-medium text-[#181D1F] max-w-60 truncate">
          {`${0}/${row.original.videos.length} videos`}
        </div>
      ),
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
        const address = row.getValue('address') as string;
        const maplink = row.original.maplink;

        return (
          <ExternalLink
            href={maplink}
            className="max-w-68"
            title={`View ${address} on Google Maps`}
          >
            <span className="text-black truncate max-w-60">{address}</span>
          </ExternalLink>
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
        const url = row.getValue('menuUrl') as string;
        return (
          <ExternalLink href={url} title={url}>
            <span className="text-black">View link</span>
          </ExternalLink>
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
        const url = row.getValue('reservationUrl') as string;
        return (
          <ExternalLink href={url} title={url}>
            <span className="text-black">View link</span>
          </ExternalLink>
        );
      },
      minSize: TABLE_COLUMN_SIZES.RESERVATION_LINK,
    },
    {
      accessorKey: 'openingHours',
      header: () => (
        <div className="flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Opening hours</span>
        </div>
      ),
      cell: ({ row }) => {
        const openingHours = row.getValue('openingHours') as Record<string, string>;
        const isExpanded = expandedRows.has(`hours-${row.id}`);

        return (
          <ExpandableContent
            trigger={<span className="text-black font-medium">View working hours</span>}
            expanded={isExpanded}
            onToggle={(expanded) => {
              const key = `hours-${row.id}`;
              setExpandedRows(updateSetValue(expandedRows, key, expanded));
            }}
          >
            <div className="p-3">
              <div className="text-xs font-medium text-gray-500 mb-2">
                Working hours
              </div>
              <div className="space-y-1 text-sm">
                {Object.entries(openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium capitalize text-black">{day}</span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </ExpandableContent>
        );
      },
      minSize: TABLE_COLUMN_SIZES.OPENING_HOURS,
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
    {
      id: 'action',
      header: () => (
        <div className="flex items-center gap-2">
          <span className="text-black font-medium">Actions</span>
        </div>
      ),
      cell: ({ row }) => (
        <ActionButtons
          actions={[
            {
              label: 'Approve',
              onClick: () => onApprove(row.original),
              variant: 'success'
            },
            {
              label: 'Update & approve',
              onClick: () => onUpdateAndApprove(row.original),
              variant: 'primary'
            },
            {
              label: 'Decline',
              onClick: () => onDecline(row.original),
              variant: 'danger'
            }
          ]}
        />
      ),
      minSize: TABLE_COLUMN_SIZES.ACTIONS,
    },
  ];