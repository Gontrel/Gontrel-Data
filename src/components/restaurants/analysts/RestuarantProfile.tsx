// "use client";

// import { useState, useEffect, useRef } from "react";
// import { trpc } from "@/lib/trpc-client";
// import { useDebounce } from "@/hooks/useDebounce";
// import { RestaurantData, useVideoStore } from "@/stores/videoStore";
// import { convertTimeTo24Hour, formatTime } from "@/lib/utils";
// import { errorToast, successToast } from "@/utils/toast";
// import { Sheet } from "@/components/modals/Sheet";
// import { ProgressBar } from "@/components/progressiveLoader/ProgressiveBar";
// import Icon from "@/components/svgs/Icons";
// import { RestaurantConfirmation } from "../RestaurantConfirmation";
// import { VideoStep } from "../VideoStep";
// import RestaurantMenuWidget from "../RestaurantMenuWidget";

// interface NewRestaurantSheetProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export const RestuarantProfile = ({ open, onOpenChange }: NewRestaurantSheetProps) => {
//   const [step, setStep] = useState(1);
//   const [inputValue, setInputValue] = useState("");
//   const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
//   const searchContainerRef = useRef<HTMLDivElement>(null);
//   const [selectedRestaurant, setSelectedRestaurant] =
//     useState<RestaurantData | null>(null);
//   const [sessionToken, setSessionToken] = useState("");
//   const { videos, setActiveVideoUrl, resetVideos, addRestaurantData } =
//     useVideoStore();

//   const debouncedQuery = useDebounce(inputValue, 500);

//   const { data: autoCompleteData, isFetching: isFetchingAutoComplete } =
//     trpc.restaurants.placeAutoComplete.useQuery(
//       { query: debouncedQuery, sessionToken },
//       { enabled: debouncedQuery.trim() !== "" && !!sessionToken }
//     );

//   const { mutate: createAdminLocation, isPending: isLoading } =
//     trpc.restaurants.createAdminLocation.useMutation({
//       onSuccess: () => {
//         successToast("Restaurant created successfully!");
//         handleClose();
//       },
//       onError: (error) => {
//         errorToast(error.message);
//       },
//     });


//   const handleClose = () => {
//     onOpenChange(false);
//     setStep(1);
//     setSelectedRestaurant(null);
//     setInputValue("");
//     setActiveVideoUrl(null);
//     resetVideos();
//   };

//   const handleGoBackToSearch = () => {
//     setSelectedRestaurant(null);
//     setInputValue("");
//     setStep(1);
//   };

//   const handleWorkingHoursSave = (updatedHours: any) => {
//     if (!selectedRestaurant) return;

//     const newWorkingHours: Record<string, string[]> = {};
//     for (const day in updatedHours) {
//       const dayData = updatedHours[day];
//       const dayName = day.charAt(0).toUpperCase() + day.slice(1);

//       if (dayData.isOpen) {
//         if (dayData.isAllDay) {
//           newWorkingHours[dayName] = ["24 hours"];
//         } else {
//           newWorkingHours[dayName] = dayData.slots?.map(
//             (slot: any) =>
//               `${formatTime(slot?.start)} - ${formatTime(slot?.end)}`
//           );
//         }
//       }
//     }

//     setSelectedRestaurant({
//       ...selectedRestaurant,
//       workingHours: newWorkingHours,
//     });
//   };

//   const handleCreateRestaurant = (data: any) => {
//     if (isLoading) return;

//     if (!selectedRestaurant) return;

//     const payload = {
//       sessionToken: sessionToken,
//       placeId: selectedRestaurant.placeId,
//       address: selectedRestaurant.address,
//       menu: data.menuUrl ? data.menuUrl : "",
//       name: selectedRestaurant.name,
//       photos: selectedRestaurant.imageUrl
//         ? [selectedRestaurant.imageUrl]
//         : ["https://example.com/photo1.jpg"],
//       rating: selectedRestaurant.rating ?? 0,
//       reservation: data.reservationUrl ? data.reservationUrl : "",
//       type: "RESTAURANT" as const,
//       website: selectedRestaurant.websiteUrl
//         ? selectedRestaurant.websiteUrl
//         : "https://example.com",
//       isVerified: false,
//       posts:
//         videos.map((video) => ({
//           isVerified: false,
//           tiktokLink: video.url,
//           videoUrl: video.videoUrl,
//           thumbUrl: video.thumbUrl,
//           locationName: selectedRestaurant.name,
//           rating: 0,
//           tags: video.tags ? video.tags : [],
//         })) ?? [],
//       openingHours: Object.entries(selectedRestaurant.workingHours)?.map(
//         ([day, hours]) => {
//           // Handle "24 hours" case
//           if (hours[0].toLowerCase() === "24 hours") {
//             return {
//               dayOfTheWeek: day.toUpperCase() as any,
//               opensAt: 0, // Represents 00:00 (midnight)
//               closesAt: 24, // Represents 24:00 (end of day)
//             };
//           }

//           const [startTime, endTime] = hours[0].split(" - ");
//           return {
//             dayOfTheWeek: day.toUpperCase() as any,
//             opensAt: convertTimeTo24Hour(startTime),
//             closesAt: convertTimeTo24Hour(endTime),
//           };
//         }
//       ),
//     };

//     createAdminLocation(payload as any);
//   };

//   const handleOnNext = () => {
//     setStep(2);
//     addRestaurantData(selectedRestaurant!);
//   };

//   return (
//     <Sheet
//       open={open}
//       onOpenChange={handleClose}
//       width="w-[638px]"
//       className="flex flex-row justify-center z-30"
//     >
//       <div className="py-6 w-[518px] flex flex-col justify-between">
//         <section className="">
//           <div className="flex flex-row justify-between mb-7">
//             <div className="text-left">
//               <h2 className="text-2xl font-bold text-[#2E3032] mb-2">
//                 Resubmit restaurant details
//               </h2>
//               <p className=" text-[#2E3032] text-lg font-medium ">
//                 Some of the details you submitted were rejected
//               </p>
//             </div>

//             <button
//               onClick={handleClose}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <Icon name="cancelModalIcon" className="w-6 h-6" />
//             </button>
//           </div>

//           <ProgressBar
//             step={step}
//             subTitle1={"Details"}
//             subTitle2={"Video"}
//             subTitle3={"Link"}
//           />

//           <div className="w-full h-full mt-[30px]">
//             <>
//               {step === 1 && (
//                 <RestaurantConfirmation
//                   restaurant={selectedRestaurant}
//                   onGoBackToSearch={handleGoBackToSearch}
//                   onNext={() => handleOnNext()}
//                   onWorkingHoursSave={handleWorkingHoursSave}
//                 />
//               )}
//               {step === 2 && (
//                 <VideoStep
//                   onPrevious={() => setStep(1)}
//                   onNext={() => setStep(3)}
//                 />
//               )}
//               {step === 3 && (
//                 <RestaurantMenuWidget
//                   isLoading={isLoading}
//                   onPrevious={() => setStep(2)}
//                   onSubmit={(data) => handleCreateRestaurant(data)}
//                 />
//               )}
//             </>
//           </div>
//         </section>
//       </div>
//     </Sheet>
//   );
// };
