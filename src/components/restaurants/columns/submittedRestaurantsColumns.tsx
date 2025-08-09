import { ColumnDef, Row } from "@tanstack/react-table";
import { SubmittedRestaurantTableTypes } from "@/types/restaurant";
import { Check, X } from "lucide-react";
import { ActionButtons } from "../../ui/ActionButtons";
import { ExternalLink } from "../../ui/ExternalLink";
import { formatDate } from "@/lib/utils";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { ApprovalStatusEnum } from "@/types/enums";
import { getBgColor, getTextColor } from "@/lib/tableUtils";
import { PillButton } from "@/components/ui/PillButton";
import { TableHeader } from "./utils";
import { Post } from "@/interfaces";

/**
 * Creates column definitions for submitted restaurants table
 * @param openVideoPreview - Handler for open video preview action
 * @param openResubmitModal - Handler for open resubmit modal action
 */
export const createSubmittedRestaurantsColumns = (
  handleOpenVideoPreview: (posts: Post[], restaurantId: string) => void,
  handleOpenResubmitModal: (restaurantId: string) => void,
  onRowClick?: (row: SubmittedRestaurantTableTypes) => void
): ColumnDef<SubmittedRestaurantTableTypes>[] => [
  {
    accessorKey: "id",
    header: () => <TableHeader title="#" />,
    cell: ({ row, table }) => {
      const { pageSize, pageIndex } = table.getState().pagination;
      const rowIndex = row.index + 1;
      const calculatedId = pageIndex * pageSize + rowIndex;

      return (
        <div className="font-medium text-[#181D1F] w-fit truncate">
          {calculatedId}
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.ID,
    meta: { sticky: true },
  },
    {
      accessorKey: 'name',
      header: () => (
        <TableHeader title="Restaurant name" />
      ),
      cell: ({ row }) => {
        const handleClick = (e: React.MouseEvent, row: Row<SubmittedRestaurantTableTypes>) => {
          onRowClick?.(row.original);
        };
        const handleKeyDown = (
          e: React.KeyboardEvent,
          row: Row<SubmittedRestaurantTableTypes>,
          onRowClick?: (row: SubmittedRestaurantTableTypes) => void
        ) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRowClick?.(row.original);
          }
        };
        return (
          <div
            onClick={(e) => handleClick(e, row)}
            onKeyDown={(e) => handleKeyDown(e, row, onRowClick)}
            role="button"
            tabIndex={0}
            aria-label="View restaurant details"
            className="absolute top-0 bottom-0 left-0 right-0 flex items-center py-5 px-2.5 cursor-pointer font-medium text-[#181D1F] hover:text-blue-500 max-w-60 w-full h-full hover:bg-gray-50 overflow-hidden"
          >
            <span className="truncate w-full">{row.original.name ?? ""}</span>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.NAME,
      meta: { sticky: true }
    },
  {
    accessorKey: "video",
    header: () => <TableHeader iconName="videoIcon" title="Video" />,
    cell: ({ row }) => {
      const posts = row.original.posts;

      return (
        <div className="flex flex-col gap-y-2 w-fit">
          <PillButton
            text={`${
              posts?.filter(
                (post) => post.status !== ApprovalStatusEnum.PENDING
              ).length
            }/${posts.length} video${posts.length > 1 ? "s" : ""}`}
            textColor={getTextColor(
              posts.map((post) => ({ status: post.status }))
            )}
            bgColor={getBgColor(posts.map((post) => ({ status: post.status })))}
          />
          <span
            className="text-left text-blue-500 hover:underline hover:cursor-pointer"
            onClick={() => handleOpenVideoPreview(posts, row.original.id)}
          >
            View
          </span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "website",
    header: () => <TableHeader iconName="linkIcon" title="Website" />,
    cell: ({ row }) => {
      const url = row.original.website ?? "";
      return (
        <ExternalLink href={url} title={url}>
          <span className="text-black">View website</span>
        </ExternalLink>
      );
    },
    minSize: TABLE_COLUMN_SIZES.WEBSITE,
  },
  {
    accessorKey: "address",
    header: () => <TableHeader iconName="mapPinIcon" title="Address" />,
    cell: ({ row }) => {
      const { content, status } = row.original.address;
      const maplink = row.original.mapLink ?? "";
      const isApproved = status === ApprovalStatusEnum.APPROVED;
      const isPending = status === ApprovalStatusEnum.PENDING;

      return (
        <div
          className={`flex flex-col gap-y-2 ${!isPending && "items-center"}`}
        >
          <ExternalLink href={maplink} title={`View ${content} on Google Maps`}>
            <span className="text-black truncate max-w-52">{content}</span>
          </ExternalLink>
          {!isPending && (
            <ActionButtons
              actions={[
                {
                  icon: isApproved ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <X className="w-6 h-6" />
                  ),
                  onClick: () => {},
                  variant: isApproved ? "success" : "danger",
                  active: true,
                  disabled: true,
                  label: isApproved ? "Approved" : "Declined",
                },
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
    accessorKey: "menu",
    header: () => <TableHeader iconName="linkIcon" title="Menu link" />,
    cell: ({ row }) => {
      const { content, status } = row.original.menu;
      const isApproved = status === ApprovalStatusEnum.APPROVED;
      const isPending = status === ApprovalStatusEnum.PENDING;
      return (
        <div
          className={`flex flex-col gap-y-2 ${!isPending && "items-center"}`}
        >
          <ExternalLink href={content} title={content}>
            <span className="text-black">View link</span>
          </ExternalLink>
          {!isPending && (
            <ActionButtons
              actions={[
                {
                  icon: isApproved ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <X className="w-6 h-6" />
                  ),
                  onClick: () => {},
                  variant: isApproved ? "success" : "danger",
                  active: true,
                  disabled: true,
                  label: isApproved ? "Approved" : "Declined",
                },
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
    accessorKey: "reservation",
    header: () => <TableHeader iconName="linkIcon" title="Reservation link" />,
    cell: ({ row }) => {
      const { content, status } = row.original.reservation;
      const isApproved = status === ApprovalStatusEnum.APPROVED;
      const isPending = status === ApprovalStatusEnum.PENDING;
      return (
        <div
          className={`flex flex-col gap-y-2 ${!isPending && "items-center"}`}
        >
          <ExternalLink href={content} title={content}>
            <span className="text-black">View link</span>
          </ExternalLink>
          {!isPending && (
            <ActionButtons
              actions={[
                {
                  icon: isApproved ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <X className="w-6 h-6" />
                  ),
                  onClick: () => {},
                  variant: isApproved ? "success" : "danger",
                  active: true,
                  disabled: true,
                  label: isApproved ? "Approved" : "Declined",
                },
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
    accessorKey: "comment",
    header: () => <TableHeader title="Comment" />,
    cell: ({ row }) => {
      const comment = row.getValue("comment") as string;

      return (
        <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
          <span className="text-black font-medium">{comment}</span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.COMMENT,
  },
  {
    accessorKey: "dateAdded",
    header: () => <TableHeader iconName="calendarIcon" title="Date added" />,
    cell: ({ row }) => {
      const dateAdded = row.getValue("dateAdded") as Date;

      return (
        <div className="relative">
          <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
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
    id: "action",
    header: () => <TableHeader title="Actions" />,
    cell: ({ row }) => {
      const isPending =
        row.original.videos.pending > 0 ||
        row.original.address.status === ApprovalStatusEnum.PENDING ||
        row.original.menu.status === ApprovalStatusEnum.PENDING ||
        row.original.reservation.status === ApprovalStatusEnum.PENDING;
      return (
        !isPending && (
          <ActionButtons
            actions={[
              {
                label: "Resubmit",
                onClick: () => handleOpenResubmitModal(row.original.id),
                variant: "primary",
                disabled: false,
              },
            ]}
            className="w-42.5 h-12"
          />
        )
      );
    },
    minSize: TABLE_COLUMN_SIZES.ACTIONS,
  },
];
