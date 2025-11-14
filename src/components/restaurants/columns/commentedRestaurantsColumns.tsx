import { ColumnDef } from "@tanstack/react-table";
import { SubmittedRestaurantTableTypes } from "@/types/restaurant";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { TableHeader } from "./utils";
import { formatDate } from "@/lib/utils";
import { ActionButtons } from "@/components/ui/ActionButtons";

export const createCommentedRestaurantsColumns = (
  handleView: (restaurantId: string) => void
): ColumnDef<SubmittedRestaurantTableTypes>[] => [
  {
    accessorKey: "name",
    header: () => <TableHeader title="Restaurant name" />,
    cell: ({ row }) => (
      <div className="font-medium text-[#181D1F] max-w-60 truncate">
        {row.original.name ?? ""}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.NAME,
    meta: { sticky: true },
  },
  {
    id: "totalVideos",
    header: () => <TableHeader title="Total videos" />,
    cell: ({ row }) => {
      const total = row.original.posts?.length ?? 0;
      return <span className="text-[#181D1F] font-medium">{total}</span>;
    },
    minSize: 140,
  },
  {
    accessorKey: "comment",
    header: () => <TableHeader title="Comment" />,
    cell: ({ row }) => (
      <div className="text-[#181D1F] max-w-80 truncate">
        {row.original.comment ?? ""}
      </div>
    ),
    minSize: 260,
  },
  {
    id: "dateCommented",
    header: () => <TableHeader title="Date commented" />,
    cell: ({ row }) => {
      const d = row.original.modifiedAt ? new Date(row.original.modifiedAt) : undefined;
      return (
        <span className="text-[#181D1F] font-medium">
          {d ? formatDate(d) : ""}
        </span>
      );
    },
    minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
  },
  {
    id: "action",
    header: () => <TableHeader title="Action" />,
    cell: ({ row }) => (
      <ActionButtons
        actions={[
          {
            label: "View",
            onClick: () => handleView(row.original.id),
            variant: "primary",
          },
        ]}
        className="w-32 h-12"
      />
    ),
    minSize: TABLE_COLUMN_SIZES.ACTIONS,
  },
];
