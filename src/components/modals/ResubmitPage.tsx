"use client";

import { ConfirmResubmitRestaurant } from "./ConfirmResubmitRestaurant";
import { ResubmitVideoStepStep } from "./ResubmitVideoStep";
import {ResubmitRestaurantMenu} from "./ResubmitRestaurantMenu";
import Icon from "../svgs/Icons";
import { ProgressBar } from "../Loader/ProgressiveBar";
import { RestaurantData } from "@/types/restaurant";
import { WorkingHours } from "./EditWorkingHoursModal";

interface ResubmitRestaurantSheetProps {
  restaurant: RestaurantData | null;
  isRestaurantFlow: boolean;
  title: string;
  step: number;
  description: string;
  isLoading: boolean;
  handleClose: () => void;
  handleResubmit?: () => void;
  onContinue: () => void;
  onNextVideoStep: () => void;
  onPreviousVideoStep: () => void;
  onGoBackToSearch: () => void;
  onSubmit: (data: { menuUrl: string; reservationUrl: string }) => void;
  onPreviousRestaurantMenu: () => void;
}

export const ResubmitPage = ({
  title,
  description,
  isRestaurantFlow,
  restaurant,
  step,
  isLoading,
  handleClose,
  handleResubmit,
  onContinue,
  onNextVideoStep,
  onPreviousVideoStep,
  onGoBackToSearch,
  onPreviousRestaurantMenu,
  onSubmit,
  onWorkingHoursSave,
}: ResubmitRestaurantSheetProps & {
  onWorkingHoursSave: (updatedHours: WorkingHours) => void;
}) => {
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
        <ProgressBar
          step={step}
          subTitle1={"Details"}
          subTitle2={"Video"}
          subTitle3={"Links"}
        />
        <div className="w-full mt-[30px]">
          {restaurant ? (
            <>
              {step === 1 && (
                <ConfirmResubmitRestaurant
                  restaurant={restaurant}
                  onGoBackToSearch={onGoBackToSearch}
                  onContinue={onContinue}
                  onWorkingHoursSave={onWorkingHoursSave}
                />
              )}
              {step === 2 && (
                <ResubmitVideoStepStep
                  isRestaurantFlow={isRestaurantFlow}
                  restaurant={restaurant ?? []}
                  onPrevious={onPreviousVideoStep}
                  onNext={onNextVideoStep}
                  handleResubmit={handleResubmit}
                />
              )}
              {step === 3 && isRestaurantFlow ? (
                <ResubmitRestaurantMenu
                  restaurant={restaurant ?? []}
                  isLoading={isLoading}
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
