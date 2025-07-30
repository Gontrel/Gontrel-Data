'use client';

import { useState } from 'react';
import Image from "next/image";
import { Globe, MapPin, ExternalLink } from "lucide-react";
import { EditWorkingHoursModal, WorkingHours } from "./EditWorkingHoursModal";

export type RestaurantData = {
  name: string;
  image: string;
  address: string;
  websiteUrl: string;
  addressUrl: string;
  workingHours: Record<string, string[]>;
};

export const mockRestaurant: RestaurantData = {
  name: "The Gilded Spatula",
  image:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
  address: "4C, Sons & Kings Str, Dub",
  websiteUrl: "https://example.com",
  addressUrl: "https://maps.google.com",
  workingHours: {
    Monday: ["8:00am - 12:00pm", "2:00pm - 9:00pm"],
    Tuesday: ["9:00am - 11:00pm"],
    Wednesday: ["9:00am - 12:00am"],
    Thursday: ["8:00am - 12:00pm", "2:00pm - 9:00pm"],
  },
};

interface RestaurantConfirmationProps {
  restaurant: RestaurantData;
  onGoBackToSearch: () => void;
  onNext: () => void;
}

const transformToModalHours = (hours: Record<string, string[]>): WorkingHours => {
  const days: (keyof WorkingHours)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const initialModalHours: any = {};

  const parseTime = (time: string) => {
    const [timePart, modifier] = time.split(/(am|pm)/i);
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier && modifier.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    }
    if (modifier && modifier.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  days.forEach(day => {
    const dayData = hours[day.charAt(0).toUpperCase() + day.slice(1)];
    if (dayData && dayData.length > 0) {
      initialModalHours[day] = {
        isOpen: true,
        isAllDay: false,
        slots: dayData.map(range => {
          const [start, end] = range.split(' - ');
          return { start: parseTime(start), end: parseTime(end) };
        }),
      };
    } else {
      initialModalHours[day] = {
        isOpen: false,
        isAllDay: false,
        slots: [{ start: '09:00', end: '17:00' }],
      };
    }
  });

  return initialModalHours as WorkingHours;
};

export const RestaurantConfirmation = ({
  restaurant,
  onGoBackToSearch,
  onNext,
}: RestaurantConfirmationProps) => {
  const [isEditHoursModalOpen, setIsEditHoursModalOpen] = useState(false);

  const handleSaveHours = (updatedHours: WorkingHours) => {
    // Here you would typically update the state in the parent component
    // or make an API call to save the changes.
    console.log("Saved working hours:", updatedHours);
    setIsEditHoursModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6 flex-grow">
        {/* Restaurant Info Card */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                <p className="text-gray-500">{restaurant.address}</p>
              </div>
            </div>
            <button
              onClick={onGoBackToSearch}
              className="text-red-500 font-medium text-sm"
            >
              Change
            </button>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <a
              href={restaurant.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium text-sm p-2 rounded-lg hover:bg-gray-100"
            >
              <Globe className="w-5 h-5" /> View website{" "}
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </a>
            <a
              href={restaurant.addressUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium text-sm p-2 rounded-lg hover:bg-gray-100"
            >
              <MapPin className="w-5 h-5" /> View address{" "}
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </a>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Working hours</h3>
            <button onClick={() => setIsEditHoursModalOpen(true)} className="text-blue-500 font-medium text-sm">Edit</button>
          </div>
          <div className="space-y-3">
            {Object.entries(restaurant.workingHours).map(([day, hours]) => (
              <div
                key={day}
                className="flex justify-between items-center bg-white p-3 rounded-lg"
              >
                <span className="capitalize font-medium text-gray-600">
                  {day}
                </span>
                <div className="text-right font-medium text-gray-800">
                  {hours.map((range, index) => (
                    <div key={index}>{range}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 pt-6">
        <button
          onClick={onNext}
          className="w-full bg-[#0070F3] text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>

      <EditWorkingHoursModal
        isOpen={isEditHoursModalOpen}
        onClose={() => setIsEditHoursModalOpen(false)}
        workingHours={transformToModalHours(restaurant.workingHours)}
        onSave={handleSaveHours}
      />
    </div>
  );
};
