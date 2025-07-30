"use client";

import { useState } from "react";
import { Sheet } from "../modals/Sheet";
import Icon from "../svgs/Icons";
import { Search } from "lucide-react";
import {
  RestaurantConfirmation,
  RestaurantData,
  mockRestaurant,
} from "./RestaurantConfirmation";
import { VideoStep } from "./VideoStep";

interface NewRestaurantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProgressBar = ({ step }: { step: number }) => (
  <div className="flex items-center space-x-2 my-6">
    <div
      className={`h-1.5 flex-1 rounded-full ${
        step >= 1
          ? "bg-gradient-to-r from-[#AF08FD] to-[#0070F3]"
          : "bg-gray-200"
      }`}
    ></div>
    <div
      className={`h-1.5 flex-1 rounded-full ${
        step >= 2
          ? "bg-gradient-to-r from-[#AF08FD] to-[#0070F3]"
          : "bg-gray-200"
      }`}
    ></div>
    <div
      className={`h-1.5 flex-1 rounded-full ${
        step >= 3
          ? "bg-gradient-to-r from-[#AF08FD] to-[#0070F3]"
          : "bg-gray-200"
      }`}
    ></div>
  </div>
);

export const NewRestaurantSheet = ({
  open,
  onOpenChange,
}: NewRestaurantSheetProps) => {
  const [step, setStep] = useState(1);
  const [isRestaurantConfirmed, setIsRestaurantConfirmed] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantData | null>(null);

  const handleSearchForRestaurant = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setSelectedRestaurant(mockRestaurant);
      setIsRestaurantConfirmed(true);
    }
  };

  const handleGoBackToSearch = () => {
    setIsRestaurantConfirmed(false);
    setSelectedRestaurant(null);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width="w-[638px]"
      className="flex flex-col justify-center"
    >
      <section className="flex flex-col h-full justify-center px-[42px]">
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">New restaurant</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
              aria-label="Close"
            >
              <Icon name="cancelModalIcon" />
            </button>
          </div>
          <p className="text-gray-500 mt-1">Create a new restaurant profile</p>
          <ProgressBar step={step} />
          <p className="text-sm font-medium text-gray-600 mb-4">
            {step === 1 && "Confirmation"}
            {step === 2 && "Videos"}
            {step === 3 && "Confirmation"}
          </p>
        </div>

        <div className="flex-grow overflow-y-auto ">
          {step === 1 && (
            <>
              {isRestaurantConfirmed && selectedRestaurant ? (
                <RestaurantConfirmation
                  restaurant={selectedRestaurant}
                  onGoBackToSearch={handleGoBackToSearch}
                  onNext={handleNextStep}
                />
              ) : (
                <div>
                  <label
                    htmlFor="restaurant-name"
                    className="text-lg font-semibold"
                  >
                    Restaurant name
                  </label>
                  <div className="relative mt-3">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="restaurant-name"
                      placeholder="Search for a restaurant"
                      className="w-full pl-12 pr-[22px] py-[24px] border border-gray-300 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                      onKeyDown={handleSearchForRestaurant}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              {
                <VideoStep
                  onNext={handleNextStep}
                  onPrevious={handlePreviousStep}
                />
              }
            </>
          )}

          {step === 3 && (
            <div className="flex items-center justify-center h-full">
              <p>Final Step!</p>
            </div>
          )}
        </div>
      </section>
    </Sheet>
  );
};
