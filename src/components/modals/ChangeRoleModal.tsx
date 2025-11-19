import React, { useState, useEffect } from "react";
import Icon from "../svgs/Icons";
import { Sheet } from "./Sheet";
import { Button } from "../ui/Button";
import FormSelectOption from "../inputs/FormInputOption";
import { trpc } from "@/lib/trpc-client";
import { errorToast, successToast } from "@/utils/toast";
import { AdminRoleEnum } from "@/types";
import Image from "next/image";

interface ChangeRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffId: string;
  staffName: string;
  staffRole: string;
  staffEmail: string;
  staffProfileImage?: string;
  onSuccess?: () => void;
}

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  open,
  onOpenChange,
  staffId,
  staffName,
  staffRole,
  staffEmail,
  staffProfileImage = "/images/avatar.png",
  onSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(staffRole);
  const [formError, setFormError] = useState<string>("");

  // Update selected role when staffRole prop changes
  useEffect(() => {
    setSelectedRole(staffRole);
  }, [staffRole]);

  const utils = trpc.useContext();

  const { mutate: changeRole, isPending: isLoading } =
    trpc.staffs.changeRole.useMutation({
      onSuccess: () => {
        successToast("Role changed successfully!");
        handleClose();
        // Invalidate and refetch staff profile
        utils.staffs.getStaffProfile.invalidate({ adminId: staffId });
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        errorToast(error.message || "Failed to change role");
        setFormError(error.message || "Failed to change role");
      },
    });

  const handleClose = () => {
    onOpenChange(false);
    setSelectedRole(staffRole);
    setFormError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole || selectedRole.trim() === "") {
      setFormError("Please select a role");
      errorToast("Please select a role");
      return;
    }

    if (selectedRole === staffRole) {
      setFormError("Please select a different role");
      errorToast("Please select a different role");
      return;
    }

    setFormError("");
    changeRole({
      adminId: staffId,
      role: selectedRole as AdminRoleEnum,
    });
  };

  const handleRoleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSelectedRole(e.target.value);
    setFormError("");
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      width="w-[638px]"
      className="flex flex-row justify-center z-30"
    >
      <div className="py-6 w-[518px] flex flex-col justify-between">
        <section className="">
          <div className="flex flex-row justify-between mb-7">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#2E3032] mb-2">
                Change role
              </h2>
              <p className="text-[#2E3032] text-lg font-medium">
                Change the role of this staff.
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

          {/* Staff Info Card */}
          <div className="bg-[#FAFAFA] rounded-[20px] p-4 mb-6 border border-[#F0F1F2]">
            <div className="flex items-center gap-4">
              <Image
                src={staffProfileImage}
                width={60}
                height={60}
                alt="Profile"
                className="w-[60px] h-[60px] rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-[#9DA1A5] leading-[100%] mb-1">
                  {staffId}
                </p>
                <h3 className="text-lg font-semibold text-[#2E3032] leading-[100%] mb-2">
                  {staffName}
                </h3>
                <div className="flex items-center gap-1 mb-1">
                  <Icon name="personIcon2" className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-[#9DA1A5] leading-[100%]">
                    {staffRole}
                  </p>
                </div>
                <p className="text-sm text-[#9DA1A5] leading-[100%]">
                  {staffEmail}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
              <FormSelectOption
                label="New staff role"
                name="role"
                value={selectedRole}
                options={Object.values(AdminRoleEnum)}
                onChange={handleRoleChange}
                error={formError}
                placeholder="Select a role"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || selectedRole === staffRole}
              className="w-full bg-[#0070F3] text-base font-semibold leading-[100%] text-white py-5 hover:bg-blue-700 rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </section>
      </div>
    </Sheet>
  );
};

export default ChangeRoleModal;

