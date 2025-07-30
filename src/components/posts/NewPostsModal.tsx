"use client";

import { useState } from "react";
import { Sheet } from "../modals/Sheet";
import Icon from "../svgs/Icons";
import { VideoStep } from "../restaurants/VideoStep";

interface NewPostsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewPostSheet = ({
  open,
  onOpenChange,
}: NewPostsSheetProps) => {
  const [step, setStep] = useState(1);
  const [isRestaurantConfirmed, setIsRestaurantConfirmed] = useState(false);

  const handleSearchForRestaurant = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsRestaurantConfirmed(true);
    }
  };

  const handleGoBackToSearch = () => {
    setIsRestaurantConfirmed(false);
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
        className="p-8 flex flex-col"
      >
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">New Post</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
            aria-label="Close"
          >
            <Icon name="cancelModalIcon" />
          </button>
        </div>
        <p className="text-gray-500 mt-1">Create a new post</p>

        <VideoStep onNext={handleNextStep} onPrevious={handlePreviousStep} />
      </div>

    </Sheet>
  );
};
