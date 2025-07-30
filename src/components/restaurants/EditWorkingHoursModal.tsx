'use client';

import React, { useState } from 'react';
import { CenterModal } from '../ui/CenterModal';
import { Plus, Trash2 } from 'lucide-react';

/**
 * Working hours data structure
 */
export interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

/**
 * Day hours structure
 */
export interface DayHours {
  isOpen: boolean;
  isAllDay: boolean;
  slots: TimeSlot[];
}

/**
 * Time slot structure
 */
export interface TimeSlot {
  start: string;
  end: string;
}

/**
 * Props for EditWorkingHoursModal
 */
interface EditWorkingHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  workingHours: WorkingHours;
  onSave: (hours: WorkingHours) => void;
}

/**
 * Modal for editing restaurant working hours
 */
export const EditWorkingHoursModal = ({
  isOpen,
  onClose,
  workingHours,
  onSave
}: EditWorkingHoursModalProps) => {
  const [hours, setHours] = useState<WorkingHours>(workingHours);

  const days: (keyof WorkingHours)[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ];

  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  /**
   * Toggle day open/closed
   */
  const toggleDayOpen = (day: keyof WorkingHours) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen
      }
    }));
  };

  /**
   * Toggle all day (24hrs)
   */
  const toggleAllDay = (day: keyof WorkingHours) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAllDay: !prev[day].isAllDay
      }
    }));
  };

  /**
   * Update time slot
   */
  const updateTimeSlot = (
    day: keyof WorkingHours,
    slotIndex: number,
    field: 'start' | 'end',
    value: string
  ) => {
    setHours(prev => {
      const newSlots = [...prev[day].slots];
      newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        [field]: value
      };
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: newSlots
        }
      };
    });
  };

  /**
   * Add time slot
   */
  const addTimeSlot = (day: keyof WorkingHours) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: '09:00', end: '17:00' }]
      }
    }));
  };

  /**
   * Remove time slot
   */
  const removeTimeSlot = (day: keyof WorkingHours, slotIndex: number) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, index) => index !== slotIndex)
      }
    }));
  };

  /**
   * Handle save
   */
  const handleSave = () => {
    onSave(hours);
    onClose();
  };

  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit working hours"
      width="lg"
    >
      <div className="p-6">
        <div className="space-y-4">
          {days.map((day) => (
            <div key={day} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-gray-900 w-24">
                    {dayLabels[day]}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      hours[day].isOpen ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {hours[day].isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={hours[day].isOpen}
                    onChange={() => toggleDayOpen(day)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {hours[day].isOpen && (
                <div className="ml-28 space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={hours[day].isAllDay}
                      onChange={() => toggleAllDay(day)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    All day (24hrs)
                  </label>

                  {!hours[day].isAllDay && (
                    <div className="space-y-2">
                      {hours[day].slots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-500">To</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {hours[day].slots.length > 1 && (
                            <button
                              onClick={() => removeTimeSlot(day, index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              aria-label="Remove time slot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        onClick={() => addTimeSlot(day)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                        Add time slot
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </CenterModal>
  );
}