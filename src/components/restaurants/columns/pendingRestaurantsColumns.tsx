import { ColumnDef } from "@tanstack/react-table";
import { PendingRestaurantType } from "@/types/restaurant";
import { PendingRestaurantStatusKey } from "@/hooks/usePendingRestaurants";
import { Check, X } from "lucide-react";
import { ActionButtons } from "../../ui/ActionButtons";
import { ExternalLink } from "../../ui/ExternalLink";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { ApprovalStatusEnum } from "@/types/enums";
import { getBgColor, getTextColor } from "@/lib/tableUtils";
import { PillButton } from "@/components/ui/PillButton";
import { TableHeader } from "./utils";
import Logo from "@/assets/images/logo.png";
import { Post } from "@/types";

/**
 * Creates column definitions for pending restaurants table
 * @param openVideoPreview - Handler for open video preview action
 * @param handleApprove - Handler for approve action
 * @param handleDecline - Handler for decline action
 * @param handleSendFeedback - Handler for send feedback action
 * @param handleSave - Handler for save action
 */
export const createPendingRestaurantsColumns = (
  openVideoPreview: (posts: Post[], restaurantId: string) => void,
  handleApprove: (
    restaurantId: string,
    statusKey?: PendingRestaurantStatusKey
  ) => void,
  handleDecline: (
    restaurantId: string,
    statusKey?: PendingRestaurantStatusKey
  ) => void,
  handleSendFeedback: (restaurant: PendingRestaurantType, comment?: string) => void,
  handleSaveRestaurant: (restaurant: PendingRestaurantType) => void
): ColumnDef<PendingRestaurantType>[] => [
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
      accessorKey: "name",
      header: () => <TableHeader title="Restaurant name" />,
      cell: ({ row }) => (
        <div className="font-medium text-[#181D1F] max-w-60 overflow-auto break-all">
          {row.getValue("name")}
        </div>
      ),
      minSize: TABLE_COLUMN_SIZES.NAME,
      meta: { sticky: true },
    },
    {
      accessorKey: "video",
      header: () => <TableHeader iconName="videoIcon" title="Video" />,
      cell: ({ row }) => {
        const posts = row.original.posts;
        return (
            <div className="flex flex-col gap-y-2 w-fit">
              <PillButton
                text={`${posts?.filter((post) => post.status !== ApprovalStatusEnum.PENDING)
                  .length
                  }/${posts.length} video${posts.length > 1 ? "s" : ""}`}
                textColor={getTextColor(posts.map((post) => ({ status: post.status })))}
                bgColor={getBgColor(posts.map((post) => ({ status: post.status })))}
              />
              <button
              onClick={() => openVideoPreview(posts, row.original.id)}
                className="text-blue-500 text-left"
              >
                View
              </button>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.VIDEO,
    },
    {
      accessorKey: "website",
      header: () => <TableHeader iconName="linkIcon" title="Website" />,
      cell: ({ row }) => {
        const website = row.original.website;
        return (
          <ExternalLink href={website} title={website}>
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
        const maplink = row.original.mapLink;
        const isApproved = status === ApprovalStatusEnum.APPROVED;
        const isDeclined = status === ApprovalStatusEnum.REJECTED;

        return (
          <div className="flex flex-col gap-y-2">
            <ExternalLink
              href={maplink ?? ""}
              title={`View ${content} on Google Maps`}
            >
              <span className="text-black truncate max-w-52">{content}</span>
            </ExternalLink>
            <ActionButtons
            actions={[
              {
                icon: <Check className="w-6 h-6" />,
                onClick: () => handleApprove(row.original.id, "address"),
                variant: "success",
                active: isApproved,
              },
              {
                icon: <X className="w-6 h-6" />,
                onClick: () => handleDecline(row.original.id, "address"),
                variant: "danger",
                active: isDeclined,
              },
            ]}
            className="w-64 h-9"
            />
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.ADDRESS,
    },
    {
      accessorKey: "menuUrl",
      header: () => <TableHeader iconName="linkIcon" title="Menu link" />,
      cell: ({ row }) => {
        const { content, status } = row.original.menu;
        const isApproved = status === ApprovalStatusEnum.APPROVED;
        const isDeclined = status === ApprovalStatusEnum.REJECTED;
        return (
          <div className="flex flex-col gap-y-2">
            <ExternalLink href={content} title={content}>
              <span className="text-black">View link</span>
            </ExternalLink>
            <ActionButtons
            actions={[
              {
                icon: <Check className="w-6 h-6" />,
                onClick: () => handleApprove(row.original.id, "menu"),
                variant: "success",
                active: isApproved,
              },
              {
                icon: <X className="w-6 h-6" />,
                onClick: () => handleDecline(row.original.id, "menu"),
                variant: "danger",
                active: isDeclined,
              },
            ]}
            className="w-64 h-9"
            />
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.MENU_LINK,
    },
    {
      accessorKey: "reservationUrl",
      header: () => <TableHeader iconName="linkIcon" title="Reservation link" />,
      cell: ({ row }) => {
        const { content, status } = row.original.reservation;
        const isApproved = status === ApprovalStatusEnum.APPROVED;
        const isDeclined = status === ApprovalStatusEnum.REJECTED;
        return (
          <div className="flex flex-col gap-y-2">
            <ExternalLink href={content} title={content}>
              <span className="text-black">View link</span>
            </ExternalLink>
            <ActionButtons
            actions={[
              {
                icon: <Check className="w-6 h-6" />,
                onClick: () => handleApprove(row.original.id, "reservation"),
                variant: "success",
                active: isApproved,
              },
              {
                icon: <X className="w-6 h-6" />,
                onClick: () => handleDecline(row.original.id, "reservation"),
                variant: "danger",
                active: isDeclined,
              },
            ]}
            className="w-64 h-9"
            />
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.RESERVATION_LINK,
    },
    {
      accessorKey: "addedBy",
      header: () => <TableHeader iconName="calendarIcon" title="Added by" />,
      cell: ({ row }) => {
        const { name, profileImage } = row.original.admin;

        return (
          <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
            <Image
              src={profileImage?.length > 0 ? profileImage : Logo.src}
              alt={name}
              width={40}
              height={40}
              onError={(e) => {
                e.currentTarget.src = Logo.src;
              }}
              className="rounded-full object-cover"
            />
            <span className="text-black font-medium">{name}</span>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.ADDED_BY,
    },
    {
      accessorKey: "dateAdded",
      header: () => <TableHeader iconName="calendarIcon" title="Date added" />,
      cell: ({ row }) => {
        const dateAdded = new Date(row.original?.createdAt);

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
        const { posts, address, menu, reservation } = row.original;
        const shouldSendFeedback =
          posts.some(
            (video) => video.status === ApprovalStatusEnum.REJECTED
          ) ||
          address.status === ApprovalStatusEnum.REJECTED ||
          menu.status === ApprovalStatusEnum.REJECTED ||
          reservation.status === ApprovalStatusEnum.REJECTED;

        const isPending = posts.some(
          (video: { status: string }) =>
            video.status === ApprovalStatusEnum.PENDING
        ) ||
          address.status === ApprovalStatusEnum.PENDING ||
          menu.status === ApprovalStatusEnum.PENDING ||
          reservation.status === ApprovalStatusEnum.PENDING

        return (
          <ActionButtons
            actions={[
              {
                label: shouldSendFeedback ? "Send Feedback" : "Save",
                onClick: () =>
                  shouldSendFeedback
                    ? handleSendFeedback(row.original, "Feedback")
                    : handleSaveRestaurant(row.original),
                variant: shouldSendFeedback ? "danger" : "primary",
                disabled: isPending
              },
            ]}
            className="w-42.5 h-12"
          />
        );
      },
      minSize: TABLE_COLUMN_SIZES.ACTIONS,
    },
  ];
