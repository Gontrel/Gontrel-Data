import React, { useMemo, useState } from 'react'
import { RestaurantTable } from './RestaurantTable'
import { useRestaurants } from '@/hooks/useRestaurants';
import { formatDate } from '@/lib/utils';
import { PendingVideoType } from '@/types/restaurant';
import { ColumnDef } from '@tanstack/react-table';
import { MapPin, Calendar, Video } from 'lucide-react';
import { ActionButtons } from '../ui/ActionButtons';
import { ExternalLink } from '../ui/ExternalLink';
import Image from 'next/image';
import { ManagerTableTabs } from '@/constant/table';

interface PendingVideosProps {
    searchTerm: string;
    currentPage: number;
    pageSize: number;
    handleCurrentPage: (page: number) => void;
    handlePageSize: (pageSize: number) => void;
}

const PendingVideos = ({ searchTerm, currentPage, pageSize, handleCurrentPage, handlePageSize }: PendingVideosProps) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const handleRowSelect = (selectedRows: PendingVideoType[]) => {
        console.log('Selected videos:', selectedRows);
        // Handle bulk actions here
    };

    const columns = useMemo<ColumnDef<PendingVideoType>[]>(() => [
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
            minSize: 80,
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
            minSize: 150,
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
                const video = row.getValue('video') as { videoUrl: string };
                return (
                    <ExternalLink href={video.videoUrl} title={video.videoUrl}>
                        <span className="text-black">View video</span>
                    </ExternalLink>
                );
            },
            minSize: 180,
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
            cell: ({ row }) => (
                <ActionButtons
                    actions={[
                        {
                            label: 'Approve',
                            onClick: () => {
                                // Handle approve action
                                console.log('Approving video:', row.original.id);
                            },
                            variant: 'success'
                        },
                        {
                            label: 'Decline',
                            onClick: () => {
                                // Handle decline action
                                console.log('Declining video:', row.original.id);
                            },
                            variant: 'danger'
                        }
                    ]}
                />
            ),
            minSize: 150,
        },
    ], [expandedRows]);

    // Fetch data with pageSize
    const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
        tableId: ManagerTableTabs.PENDING_VIDEOS,
        search: searchTerm,
        page: currentPage,
        limit: pageSize
    });

    return (
        <RestaurantTable<PendingVideoType>
            restaurants={restaurantsData?.data || []}
            loading={restaurantsLoading}
            onRowSelect={handleRowSelect}
            showSelection={true}
            columns={columns}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={restaurantsData?.pagination?.totalPages || 1}
            onPageSizeChange={(pageSize) => handlePageSize(pageSize)}
            onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
        />
    )
}

export default PendingVideos
