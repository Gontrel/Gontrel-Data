"use client";

import { ResubmitVideoStepStep } from "./ResubmitVideoStep";
import { EditRestaurantMenu } from "./ResubmitRestaurantMenu";
import Icon from "../svgs/Icons";
import { ProgressBar } from "../Loader/ProgressiveBar";
import { RestaurantData } from "@/types/restaurant";
import { RestaurantMenuFormData } from "@/interfaces";

interface EditPostContainerProps {
  restaurant: RestaurantData | null;
  isRestaurantFlow: boolean;
  title: string;
  step: number;
  description: string;
  isLoading: boolean;
  isUpdateMenuLoading: boolean;
  handleClose: () => void;
  handleResubmit?: () => void;
  onContinue: () => void;
  onNextVideoStep: () => void;
  onPreviousVideoStep: () => void;
  onSubmit: (data: RestaurantMenuFormData) => void;
  onPreviousRestaurantMenu: () => void;
}

export const EditPostContainer = ({
  title,
  description,
  isRestaurantFlow,
  restaurant,
  isUpdateMenuLoading,
  step,
  isLoading,
  handleClose,
  handleResubmit,
  onNextVideoStep,
  onPreviousVideoStep,
  onPreviousRestaurantMenu,
  onSubmit,
}: EditPostContainerProps) => {
  return (
    <div className="py-6 w-[518px] flex flex-col justify-between">
      <section className="">
        <div className="flex flex-row justify-between mb-7">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-[#2E3032] mb-2">{title}</h2>
            <p className=" text-[#2E3032] text-lg font-medium ">
              {description}
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
        <ProgressBar step={step} subTitle1={"Video"} subTitle2={"Links"} />
        <div className="w-full mt-[30px]">
          {restaurant ? (
            <>
              {step === 1 && (
                <ResubmitVideoStepStep
                  editFlow={true}
                  isRestaurantFlow={isRestaurantFlow}
                  restaurant={restaurant ?? []}
                  onPrevious={onPreviousVideoStep}
                  onNext={onNextVideoStep}
                  handleResubmit={handleResubmit}
                />
              )}
              {step === 3 && isRestaurantFlow ? (
                <EditRestaurantMenu
                  restaurant={restaurant ?? []}
                  isLoading={isLoading}
                  editFlow={true}
                  isUpdateMenuLoading={isUpdateMenuLoading}
                  onPrevious={onPreviousRestaurantMenu}
                  onSubmit={onSubmit}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
};
