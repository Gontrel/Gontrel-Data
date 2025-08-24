"use client";

import { useCallback, useEffect, useState } from "react";
import { ResubmitPage } from "@/components/modals/ResubmitPage";
import { RestaurantData, TimeSlot } from "@/types/restaurant";
import { RestaurantConfirmationSkeleton } from "@/components/Loader/restaurants/RestaurantConfirmationSkeleton";
import { trpc } from "@/lib/trpc-client";
import {
  formatOpeningHours,
  formatTime,
  processGoogleHours,
} from "@/lib/utils";
import { useVideoStore } from "@/stores/videoStore";
import { Sheet } from "@/components/modals/Sheet";
import { successToast, errorToast } from "@/utils/toast";
import { UpdateLocationRequest } from "@/interfaces/requests";

interface ResubmitRestaurantSheetProps {
  open: boolean;
  restaurantId: string;
  isRestaurantFlow: boolean;
  onPostSubmitted: () => void;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
}

export const ResubmitRestaurant = ({
  restaurantId,
  open,
  onOpenChange,
  onPostSubmitted,
  title,
  description,
}: ResubmitRestaurantSheetProps) => {
  const [step, setStep] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantData | null>(null);
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
        onPostSubmitted();
        handleClose();
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
    resetVideos();
    setActiveVideoUrl(null);
    setSelectedRestaurant(null);
  }, [onOpenChange, resetVideos, setActiveVideoUrl]);

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
                `${formatTime(slot.start)} - ${formatTime(slot.end)}`
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
    const availability = processGoogleHours(
      selectedRestaurant?.workingHours ?? {}
    );

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
      openingHours: availability,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateAdminLocation(payload as any);
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
        isRestaurantFlow={true}
        onPreviousVideoStep={() => setStep(1)}
        onGoBackToSearch={handleGoBackToSearch}
        onPreviousRestaurantMenu={() => setStep(2)}
        onWorkingHoursSave={handleWorkingHoursSave}
        onSubmit={(data) => handleSubmitRestaurant(data)}
      />
    </Sheet>
  );
};
