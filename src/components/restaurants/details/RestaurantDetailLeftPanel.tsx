"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditableLinkField } from "./EditableLinkField";
import { ApprovalStatusEnum } from "@/types/enums";
import { formatRestaurantTime } from "@/lib/utils";
import { Location, Address, Menu, Reservation, OrderLink } from "@/interfaces/restaurants";
import { Admin } from "@/interfaces/user";

interface LinkFieldState {
  value: string;
  status: ApprovalStatusEnum;
  originalValue: string;
  originalStatus: ApprovalStatusEnum;
}

export interface LeftPanelFieldData {
  address: { content: string; status: ApprovalStatusEnum };
  website: string;
  menu: { content: string; status: ApprovalStatusEnum };
  orderLink: { content: string; status: ApprovalStatusEnum };
  reservation: { content: string; status: ApprovalStatusEnum };
}

interface RestaurantDetailLeftPanelProps {
  restaurant: Location & { admin?: Admin };
  onFieldsChange: (data: LeftPanelFieldData, hasChanges: boolean) => void;
  onDeleteClick: () => void;
  isSaving?: boolean;
  deleteButtonLabel?: string;
}

const getContent = (field: string | Address | Menu | Reservation | OrderLink | null | undefined): string => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field.content || "";
};

const getStatus = (field: string | Address | Menu | Reservation | OrderLink | null | undefined): ApprovalStatusEnum => {
  if (!field) return ApprovalStatusEnum.PENDING;
  if (typeof field === "string") return ApprovalStatusEnum.APPROVED;
  return field.status || ApprovalStatusEnum.PENDING;
};

export const RestaurantDetailLeftPanel = ({
  restaurant,
  onFieldsChange,
  onDeleteClick,
  isSaving = false,
  deleteButtonLabel = "Delete Restaurant",
}: RestaurantDetailLeftPanelProps) => {
  const router = useRouter();

  const [addressField, setAddressField] = useState<LinkFieldState>({
    value: getContent(restaurant.address),
    status: getStatus(restaurant.address),
    originalValue: getContent(restaurant.address),
    originalStatus: getStatus(restaurant.address),
  });

  const [websiteField, setWebsiteField] = useState<LinkFieldState>({
    value: restaurant.website || "",
    status: ApprovalStatusEnum.APPROVED,
    originalValue: restaurant.website || "",
    originalStatus: ApprovalStatusEnum.APPROVED,
  });

  const [menuField, setMenuField] = useState<LinkFieldState>({
    value: getContent(restaurant.menu),
    status: getStatus(restaurant.menu),
    originalValue: getContent(restaurant.menu),
    originalStatus: getStatus(restaurant.menu),
  });

  const [orderLinkField, setOrderLinkField] = useState<LinkFieldState>({
    value: getContent(restaurant.orderLink),
    status: getStatus(restaurant.orderLink),
    originalValue: getContent(restaurant.orderLink),
    originalStatus: getStatus(restaurant.orderLink),
  });

  const [reservationField, setReservationField] = useState<LinkFieldState>({
    value: getContent(restaurant.reservation),
    status: getStatus(restaurant.reservation),
    originalValue: getContent(restaurant.reservation),
    originalStatus: getStatus(restaurant.reservation),
  });

  useEffect(() => {
    setAddressField({
      value: getContent(restaurant.address),
      status: getStatus(restaurant.address),
      originalValue: getContent(restaurant.address),
      originalStatus: getStatus(restaurant.address),
    });
    setWebsiteField({
      value: restaurant.website || "",
      status: ApprovalStatusEnum.APPROVED,
      originalValue: restaurant.website || "",
      originalStatus: ApprovalStatusEnum.APPROVED,
    });
    setMenuField({
      value: getContent(restaurant.menu),
      status: getStatus(restaurant.menu),
      originalValue: getContent(restaurant.menu),
      originalStatus: getStatus(restaurant.menu),
    });
    setOrderLinkField({
      value: getContent(restaurant.orderLink),
      status: getStatus(restaurant.orderLink),
      originalValue: getContent(restaurant.orderLink),
      originalStatus: getStatus(restaurant.orderLink),
    });
    setReservationField({
      value: getContent(restaurant.reservation),
      status: getStatus(restaurant.reservation),
      originalValue: getContent(restaurant.reservation),
      originalStatus: getStatus(restaurant.reservation),
    });
  }, [restaurant]);

  const hasChanges =
    addressField.value !== addressField.originalValue ||
    addressField.status !== addressField.originalStatus ||
    websiteField.value !== websiteField.originalValue ||
    menuField.value !== menuField.originalValue ||
    menuField.status !== menuField.originalStatus ||
    orderLinkField.value !== orderLinkField.originalValue ||
    orderLinkField.status !== orderLinkField.originalStatus ||
    reservationField.value !== reservationField.originalValue ||
    reservationField.status !== reservationField.originalStatus;

  useEffect(() => {
    onFieldsChange(
      {
        address: { content: addressField.value, status: addressField.status },
        website: websiteField.value,
        menu: { content: menuField.value, status: menuField.status },
        orderLink: { content: orderLinkField.value, status: orderLinkField.status },
        reservation: { content: reservationField.value, status: reservationField.status },
      },
      hasChanges
    );
  }, [addressField, websiteField, menuField, orderLinkField, reservationField, hasChanges, onFieldsChange]);

  const formatOpeningHours = () => {
    if (!restaurant.openingHours || restaurant.openingHours.length === 0) {
      return "Not available";
    }
    const today = restaurant.openingHours[0];
    if (!today) return "Not available";

    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
    };

    return `${formatTime(today.opensAt)} - ${formatTime(today.closesAt)}`;
  };

  const formatOpeningTime = (minutes: number | undefined, isPM = false) => {
    if (minutes === undefined) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const displayHours = isPM ? (hours % 12 || 12) : hours;
    const period = isPM ? "PM" : "AM";
    return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm flex flex-col h-full">
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 text-[#2E3032] hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="space-y-0.5 text-sm text-[#6D7378]">
          <p>Created by: <span className="text-[#2E3032]">{restaurant.admin?.name || "Unknown"}</span></p>
          <p>Created on {formatRestaurantTime(restaurant.createdAt)}</p>
          <p>Approved on {formatRestaurantTime(restaurant.approvalDate || "")}</p>
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-4">
          <EditableLinkField
            label="Address"
            iconName="mapPinIcon"
            value={addressField.value}
            status={addressField.status}
            originalValue={addressField.originalValue}
            originalStatus={addressField.originalStatus}
            onChange={(value) => setAddressField((prev) => ({ ...prev, value }))}
            onStatusChange={(status) => setAddressField((prev) => ({ ...prev, status }))}
            placeholder="Enter address..."
          />

          <EditableLinkField
            label="Website"
            iconName="worldIcon"
            value={websiteField.value}
            status={websiteField.status}
            originalValue={websiteField.originalValue}
            originalStatus={websiteField.originalStatus}
            onChange={(value) => setWebsiteField((prev) => ({ ...prev, value }))}
            onStatusChange={(status) => setWebsiteField((prev) => ({ ...prev, status }))}
            placeholder="Enter website URL..."
          />

          <EditableLinkField
            label="Menu Link"
            iconName="menuIcon"
            value={menuField.value}
            status={menuField.status}
            originalValue={menuField.originalValue}
            originalStatus={menuField.originalStatus}
            onChange={(value) => setMenuField((prev) => ({ ...prev, value }))}
            onStatusChange={(status) => setMenuField((prev) => ({ ...prev, status }))}
            placeholder="Enter menu URL..."
          />

          <EditableLinkField
            label="Order Link"
            iconName="linkIcon"
            value={orderLinkField.value}
            status={orderLinkField.status}
            originalValue={orderLinkField.originalValue}
            originalStatus={orderLinkField.originalStatus}
            onChange={(value) => setOrderLinkField((prev) => ({ ...prev, value }))}
            onStatusChange={(status) => setOrderLinkField((prev) => ({ ...prev, status }))}
            placeholder="Enter order URL..."
          />

          <EditableLinkField
            label="Reservation Link"
            iconName="restaurantReversationIcon"
            value={reservationField.value}
            status={reservationField.status}
            originalValue={reservationField.originalValue}
            originalStatus={reservationField.originalStatus}
            onChange={(value) => setReservationField((prev) => ({ ...prev, value }))}
            onStatusChange={(status) => setReservationField((prev) => ({ ...prev, status }))}
            placeholder="Enter reservation URL..."
          />

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-[#2E3032]">Opening Hours</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">From</label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  {formatOpeningTime(restaurant.openingHours?.[0]?.opensAt, false)}
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">To</label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  {formatOpeningTime(restaurant.openingHours?.[0]?.closesAt, true)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onDeleteClick}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          <X className="w-5 h-5" />
          {deleteButtonLabel}
        </button>
      </div>
    </div>
  );
};
