"use client";

import { useCallback, useEffect, useState } from "react";
import { ResubmitPage } from "@/components/modals/ResubmitPage";
import { RestaurantData, TimeSlot } from "@/types/restaurant";
import { RestaurantConfirmationSkeleton } from "@/components/Loader/restaurants/RestaurantConfirmationSkeleton";
import { trpc } from "@/lib/trpc-client";
import {
  convertTimeTo24Hour,
  formatOpeningHours,
  formatTime,
} from "@/lib/utils";
import { useVideoStore } from "@/stores/videoStore";
import { Sheet } from "@/components/modals/Sheet";
import { DayOfTheWeek } from "@/types";
import { UpdateLocationRequest } from "@/interfaces";
import { successToast, errorToast } from "@/utils/toast";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

interface ResubmitVideoSheetProps {
  open: boolean;
  restaurantId: string;
  isRestaurantFlow: boolean;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
}

export const ResubmitVideo = ({
  restaurantId,
  open,
  onOpenChange,
  title,
  description,
}: ResubmitVideoSheetProps) => {
  const [step, setStep] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantData | null>(null);
  const [isOpenFeedback, setIsOpenFeedBack] = useState(false);
  const { setActiveVideoUrl, resetVideos } = useVideoStore();

  const { data: restaurant, isLoading } =
    trpc.restaurant.getRestaurantById.useQuery(
      { locationId: restaurantId },
      { enabled: !!restaurantId && open }
    );

  const { mutate: updateAdminLocation } =
    trpc.restaurant.updateRestaurant.useMutation({
      onSuccess: () => {
        successToast("Restaurant updated successfully!");
        setStep(2);
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  useEffect(() => {
    const processRestaurant = async () => {
      if (restaurant) {
        try {
          const formattedHours = await formatOpeningHours(
            restaurant.openingHours || []
          );
          const updatedRestaurant = {
            ...restaurant,
            workingHours: formattedHours,
          };

          setSelectedRestaurant(updatedRestaurant);
        } catch {}
      } else {
        setSelectedRestaurant(null);
      }
    };

    processRestaurant();
  }, [restaurant, open]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setStep(1);
    setSelectedRestaurant(null);
    setActiveVideoUrl(null);
    resetVideos();
  }, [onOpenChange, setActiveVideoUrl, resetVideos]);

  const handleGoBackToSearch = useCallback(() => {
    setSelectedRestaurant(null);
    setStep(1);
  }, []);

  const handleWorkingHoursSave = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updatedHours: any) => {
      if (!selectedRestaurant) return;

      const newWorkingHours: Record<string, string[]> = {};
      for (const day in updatedHours) {
        const dayData = updatedHours[day];
        const dayName = day.charAt(0).toUpperCase() + day.slice(1);

        if (dayData.isOpen) {
          if (dayData.isAllDay) {
            newWorkingHours[dayName] = ["24 hours"];
          } else {
            newWorkingHours[dayName] = dayData.slots?.map(
              (slot: TimeSlot) =>
                `${formatTime(slot.start)} – ${formatTime(slot.end)}`
            );
          }
        }
      }

      setSelectedRestaurant((prev) => ({
        ...prev!,
        workingHours: newWorkingHours,
      }));
    },
    [selectedRestaurant]
  );

  const handleSubmitRestaurant = (data: {
    menuUrl: string;
    reservationUrl: string;
  }) => {
    const payload: UpdateLocationRequest = {
      locationId: selectedRestaurant?.id ?? "",
      status: "pending",
      ...(selectedRestaurant?.address && {
        address:
          typeof selectedRestaurant.address === "string"
            ? selectedRestaurant.address
            : selectedRestaurant.address?.content,
      }),
      ...(data.menuUrl && { menu: data.menuUrl }),
      ...(data.reservationUrl && { reservation: data.reservationUrl }),
      ...(selectedRestaurant?.name && { name: selectedRestaurant.name }),
      openingHours: Object.entries(selectedRestaurant?.workingHours ?? {}).map(
        ([day, hours]) => {
          if (hours[0].toLowerCase() === "24 hours") {
            return {
              dayOfTheWeek: day?.toUpperCase() as DayOfTheWeek,
              opensAt: 0,
              closesAt: 24,
            };
          }
          if (hours[0].toLowerCase().trim() === "closed") {
            return {
              dayOfTheWeek: day?.toUpperCase() as DayOfTheWeek,
              opensAt: 0,
              closesAt: 0,
            };
          }
          const [startTime, endTime] = hours[0].split(" – ");
          return {
            dayOfTheWeek: day?.toUpperCase() as DayOfTheWeek,
            opensAt: convertTimeTo24Hour(startTime),
            closesAt: convertTimeTo24Hour(endTime),
          };
        }
      ),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateAdminLocation(payload as any);
  };

  const handleResubmit = () => {
    setIsOpenFeedBack(true);
  };

  const handleSuccessResubmit = () => {
    setIsOpenFeedBack(false);
    handleClose();
    successToast("Videos successfully uploaded");
  };

  const handleCancleResubmit = () => {
    setIsOpenFeedBack(false);
  };

  if (isLoading) {
    return <RestaurantConfirmationSkeleton />;
  }

  return (
    <Sheet
      open={open}
      onOpenChange={handleClose}
      width="w-[638px]"
      className="flex flex-row justify-center z-30"
    >
      <ResubmitPage
        title={title}
        description={description}
        restaurant={selectedRestaurant}
        step={step}
        isLoading={isLoading}
        handleClose={handleClose}
        onContinue={() => setStep(2)}
        onNextVideoStep={() => setStep(3)}
        handleResubmit={handleResubmit}
        isRestaurantFlow={false}
        onPreviousVideoStep={() => setStep(1)}
        onGoBackToSearch={handleGoBackToSearch}
        onPreviousRestaurantMenu={() => setStep(2)}
        onWorkingHoursSave={handleWorkingHoursSave}
        onSubmit={(data) => handleSubmitRestaurant(data)}
      />

      <ConfirmationModal
        isOpen={isOpenFeedback && open}
        onClose={handleCancleResubmit}
        title="Resubmit video?"
        description="Are you sure you want to resubmit this video?"
        comment={""}
        showCommentField={false}
        onCommentChange={handleGoBackToSearch}
        onConfirm={handleSuccessResubmit}
        confirmLabel="Resubmit video"
        successButtonClassName="w-full h-18 bg-[#0070F3] text-white rounded-[20px] transition-colors text-[20px] font-semibold"
      />
    </Sheet>
  );
};
