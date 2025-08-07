"use client";

import { useCallback, useEffect, useState } from "react";
import { ResubmitPage } from "@/components/modals/ResubmitPage";
import { RestaurantData, TimeSlot } from "@/types/restaurant";
import { RestaurantConfirmationSkeleton } from "@/components/Loader/restaurants/RestaurantConfirmationSkeleton";
import { trpc } from "@/lib/trpc-client";
import { formatOpeningHours, formatTime } from "@/lib/utils";
import { useVideoStore } from "@/stores/videoStore";
import { Sheet } from "@/components/modals/Sheet";

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
  isRestaurantFlow,
}: ResubmitVideoSheetProps) => {
  const [step, setStep] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantData | null>(null);
  const { setActiveVideoUrl, resetVideos, addRestaurantData } = useVideoStore();

  const { data: restaurant, isLoading } =
    trpc.restaurant.getRestaurantById.useQuery(
      { locationId: restaurantId },
      { enabled: !!restaurantId && open }
    );

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
          addRestaurantData(updatedRestaurant);
          console.log("Processed restaurant:", updatedRestaurant);
        } catch (error) {
          console.error("Error formatting hours:", error);
        }
      } else {
        setSelectedRestaurant(null);
      }
    };

    processRestaurant();
  }, [restaurant, addRestaurantData]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateRestaurant = (data: any) => {};

  const handleOnNext = () => {
    setStep(2);
    addRestaurantData(selectedRestaurant!);
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
        handleOnSubmitConfirmResubmitRestaurant={handleOnNext}
        onNextVideoStep={() => setStep(3)}
        isRestaurantFlow={isRestaurantFlow}
        onPreviousVideoStep={() => setStep(1)}
        onGoBackToSearch={handleGoBackToSearch}
        onPreviousRestaurantMenu={() => setStep(2)}
        onWorkingHoursSave={handleWorkingHoursSave}
        onSubmit={(data) => handleCreateRestaurant(data)}
      />
    </Sheet>
  );
};
