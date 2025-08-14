import { protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import APIRequest from "@/api/service";
import { AxiosError } from "axios";
import { fetchStaffsSchema, staffIdSchema } from "./schemas";
import { StaffTableTypes } from "@/types/user";
import { AdminRoleEnum } from "@/types/enums"; // Import AdminRoleEnum

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data && typeof data === "object" && "message" in data) {
      return (data as { message: string }).message;
    }
    if (typeof data === "string") {
      return data;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const staffsRouter = router({
  getStaffs: protectedProcedure
    .input(fetchStaffsSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        // In a real application, you would fetch staff data from your backend API
        // based on the `input` (e.g., pagination, search term, status).
        // For now, we'll return mock data.

        const mockStaffs: StaffTableTypes[] = [
          {
            id: "1",
            name: "Alice Smith",
            email: "alice.smith@example.com",
            role: AdminRoleEnum.ANALYST, // Corrected to use enum
            phone: "+1234567890",
            address: "123 Main St, Anytown, USA",
            status: "active",
          },
          {
            id: "2",
            name: "Bob Johnson",
            email: "bob.johnson@example.com",
            role: AdminRoleEnum.MANAGER, // Corrected to use enum
            phone: "+1987654321",
            address: "456 Oak Ave, Anytown, USA",
            status: "deactivated",
          },
          {
            id: "3",
            name: "Charlie Brown",
            email: "charlie.brown@example.com",
            role: AdminRoleEnum.ANALYST, // Corrected to use enum
            phone: "+1122334455",
            address: "789 Pine Ln, Anytown, USA",
            status: "active",
          },
          {
            id: "4",
            name: "Diana Prince",
            email: "diana.prince@example.com",
            role: AdminRoleEnum.MANAGER, // Corrected to use enum
            phone: "+1555666777",
            address: "101 Hero St, Anytown, USA",
            status: "active",
          },
          {
            id: "5",
            name: "Eve Adams",
            email: "eve.adams@example.com",
            role: AdminRoleEnum.ANALYST, // Corrected to use enum
            phone: "+1222333444",
            address: "202 Side Rd, Anytown, USA",
            status: "deactivated",
          },
        ];

        let filteredStaffs = mockStaffs;

        if (input.status) {
          filteredStaffs = filteredStaffs.filter(
            (staff) => staff.status === input.status
          );
        }

        if (input.query) {
          const searchTerm = input.query.toLowerCase();
          filteredStaffs = filteredStaffs.filter(
            (staff) =>
              staff.name.toLowerCase().includes(searchTerm) ||
              staff.email.toLowerCase().includes(searchTerm)
          );
        }

        const pageNumber = input.pageNumber || 1;
        const quantity = input.quantity || 10;
        const total = filteredStaffs.length;
        const totalPages = Math.ceil(total / quantity);
        const startIndex = (pageNumber - 1) * quantity;
        const endIndex = startIndex + quantity;

        const paginatedStaffs = filteredStaffs.slice(startIndex, endIndex);

        return {
          data: paginatedStaffs,
          pagination: {
            currentPage: pageNumber,
            pageSize: quantity,
            total,
            totalPages,
          },
        };
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  toggleStaffStatus: protectedProcedure
    .input(staffIdSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        // In a real application, you would call your backend API to toggle staff status
        console.log(`Toggling status for staff ID: ${input.staffId}`);
        return { success: true };
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),
});
