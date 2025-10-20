"use client";

import React, { useCallback, useState } from "react";
import { Sheet } from "../modals/Sheet";
import Icon from "../svgs/Icons";
import { Button } from "../ui/Button";
import { ProgressBarTwoSteps } from "../Loader/ProgressiveBar";

export type CompetitionType = "Referral program" | "Leaderboard" | "Custom";

export interface NewCompetitionForm {
  title: string;
  description: string;
  type: CompetitionType;
  eligibleWinners: number;
  eligibleQualifiers: number;
  startDate?: string; 
  endDate?: string; 
  condition: string; 
  aggregationOp: "Equals" | "Greater than" | "Less than";
  aggregationValue?: number;
}

interface NewCompetitionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewCompetitionForm) => void;
}

const defaultForm: NewCompetitionForm = {
  title: "",
  description: "",
  type: "Referral program",
  eligibleWinners: 1,
  eligibleQualifiers: 1,
  startDate: "",
  endDate: "",
  condition: "Referral",
  aggregationOp: "Equals",
  aggregationValue: 1,
};

export const NewCompetitionSheet: React.FC<NewCompetitionSheetProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<NewCompetitionForm>(defaultForm);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setStep(1);
    setForm(defaultForm);
  }, [onOpenChange]);

  const handleNext = useCallback(() => setStep(2), []);
  const handlePrev = useCallback(() => setStep(1), []);

  const handleCreate = useCallback(() => {
    onSubmit(form);
    handleClose();
  }, [form, onSubmit, handleClose]);

  return (
    <Sheet
      open={open}
      onOpenChange={handleClose}
      width="w-[638px]"
      className="flex flex-row justify-center z-50"
    >
      <div className="py-6 w-[518px] flex flex-col justify-between">
        <section>
          <div className="flex flex-row justify-between mb-7">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#2E3032] mb-2">
                New competition
              </h2>
            </div>
            <button
              onClick={handleClose}
              title="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <Icon name="cancelModalIcon" className="w-6 h-6" />
            </button>
          </div>

          {/* Progress bar header */}
          <ProgressBarTwoSteps
            step={step}
            subTitle1={"Competition details"}
            subTitle2={"Competition conditions"}
          />

          <div className="w-full mt-[30px] space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                     {/* Title */}
                <div>
                  <label className="block text-[20px] font-semibold text-[#2E3032]">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter competition title"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        title: e.target.value,
                      }))
                    }
                    className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  />
                </div>
                {/* Type */}
                <div>
                  <label className="block text-[20px] font-semibold text-[#2E3032]">
                    Competition type
                  </label>
                  <select
                    className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        type: e.target.value as CompetitionType,
                      }))
                    }
                  >
                    <option value="referral">Referral program</option>
      
                  </select>
                </div>

                {/* Winners / Qualifiers */}
                <div>
                  <label className="block text-[20px] font-semibold text-[#2E3032]">
                    Eligible winners
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.eligibleWinners}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        eligibleWinners: Number(e.target.value),
                      }))
                    }
                    className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  />
                </div>

                <div>
                  <label className="block text-[20px] font-semibold text-[#2E3032]">
                    Eligible qualifiers
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.eligibleQualifiers}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        eligibleQualifiers: Number(e.target.value),
                      }))
                    }
                    className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  />
                </div>

                {/* Dates */}
                <div>
                  <label className="block text-[20px] font-semibold text-[#2E3032]">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={form.startDate || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, startDate: e.target.value }))
                    }
                    className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  />
                </div>
                <div>
                  <label className="block text-[20px] font-semibold text-[#2E3032]">
                    End date
                  </label>
                  <input
                    type="date"
                    value={form.endDate || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, endDate: e.target.value }))
                    }
                    className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Condition */}
                <div>
                  <label className="block text-[20px] font-semibold text-[#2E3032]">
                    Condition
                  </label>
                  <input
                    type="text"
                    placeholder="Referral"
                    value={form.condition}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, condition: e.target.value }))
                    }
                    className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  />
                </div>

                {/* Aggregation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[20px] font-semibold text-[#2E3032]">
                      Aggregation
                    </label>
                    <select
                      className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                      value={form.aggregationOp}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          aggregationOp: e.target
                            .value as NewCompetitionForm["aggregationOp"],
                        }))
                      }
                    >
                      <option>Equals</option>
                      <option>Greater than</option>
                      <option>Less than</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[20px] font-semibold text-[#2E3032]">
                      &nbsp;
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.aggregationValue ?? 0}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          aggregationValue: Number(e.target.value),
                        }))
                      }
                      className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-between gap-3">
          {step === 2 ? (
            <>
              <Button
                onClick={handlePrev}
                className="flex-1 bg-[#E9EBEE] text-[#2E3032] py-[16px] rounded-[14px]"
              >
                Previous
              </Button>
              <Button
                onClick={handleCreate}
                className="flex-1 bg-[#0070F3] text-white py-[16px] rounded-[14px]"
              >
                Create competition
              </Button>
            </>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full bg-[#0070F3] text-white py-[16px] rounded-[14px]"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </Sheet>
  );
};

export default NewCompetitionSheet;
