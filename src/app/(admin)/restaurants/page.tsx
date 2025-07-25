'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { RestaurantTable } from '../../../components/restaurants/RestaurantTable';
import { SearchBar } from '../../../components/admin/SearchBar';
import { useRestaurants } from '../../../hooks/useRestaurants';
import { Restaurant } from '../../../types/restaurant';
import { Calendar, Clock, Link, MapPin, Plus } from 'lucide-react';
// import { NewRestaurantModal } from '../../../components/restaurants/NewRestaurantModal';
// import { WorkingHours } from '../../../components/restaurants/EditWorkingHoursModal';
import { StatsGrid } from '../../../components/ui/StatsGrid';
import { ActionButtons } from '@/components/ui/ActionButtons';
import { ExpandableContent } from '@/components/ui/ExpandableContent';
import { formatDate } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLink } from '@/components/ui/ExternalLink';

/**
 * Restaurants management page
 */
export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pending');
  const [showNewRestaurantModal, setShowNewRestaurantModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const activeTabStyles = 'text-[#0070F3] border-b-4 border-[#0070F3] font-semibold';
  const inactiveTabStyles = 'text-[#8A8A8A]';

  // Fetch data
  const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
    search: searchTerm,
    page: currentPage,
    limit: 10
  });

  // Stats data - this could come from an API
  const statsData = [
    {
      label: 'Total restaurants',
      value: '3.5k'
    },
    {
      label: 'Total active restaurants',
      value: '3.2k'
    },
    {
      label: 'Pending restaurants',
      value: '300'
    },
    {
      label: 'Inactive restaurants',
      value: '150'
    }
  ];
  const columns = useMemo<ColumnDef<Restaurant>[]>(() => [
    {
      accessorKey: 'name',
      header: () => (
        <div className="flex items-center gap-2">
          <span>Restaurant name</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-[#181D1F] max-w-60 truncate">{row.getValue('name')}</div>
      ),
      minSize: 200,
      meta: {
        sticky: true
      }
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
      minSize: 200,
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
      minSize: 180,
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
      minSize: 150,
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
      minSize: 150,
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
              const newExpanded = new Set(expandedRows);
              const key = `hours-${row.id}`;
              if (expanded) {
                newExpanded.add(key);
              } else {
                newExpanded.delete(key);
              }
              setExpandedRows(newExpanded);
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
      minSize: 150,
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
          <div
            className="flex items-center gap-2 px-2 py-1 w-full text-left"
          >
            <Image
              src={addedBy.profileImage}
              alt={addedBy.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="text-black font-medium">
              {addedBy.name}
            </span>
          </div>
        );
      },
      minSize: 150,
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
                const newExpanded = new Set(expandedRows);
                if (isExpanded) {
                  newExpanded.delete(row.id);
                } else {
                  newExpanded.add(row.id);
                }
                setExpandedRows(newExpanded);
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
      minSize: 150,
    },
    {
      id: 'action',
      header: () => (
        <div className="flex items-center gap-2">
          <span className="text-black font-medium">Actions</span>
        </div>
      ),
      cell: () => (
        <ActionButtons
          actions={[
            {
              label: 'Approve',
              onClick: () => {
                // Handle approve action
              },
              variant: 'success'
            },
            {
              label: 'Update & approve',
              onClick: () => {
                // Handle update and approve action
              },
              variant: 'primary'
            },
            {
              label: 'Decline',
              onClick: () => {
                // Handle decline action
              },
              variant: 'danger'
            }
          ]}
        />
      ),
      minSize: 150,
    },
  ], [expandedRows]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRowSelect = (selectedRows: Restaurant[]) => {
    console.log('Selected restaurants:', selectedRows);
    // Handle bulk actions here
  };

  // const handleNewRestaurantSubmit = async (data: {
  //   name: string;
  //   address: string;
  //   website?: string;
  //   menuUrl?: string;
  //   reservationUrl?: string;
  //   workingHours: WorkingHours;
  //   tiktokUrl?: string;
  //   tags: string[];
  //   videoFile?: File;
  // }) => {
  //   // TODO: Implement API call to create new restaurant
  //   console.log('New restaurant data:', data);
  // };

  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
      {/* Main Content */}
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">

        {/* Restaurant Stats */}
        <StatsGrid stats={statsData} />

        {/* Table Tabs */}
        <div className="flex items-center justify-between border-b border-[#D5D5D5] mb-2.5 overflow-x-auto">
          <div className="flex items-center gap-x-7.5 min-w-0">
            <button className={`text-lg font-medium py-3 px-2.5 whitespace-nowrap ${activeTab === 'active' ? activeTabStyles : inactiveTabStyles}`} onClick={() => setActiveTab('active')}>Active restaurants</button>
            <button className={`text-lg font-medium py-3 px-2.5 whitespace-nowrap ${activeTab === 'pending' ? activeTabStyles : inactiveTabStyles}`} onClick={() => setActiveTab('pending')}>Pending restaurants</button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full sm:max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search using name or ID"
            />
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              className="bg-[#0070F3] text-white px-3 py-4 rounded-[10px] hover:bg-[#0070F3] transition-colors w-full sm:w-auto"
              title="Submit for approval"
              onClick={() => setShowNewRestaurantModal(true)}
            >
              <span className="flex items-center gap-2 justify-center">
                <Plus className="w-6 h-6" />
                Add Restaurant
              </span>
            </button>
          </div>
        </div>

        {/* Restaurant Table */}
        <div className="w-full">
          <RestaurantTable
            restaurants={restaurantsData?.data || []}
            loading={restaurantsLoading}
            onRowSelect={handleRowSelect}
            showSelection={true}
            columns={columns}
          />
        </div>
      </div>

      {/* New Restaurant Modal */}
      {/* <NewRestaurantModal
        isOpen={showNewRestaurantModal}
        onClose={() => setShowNewRestaurantModal(false)}
        onSubmit={handleNewRestaurantSubmit}
      /> */}
    </div>
  );
}