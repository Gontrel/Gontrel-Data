/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useCallback } from "react";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { SearchBar } from "@/components/admin/SearchBar";
import { FilterDropdowns } from "@/components/admin/FilterDropdowns";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/svgs/Icons";
import { GenericTable } from "@/components/tables/GenericTable";
import { formatDate } from "@/lib/utils";
import { type DateRangeValue } from "@/utils/dateRange";
import NewMessageSheet, {
  NewMessageFormState,
} from "@/components/messages/NewMessageSheet";
import ConfirmMessageModal from "@/components/messages/ConfirmMessageModal";
import MessageConfirmationModal from "@/components/messages/MessageConfirmationModal";
import { MessageRow, MessagesColumn } from "@/components/messages/column/MessagesColumn";
import { useGetNotifications, useCreateNotification } from "@/hooks/useNotifications";
import { NotificationTypeEnum } from "@/types";
import PreviewMessageModal from "@/components/messages/PreviewMessageModal";
import { successToast, errorToast } from "@/utils/toast";

// -----------------------------------------------------------------------------
// Local types (kept here to avoid creating new files; can be moved later)
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function MessagesPage() {
  // Fetch notifications via hook
  const createMessageColumns = useMemo(() => MessagesColumn, []);
  // Filters and pagination state modeled after Staffs
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationType, setNotificationType] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRangeValue | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // New message modal + preview
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [messageForm, setMessageForm] = useState<NewMessageFormState>({
    title: "",
    body: "",
    type: "In-App notification",
    platform: "iOS",
    schedule: "immediately",
    scheduledFor: undefined,
  });

  // Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageRow | null>(
    null
  );

  // Submit confirmation (centered) state
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const startDate = useMemo(() => (dateRange?.startDate ? new Date(dateRange.startDate).toISOString().slice(0, 10) : undefined), [dateRange?.startDate]);
  const endDate = useMemo(() => (dateRange?.endDate ? new Date(dateRange.endDate).toISOString().slice(0, 10) : undefined), [dateRange?.endDate]);

  const { queryData, isLoading } = useGetNotifications({
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
    notificationType,
  });

  const { handleCreateNotification, isLoading: isCreating,} = useCreateNotification();

  const updateMessageForm = useCallback(
    (patch: Partial<NewMessageFormState>) => {
      setMessageForm((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const tableData: MessageRow[] = useMemo(() => {
    const raw: any = queryData as any;
    const list = Array.isArray(raw) ? raw : raw?.data ?? [];
    return list.map((n: any) => ({
      id: n.id,
      title: n.title,
      preview: n.content,
      type: "In-App notification",
      platform: "iOS",
      date: n.createdAt,
    }));
  }, [queryData]);

  const totalPages = useMemo(() => {
    const raw: any = queryData as any;
    const total = (Array.isArray(raw) ? raw.length : raw?.pagination?.total) ?? 0;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [queryData, pageSize]);

  // Server-side pagination
  const paginatedData = tableData;

  const stats = useMemo(() => {
    const raw: any = queryData as any;
    const total = (Array.isArray(raw) ? raw.length : raw?.pagination?.total) ?? 0;
    return [
      { label: "Total messages sent", value: total },
      { label: "Total messages delivered", value: 0 },
    ];
  }, [queryData]);

  const columns = useMemo(
    () =>
      createMessageColumns((row) => {
        setSelectedMessage(row);
        setShowConfirm(true);
      }),
    [createMessageColumns]
  );

  // Map selectedStatus to NotificationTypeEnum
  const notificationTypeValue = useMemo(() => {
    if (notificationType === "push") return NotificationTypeEnum.PUSH_NOTIFICATION;
    if (notificationType === "in_app") return NotificationTypeEnum.IN_APP_NOTIFICATION;
    return ""
  }, [notificationType]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback(
    (range: DateRangeValue | undefined) => {
      setDateRange(range);
      setCurrentPage(1);
    },
    []
  );

  const handleStatusChange = useCallback((status: string | undefined) => {
    setNotificationType(status);
    setCurrentPage(1);
  }, []);

  const handleNewMessage = useCallback(() => {
    setShowNewMessage(true);
  }, []);

  const handleCloseNewMessage = useCallback((open: boolean) => {
    setShowNewMessage(open);
  }, []);

  const handleSubmitNewMessage = useCallback(() => {
    // Open centered confirmation preview before sending
    setShowSubmitConfirm(true);
  }, []);

  const handleConfirmSend = useCallback(async () => {
    try {
      // Map messageForm to CreateNotificationRequest
      const typeString =
        messageForm.type === "Push notification"
          ? "push"
          : messageForm.type === "In-App notification"
          ? "in_app"
          : messageForm.type === "Email"
          ? "email"
          : "push";

      const notificationTypeEnum =
        typeString === "in_app"
          ? NotificationTypeEnum.IN_APP_NOTIFICATION
          : NotificationTypeEnum.PUSH_NOTIFICATION;

      await handleCreateNotification({
        all: true,
        title: messageForm.title || "",
        message: messageForm.body || "",
        notificationType: notificationTypeEnum,
      });

      successToast("Message sent successfully");
      setShowSubmitConfirm(false);
      setShowNewMessage(false);
    } catch  {
      errorToast("Failed to send message. Please try again.");
    }
  }, [handleCreateNotification, messageForm.title, messageForm.body, messageForm.type]);

  const handleCancelConfirm = useCallback(() => {
    // Close only the centered confirmation; keep the sheet open for edits
    setShowSubmitConfirm(false);
  }, []);

  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">
        {/* Header Stats */}
        <StatsGrid className="lg:grid-cols-2" stats={stats} loading={false} />

        {/* Action Row: search + filters + new button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4.5">
          <div className="flex-1 gap-4.5 flex flex-row justify-between w-full">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search using name or ID"
            />
            <div className="flex items-center gap-4.5">
              {/* Message type filter placeholder */}
              <FilterDropdowns
                activeTab="messages"
                selectedStatus={notificationTypeValue}
                onStatusChange={handleStatusChange}
                selectedDateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </div>

          <div className="flex items-center w-full sm:w-auto">
            <Button
              onClick={handleNewMessage}
              className="bg-[#0070F3] text-white px-[12px] py-[16px] rounded-[10px] gap-2"
            >
              <Icon name="plusIcon" className="h-5 w-5 text-gray-500" />
              <span> New message</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <GenericTable<MessageRow>
          data={paginatedData}
          loading={isLoading}
          showSelection={false}
          columns={columns}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageSizeChange={(size) => setPageSize(size)}
          onPageChange={(pageIndex) => setCurrentPage(pageIndex + 1)}
        />
      </div>

      {/* New Message Sheet + Preview Modal (open together) */}

      <PreviewMessageModal
        open={showNewMessage}
        onOpenChange={handleCloseNewMessage}
        title={messageForm.title}
        body={messageForm.body}
        platform={messageForm.platform}
        type={messageForm.type}
      />
      
      <NewMessageSheet
        open={showNewMessage}
        onOpenChange={handleCloseNewMessage}
        value={messageForm}
        onChange={updateMessageForm}
        onSubmit={handleSubmitNewMessage}
      />

      {/* Confirmation modal */}
      <MessageConfirmationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={selectedMessage?.title || ""}
        body={selectedMessage?.preview || ""}
        type={selectedMessage?.type || ""}
        platform={selectedMessage?.platform || ""}
        dateISO={selectedMessage?.date}
        onSendAgain={() => {
          setShowConfirm(false);
          if (selectedMessage) {
            setMessageForm({
              title: selectedMessage.title,
              body: selectedMessage.preview,
              type: selectedMessage.type,
              platform: selectedMessage.platform,
              schedule: "immediately",
              scheduledFor: undefined,
            });
          }
          setShowNewMessage(true);
        }}
        onDelete={() => setShowConfirm(false)}
      />

      {/* Centered submit confirmation (opens from NewMessage submit) */}
      <ConfirmMessageModal
        open={showSubmitConfirm}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmSend}
        title={messageForm.title}
        body={messageForm.body}
        type={messageForm.type}
        platform={messageForm.platform}
        loading={isCreating}
        scheduleLabel={
          messageForm.schedule === "scheduled" && messageForm.scheduledFor
            ? formatDate(new Date(messageForm.scheduledFor))
            : undefined
        }
      />
    </div>
  );
}
