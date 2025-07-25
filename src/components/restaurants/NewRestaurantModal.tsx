// 'use client';

// import React, { useState, useCallback, useEffect } from 'react';
// import { SideModal } from '../ui/SideModal';
// import {
//   Search,
//   MapPin,
//   Globe,
//   X,
//   Plus,
//   ChevronLeft,
//   Tag
// } from 'lucide-react';
// import { EditWorkingHoursModal, WorkingHours, DayHours } from './EditWorkingHoursModal';
// import { Input } from '../ui/Input';
// import { Button } from '../ui/Button';

// /**
//  * Step type for modal flow
//  */
// type Step = 'search' | 'details' | 'video';

// /**
//  * Restaurant data for creation
//  */
// interface NewRestaurantData {
//   name: string;
//   address: string;
//   website?: string;
//   menuUrl?: string;
//   reservationUrl?: string;
//   workingHours: WorkingHours;
//   tiktokUrl?: string;
//   tags: string[];
//   videoFile?: File;
// }

// /**
//  * Props for NewRestaurantModal
//  */
// interface NewRestaurantModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: NewRestaurantData) => void;
// }

// /**
//  * Restaurant search result
//  */
// interface RestaurantSearchResult {
//   id: string;
//   name: string;
//   address: string;
// }

// /**
//  * Default working hours
//  */
// const defaultWorkingHours: WorkingHours = {
//   monday: { isOpen: true, isAllDay: false, slots: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '21:00' }] },
//   tuesday: { isOpen: true, isAllDay: false, slots: [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '21:00' }] },
//   wednesday: { isOpen: true, isAllDay: true, slots: [] },
//   thursday: { isOpen: false, isAllDay: false, slots: [] },
//   friday: { isOpen: true, isAllDay: false, slots: [{ start: '07:00', end: '21:00' }] },
//   saturday: { isOpen: true, isAllDay: false, slots: [{ start: '09:00', end: '17:00' }] },
//   sunday: { isOpen: true, isAllDay: true, slots: [] }
// };

// /**
//  * Modal for creating new restaurants
//  */
// export function NewRestaurantModal({
//   isOpen,
//   onClose,
//   onSubmit
// }: NewRestaurantModalProps) {
//   const [step, setStep] = useState<Step>('search');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<RestaurantSearchResult[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [showWorkingHoursModal, setShowWorkingHoursModal] = useState(false);
//   const [tagInput, setTagInput] = useState('');
//   const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
//   const [showTagSuggestions, setShowTagSuggestions] = useState(false);

//   const [restaurantData, setRestaurantData] = useState<NewRestaurantData>({
//     name: '',
//     address: '',
//     website: '',
//     menuUrl: '',
//     reservationUrl: '',
//     workingHours: defaultWorkingHours,
//     tiktokUrl: '',
//     tags: [],
//     videoFile: undefined
//   });

//   /**
//    * Search for restaurants
//    */
//   const searchRestaurants = useCallback(async (query: string) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     setIsSearching(true);
//     try {
//       // TODO: Replace with actual API call
//       // const response = await fetch(`/api/restaurants/search?q=${encodeURIComponent(query)}`);
//       // const data = await response.json();
//       // setSearchResults(data.results);

//       // Mock results for now
//       setSearchResults([
//         { id: '1', name: 'The Gilded Spatula', address: '4C, Sons & Kings Str, Dub' },
//         { id: '2', name: 'Whisk & Wildflower', address: '4C, Sons & Kings Str, Dub' }
//       ]);
//     } catch (error) {
//       console.error('Search error:', error);
//     } finally {
//       setIsSearching(false);
//     }
//   }, []);

//   /**
//    * Search for tags
//    */
//   const searchTags = useCallback(async (query: string) => {
//     if (!query.trim()) {
//       setTagSuggestions([]);
//       return;
//     }

//     try {
//       // TODO: Replace with actual API call
//       // const response = await fetch(`/api/tags/search?q=${encodeURIComponent(query)}`);
//       // const data = await response.json();
//       // setTagSuggestions(data.results);

//       // Mock suggestions for now
//       setTagSuggestions(['Funny', 'Comedy', 'Learn', 'Explore', 'Food', 'Restaurant']);
//     } catch (error) {
//       console.error('Tag search error:', error);
//     }
//   }, []);

//   /**
//    * Handle search input change
//    */
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       searchRestaurants(searchQuery);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery, searchRestaurants]);

//   /**
//    * Handle tag input change
//    */
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       searchTags(tagInput);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [tagInput, searchTags]);

//   /**
//    * Format working hours for display
//    */
//   const formatWorkingHours = (dayHours: DayHours): string => {
//     if (!dayHours.isOpen) return 'Closed';
//     if (dayHours.isAllDay) return 'Open 24hrs';

//     return dayHours.slots
//       .map(slot => `${slot.start} - ${slot.end}`)
//       .join(', ');
//   };

//   /**
//    * Handle restaurant selection
//    */
//   const handleSelectRestaurant = (restaurant: RestaurantSearchResult) => {
//     setRestaurantData(prev => ({
//       ...prev,
//       name: restaurant.name,
//       address: restaurant.address
//     }));
//     setStep('details');
//   };

//   /**
//    * Handle creating new restaurant
//    */
//   const handleCreateNew = () => {
//     setStep('details');
//   };

//   /**
//    * Handle tag addition
//    */
//   const handleAddTag = (tag: string) => {
//     if (tag && !restaurantData.tags.includes(tag)) {
//       setRestaurantData(prev => ({
//         ...prev,
//         tags: [...prev.tags, tag]
//       }));
//     }
//     setTagInput('');
//     setShowTagSuggestions(false);
//   };

//   /**
//    * Handle tag removal
//    */
//   const handleRemoveTag = (tag: string) => {
//     setRestaurantData(prev => ({
//       ...prev,
//       tags: prev.tags.filter(t => t !== tag)
//     }));
//   };

//   /**
//    * Handle video file selection
//    */
//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setRestaurantData(prev => ({
//         ...prev,
//         videoFile: file
//       }));
//     }
//   };

//   /**
//    * Handle form submission
//    */
//   const handleSubmit = () => {
//     onSubmit(restaurantData);
//     onClose();
//   };

//   /**
//    * Reset modal state
//    */
//   useEffect(() => {
//     if (!isOpen) {
//       setStep('search');
//       setSearchQuery('');
//       setSearchResults([]);
//       setRestaurantData({
//         name: '',
//         address: '',
//         website: '',
//         menuUrl: '',
//         reservationUrl: '',
//         workingHours: defaultWorkingHours,
//         tiktokUrl: '',
//         tags: [],
//         videoFile: undefined
//       });
//     }
//   }, [isOpen]);

//   return (
//     <>
//       <SideModal
//         isOpen={isOpen}
//         onClose={onClose}
//         title={step === 'search' ? 'New restaurant' : step === 'details' ? 'New restaurant' : 'New post'}
//         width="xl"
//         showCloseButton={false}
//       >
//         <div className="h-full flex flex-col">
//           {/* Header */}
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 {step !== 'search' && (
//                   <button
//                     onClick={() => setStep(step === 'video' ? 'details' : 'search')}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                 )}
//                 <h2 className="text-xl font-semibold">
//                   {step === 'search' ? 'New restaurant' : step === 'details' ? 'Create a new restaurant profile' : 'Create a new post'}
//                 </h2>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-y-auto">
//             {/* Search Step */}
//             {step === 'search' && (
//               <div className="p-6">
//                 <h3 className="text-lg font-medium mb-4">Restaurant name</h3>
//                 <div className="relative mb-6">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <Input
//                     type="text"
//                     placeholder="Search for a restaurant"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>

//                 {isSearching ? (
//                   <div className="text-center py-8 text-gray-500">Searching...</div>
//                 ) : searchResults.length > 0 ? (
//                   <div className="space-y-3">
//                     {searchResults.map((restaurant) => (
//                       <button
//                         key={restaurant.id}
//                         onClick={() => handleSelectRestaurant(restaurant)}
//                         className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
//                       >
//                         <div className="font-medium">{restaurant.name}</div>
//                         <div className="text-sm text-gray-500">{restaurant.address}</div>
//                       </button>
//                     ))}
//                   </div>
//                 ) : searchQuery && (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500 mb-4">No restaurants found</p>
//                     <Button onClick={handleCreateNew}>
//                       Create new restaurant
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Details Step */}
//             {step === 'details' && (
//               <div className="p-6">
//                 {/* Restaurant Name */}
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-2">
//                     <label className="text-sm font-medium text-gray-700">Restaurant name</label>
//                     <button
//                       className="text-sm text-blue-600 hover:text-blue-700"
//                       onClick={() => setStep('search')}
//                     >
//                       Change
//                     </button>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-start gap-3">
//                       <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
//                       <div>
//                         <div className="font-medium">{restaurantData.name || 'The Gilded Spatula'}</div>
//                         <div className="text-sm text-gray-500">{restaurantData.address || '4C, Sons & Kings Str, Dub'}</div>
//                       </div>
//                     </div>
//                     <div className="flex gap-4 mt-3 text-sm">
//                       <a href="#" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
//                         <Globe className="w-4 h-4" />
//                         Website
//                       </a>
//                       <a href="#" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
//                         <MapPin className="w-4 h-4" />
//                         View address
//                       </a>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Working Hours */}
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <label className="text-sm font-medium text-gray-700">Working hours</label>
//                     <button
//                       onClick={() => setShowWorkingHoursModal(true)}
//                       className="text-sm text-blue-600 hover:text-blue-700"
//                     >
//                       Edit
//                     </button>
//                   </div>

//                   {/* Scrollable working hours section */}
//                   <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
//                     <div className="divide-y divide-gray-200">
//                       {Object.entries(restaurantData.workingHours).map(([day, hours]) => (
//                         <div key={day} className="px-4 py-3 flex justify-between items-center">
//                           <span className="text-sm font-medium capitalize">{day}</span>
//                           <span className="text-sm text-gray-600">
//                             {formatWorkingHours(hours)}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* TikTok URL */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     TikTok URL
//                   </label>
//                   <Input
//                     type="url"
//                     placeholder="https://example.com"
//                     value={restaurantData.tiktokUrl}
//                     onChange={(e) => setRestaurantData(prev => ({ ...prev, tiktokUrl: e.target.value }))}
//                   />
//                 </div>

//                 {/* Restaurant Menu */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Restaurant menu
//                   </label>
//                   <Input
//                     type="url"
//                     placeholder="https://example.com"
//                     value={restaurantData.menuUrl}
//                     onChange={(e) => setRestaurantData(prev => ({ ...prev, menuUrl: e.target.value }))}
//                   />
//                 </div>

//                 {/* Reservation Link */}
//                 <div className="mb-8">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Reservation Link
//                   </label>
//                   <Input
//                     type="url"
//                     placeholder="https://example.com"
//                     value={restaurantData.reservationUrl}
//                     onChange={(e) => setRestaurantData(prev => ({ ...prev, reservationUrl: e.target.value }))}
//                   />
//                 </div>

//                 {/* Next Button */}
//                 <Button
//                   onClick={() => setStep('video')}
//                   className="w-full"
//                   size="lg"
//                 >
//                   Next
//                 </Button>
//               </div>
//             )}

//             {/* Video Step */}
//             {step === 'video' && (
//               <div className="p-6">
//                 {/* Video Preview */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-medium mb-4">Video preview</h3>
//                   <div className="bg-gray-100 rounded-lg aspect-[9/16] max-w-sm mx-auto flex items-center justify-center">
//                     {restaurantData.videoFile ? (
//                       <video
//                         src={URL.createObjectURL(restaurantData.videoFile)}
//                         className="w-full h-full object-cover rounded-lg"
//                         controls
//                       />
//                     ) : (
//                       <div className="text-center">
//                         <input
//                           type="file"
//                           accept="video/*"
//                           onChange={handleVideoChange}
//                           className="hidden"
//                           id="video-upload"
//                         />
//                         <label
//                           htmlFor="video-upload"
//                           className="cursor-pointer text-gray-500 hover:text-gray-700"
//                         >
//                           <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Plus className="w-8 h-8" />
//                           </div>
//                           <p>Upload video</p>
//                         </label>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* TikTok Link */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     TikTok link
//                   </label>
//                   <Input
//                     type="url"
//                     placeholder="https://tiktok.com/@username/video/123"
//                     value={restaurantData.tiktokUrl}
//                     onChange={(e) => setRestaurantData(prev => ({ ...prev, tiktokUrl: e.target.value }))}
//                   />
//                 </div>

//                 {/* Tags */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Tags
//                   </label>
//                   <div className="relative">
//                     <Input
//                       type="text"
//                       placeholder="Type a tag and press enter"
//                       value={tagInput}
//                       onChange={(e) => setTagInput(e.target.value)}
//                       onFocus={() => setShowTagSuggestions(true)}
//                       onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault();
//                           handleAddTag(tagInput);
//                         }
//                       }}
//                     />

//                     {/* Tag suggestions */}
//                     {showTagSuggestions && tagSuggestions.length > 0 && (
//                       <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
//                         {tagSuggestions.map((tag) => (
//                           <button
//                             key={tag}
//                             onClick={() => handleAddTag(tag)}
//                             className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
//                           >
//                             {tag}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Selected tags */}
//                   {restaurantData.tags.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mt-3">
//                       {restaurantData.tags.map((tag) => (
//                         <span
//                           key={tag}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
//                         >
//                           <Tag className="w-3 h-3" />
//                           {tag}
//                           <button
//                             onClick={() => handleRemoveTag(tag)}
//                             className="ml-1 hover:text-blue-900"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 <Button
//                   onClick={handleSubmit}
//                   className="w-full"
//                   size="lg"
//                 >
//                   Submit
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </SideModal>

//       {/* Edit Working Hours Modal */}
//       <EditWorkingHoursModal
//         isOpen={showWorkingHoursModal}
//         onClose={() => setShowWorkingHoursModal(false)}
//         workingHours={restaurantData.workingHours}
//         onSave={(hours) => {
//           setRestaurantData(prev => ({ ...prev, workingHours: hours }));
//           setShowWorkingHoursModal(false);
//         }}
//       />
//     </>
//   );
// }