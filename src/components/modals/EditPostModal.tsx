"use client";

import { useCallback, useEffect, useState } from "react";
import { RestaurantData } from "@/types/restaurant";
import { trpc } from "@/lib/trpc-client";
import { convertTimeTo24Hour, formatOpeningHours } from "@/lib/utils";
import { useVideoStore } from "@/stores/videoStore";
import { Sheet } from "@/components/modals/Sheet";
import { DayOfTheWeek } from "@/types";
import { UpdateLocationRequest } from "@/interfaces";
import { successToast, errorToast } from "@/utils/toast";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { EditPostContainer } from "./EditVideoContent";

interface EditVideoSheetProps {
  open: boolean;
  submissionId: string;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
}

export const EditVideo = ({
  submissionId,
  open,
  onOpenChange,
  title,
  description,
}: EditVideoSheetProps) => {
  const [step, setStep] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantData | null>(null);
  const [isOpenFeedback, setIsOpenFeedBack] = useState(false);
  const { setActiveVideoUrl, resetVideos } = useVideoStore();

  const { data: posts, isLoading } = trpc.post.getPostById.useQuery(
    { postId: submissionId },
    { enabled: !!submissionId && open }
  );

  const { mutate: updateAdminLocation, isPending: isLoactionLoading } =
    trpc.restaurant.updateRestaurant.useMutation({
      onSuccess: () => {
        successToast("Restaurant updated successfully!");
        handleClose();
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  useEffect(() => {
    const processRestaurant = async () => {
      if (posts) {
        try {
          const locationFromPost = posts?.location;
          const formattedHours = await formatOpeningHours(
            locationFromPost?.openingHours || []
          );

          const postData = {
            id: posts?.id ?? "",
            submissionId: posts?.submissionId ?? "",
            createdAt: posts?.createdAt ?? "",
            modifiedAt: posts?.modifiedAt ?? "",
            deletedAt: posts?.deletedAt ?? "",
            deletedBy: posts?.deletedBy ?? "",
            updatedBy: posts?.updatedBy ?? "",
            firebaseId: posts?.firebaseId ?? "",
            analytics: posts?.analytics,
            tiktokLink: posts?.tiktokLink || "",
            videoUrl: posts?.videoUrl || "",
            thumbUrl: posts?.thumbUrl || "",
            postedAt: posts?.postedAt || "",
            status: posts?.status || "pending",
            admin: posts?.admin,
            isFoodVisible: posts?.isFoodVisible,
            source: posts?.source || "gontrel",
            tags: posts?.tags || [],
          };

          const updatedRestaurant: RestaurantData = {
            id: locationFromPost?.id ?? "",
            name: locationFromPost?.name ?? "",
            image: locationFromPost?.photos?.[0] ?? "",
            address: locationFromPost?.address ?? "",
            website: locationFromPost?.website ?? "",
            workingHours: formattedHours,
            comment: locationFromPost?.comment ?? "",
            url: locationFromPost?.website ?? "",
            lat: locationFromPost?.lat,
            lng: locationFromPost?.lng,
            mapLink: locationFromPost?.mapLink ?? "",
            menu: locationFromPost?.menu?.content ?? "",
            modifiedAt: locationFromPost?.modifiedAt ?? "",
            createdAt: locationFromPost?.createdAt ?? "",
            photos: locationFromPost?.photos ?? [],
            posts: postData ? [postData] : [],
            priceLevel: locationFromPost?.priceLevel,
            rating: locationFromPost?.rating,
            reservation: locationFromPost?.reservation,
            status: locationFromPost?.status,
            country: locationFromPost?.country ?? "",
            toilets: locationFromPost?.toilets,
          };

          setSelectedRestaurant(updatedRestaurant);
        } catch {}
      } else {
        setSelectedRestaurant(null);
      }
    };

    processRestaurant();
  }, [posts, open]);

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

  const handleEditPost = (data: {
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
          if (
            hours[0].toLowerCase() === "24 hours" ||
            hours[0].toLowerCase() === "Open 24 hours"
          ) {
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
    // return <RestaurantConfirmationSkeleton />;
  }

  return (
    <Sheet
      open={open}
      onOpenChange={handleClose}
      width="w-[638px]"
      className="flex flex-row justify-center z-30"
    >
      <EditPostContainer
        title={title}
        description={description}
        restaurant={selectedRestaurant}
        step={step}
        isLoading={isLoading}
        isUpdateMenuLoading={isLoactionLoading}
        handleClose={handleClose}
        onContinue={() => setStep(2)}
        onNextVideoStep={() => setStep(3)}
        handleResubmit={handleResubmit}
        isRestaurantFlow={true}
        onPreviousVideoStep={() => setStep(2)}
        onPreviousRestaurantMenu={() => setStep(1)}
        onSubmit={(data) => handleEditPost(data)}
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
