"use client";

import { useState, useEffect, useRef } from "react";
import { Sheet } from "./Sheet";
import Icon from "../svgs/Icons";
import { Search } from "lucide-react";
import { RestaurantConfirmation } from "../restaurants/RestaurantConfirmation";
import { VideoStep } from "../restaurants/VideoStep";
import { RestaurantMenuWidget } from "../restaurants/RestaurantMenuWidget";
import { trpc } from "@/lib/trpc-client";
import { useDebounce } from "@/hooks/useDebounce";
import { useVideoStore } from "@/stores/videoStore";
import {
  convertTimeTo24Hour,
  formatTime,
  generateSessionToken,
} from "@/lib/utils";
import { ProgressBar } from "../Loader/ProgressiveBar";
import { errorToast, successToast } from "@/utils/toast";
import { TimeSlot } from "./EditWorkingHoursModal";
import { CreateLocationRequest } from "@/interfaces/requests";
import { DayOfTheWeek } from "@/types/enums";
import { RestaurantData } from "@/types/restaurant";

interface NewRestaurantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewRestaurantSheet = ({
  open,
  onOpenChange,
}: NewRestaurantSheetProps) => {
  const [step, setStep] = useState(1);
  const [inputValue, setInputValue] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isRestaurantConfirmed, setIsRestaurantConfirmed] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantData | null>(null);
  const [sessionToken, setSessionToken] = useState("");
  const { setActiveVideoUrl, resetVideos, addRestaurantData } = useVideoStore();

  const debouncedQuery = useDebounce(inputValue, 500);

  const { data: autoCompleteData, isFetching: isFetchingAutoComplete } =
    trpc.external.getPlaceAutocomplete.useQuery(
      { input: debouncedQuery, sessionToken },
      { enabled: debouncedQuery.trim() !== "" && !!sessionToken }
    );

  const { mutate: createAdminLocation, isPending: isLoading } =
    trpc.restaurant.createRestaurant.useMutation({
      onSuccess: () => {
        successToast("Restaurant created successfully!");
        handleClose();
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  const { data: placeDetailsData } = trpc.external.getPlaceDetails.useQuery(
    { placeId: selectedPlaceId!, sessionToken },
    { enabled: !!selectedPlaceId && !!sessionToken }
  );

  useEffect(() => {
    setSessionToken(generateSessionToken());

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (autoCompleteData && autoCompleteData.length > 0) {
      setSuggestions(autoCompleteData);
    } else {
      setSuggestions([]);
    }
  }, [autoCompleteData]);

  useEffect(() => {
    if (placeDetailsData) {
      const result = placeDetailsData;

      const workingHours: { [key: string]: string[] } = {};
      if (result.opening_hours?.weekday_text) {
        result.opening_hours.weekday_text.forEach((dayString: string) => {
          const [day, ...timeParts] = dayString.split(": ");
          workingHours[day] = timeParts.join(": ").split(", ");
        });
      }

      const photoReference = result?.photos?.[0]?.photo_reference;
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;

      const image =
        photoReference && apiKey
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`
          : "";

      const restaurant: RestaurantData = {
        placeId: result.place_id,
        name: result.name,
        address: result.formatted_address,
        image: image,
        rating: result.rating,
        workingHours: workingHours,
        website: result.website ?? "",
        url: result.url ?? "",
      };

      setIsRestaurantConfirmed(true);
      setSelectedRestaurant(restaurant);
      setSelectedPlaceId("");
    }
  }, [placeDetailsData]);

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
    setIsRestaurantConfirmed(false);
    setSelectedRestaurant(null);
    setInputValue("");
    setActiveVideoUrl(null);
    resetVideos();
  };

  const handleGoBackToSearch = () => {
    setIsRestaurantConfirmed(false);
    setSelectedRestaurant(null);
    setInputValue("");
    setStep(1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleWorkingHoursSave = (updatedHours: any) => {
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

    setSelectedRestaurant({
      ...selectedRestaurant,
      workingHours: newWorkingHours,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateRestaurant = (data: any) => {
    if (isLoading) return;

    if (!selectedRestaurant) return;

    const store = useVideoStore.getState();
    const currentVideos = store.getCurrentVideos();

    const payload: CreateLocationRequest = {
      sessionToken: sessionToken,
      placeId: selectedRestaurant.placeId,
      // Conditional address
      ...(selectedRestaurant.address && {
        address:
          typeof selectedRestaurant.address === "string"
            ? selectedRestaurant.address
            : selectedRestaurant.address.content,
      }),
      ...(data.menuUrl && { menu: data.menuUrl }),
      ...(selectedRestaurant.name && { name: selectedRestaurant.name }),
      ...(selectedRestaurant.image && { photos: [selectedRestaurant.image] }),
      rating: selectedRestaurant.rating ?? 0,
      ...(data.reservationUrl && { reservation: data.reservationUrl }),
      posts:
        currentVideos.map((video) => ({
          tiktokLink: video.url,
          videoUrl: video.videoUrl || "",
          thumbUrl: video.thumbUrl,
          locationName: selectedRestaurant.name,
          rating: 0,
          ...(video.tags && { tags: video.tags }),
        })) ?? [],
      openingHours: Object.entries(selectedRestaurant.workingHours ?? {}).map(
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

    createAdminLocation(payload);
  };

  const handleOnNext = () => {
    setStep(2);
    addRestaurantData(selectedRestaurant!);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={handleClose}
      width="w-[638px]"
      className="flex flex-row justify-center z-30"
    >
      <div className="py-6 w-[518px] flex flex-col justify-between">
        <section className="">
          <div className="flex flex-row justify-between mb-7">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#2E3032] mb-2">
                New Restaurant
              </h2>
              <p className=" text-[#2E3032] text-lg font-medium ">
                Create a new restuarant profile
              </p>
            </div>
            <button
              onClick={handleClose}
              title="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <Icon name="cancelModalIcon" className="w-6 h-6" />
            </button>
          </div>
          <ProgressBar
            step={step}
            subTitle1={"Confirmation"}
            subTitle2={"Video"}
            subTitle3={"Link"}
          />
          <div className="w-full mt-[30px]">
            {isRestaurantConfirmed && selectedRestaurant ? (
              <>
                {step === 1 && (
                  <RestaurantConfirmation
                    restaurant={selectedRestaurant}
                    onGoBackToSearch={handleGoBackToSearch}
                    onNext={() => handleOnNext()}
                    onWorkingHoursSave={handleWorkingHoursSave}
                  />
                )}
                {step === 2 && (
                  <VideoStep
                    onPrevious={() => setStep(1)}
                    onNext={() => setStep(3)}
                  />
                )}
                {step === 3 && (
                  <RestaurantMenuWidget
                    isLoading={isLoading}
                    onPrevious={() => setStep(2)}
                    onSubmit={(data) => handleCreateRestaurant(data)}
                  />
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="restaurant-name"
                    className="block text-[20px] font-semibold text-[#2E3032] mt-[30px]"
                  >
                    Restaurant name
                  </label>
                  <div className="relative mt-8" ref={searchContainerRef}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="restaurant-name"
                      placeholder="Search for a restaurant"
                      className="w-full pl-12 pr-[22px] py-[24px] border border-gray-300 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      autoComplete="off"
                    />
                    {isFetchingAutoComplete && (
                      <p className="mt-2 text-sm text-gray-500">Searching...</p>
                    )}
                    {showSuggestions &&
                      !isFetchingAutoComplete &&
                      debouncedQuery.length > 0 &&
                      suggestions.length === 0 && (
                        <div className="absolute z-10 w-full p-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                          <p className="text-sm text-gray-500">
                            No results found.
                          </p>
                        </div>
                      )}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <ul className="divide-y divide-gray-200">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {suggestions.map((suggestion: any) => (
                            <li
                              key={suggestion?.placeId}
                              className="p-4 cursor-pointer hover:bg-gray-50"
                              onClick={() => {
                                setInputValue(suggestion.description);
                                setShowSuggestions(false);
                                setSelectedPlaceId(suggestion?.placeId);
                              }}
                            >
                              <p className="font-semibold text-gray-800">
                                {suggestion?.structuredFormatting?.mainText}
                              </p>
                              <p className="text-sm text-gray-500">
                                {
                                  suggestion?.structuredFormatting
                                    ?.secondaryText
                                }
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Sheet>
  );
};
