import React, { useState } from "react";
import Icon from "../svgs/Icons";
import { Sheet } from "./Sheet";
import { Button } from "../ui/Button";
import FormInput from "../inputs/FormInput";
import FormSelectOption from "../inputs/FormInputOption";
import { trpc } from "@/lib/trpc-client";
import { errorToast, successToast } from "@/utils/toast";

interface NewStaffSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStaffModal: React.FC<NewStaffSheetProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phoneNumber: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const { mutate: createAdmin, } =
    trpc.auth.createAdmin.useMutation({
      onSuccess: () => {
        successToast("Admin created successfully!");
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  const handleClose = () => {
    onOpenChange(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      phoneNumber: "",
      address: "",
      city: "",
      zipCode: "",
    });
    setFormErrors({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors: any = {};

    if (!formData.firstName) {
      errors.firstName = "First name is required";
      errorToast(errors.firstName);
    }
    if (!formData.lastName) {
      errors.lastName = "Last name is required";
      errorToast(errors.lastName);
    }
    if (!formData.email) {
      errors.email = "Email address is required";
      errorToast(errors.email);
    }
    if (!formData.role) {
      errors.role = "Role is required";
      errorToast(errors.role);
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    createAdmin(formData);
    handleClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setFormErrors((prev) => ({ ...prev, [name]: "" }));
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
                New staff
              </h2>
              <p className=" text-[#2E3032] text-lg font-medium ">
                Create a new staff profile
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
          <form onSubmit={handleSubmit} className="w-full mt-[30px] space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Staff last name"
                type="text"
                name="lastName"
                placeholder="Name here"
                value={formData?.lastName}
                onChange={handleChange}
                error={formErrors.lastName}
              />
              <FormInput
                label="Staff first name"
                type="text"
                name="firstName"
                placeholder="Name here"
                value={formData?.firstName}
                onChange={handleChange}
                error={formErrors.firstName}
              />
            </div>
            <FormInput
              label="Staff email address"
              type="text"
              name="email"
              placeholder="Email here"
              value={formData?.email}
              onChange={handleChange}
              error={formErrors.email}
            />
            <FormSelectOption
              label="Staff role"
              name="role"
              value={formData?.role}
              options={["Analyst", "Manager", "Developer"]}
              onChange={handleChange}
              error={formErrors.role}
            />

            <FormInput
              label="Staff phone number (optional)"
              type="tel"
              name="phoneNumber"
              placeholder="09098887655"
              value={formData?.phoneNumber}
              onChange={handleChange}
            />

            <FormInput
              label=" Staff address (optional)"
              name="address"
              type="text"
              value={formData?.address}
              placeholder="12 silver street"
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormSelectOption
                label="   City (optional)"
                name="city"
                value={formData?.city}
                options={["Lagos", "Delta", "Kano"]}
                onChange={handleChange}
              />

              <FormInput
                label="Zip code (optional)"
                type="text"
                name="zipCode"
                placeholder="Zip here"
                value={formData?.zipCode}
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#0070F3] text-base font-semibold leading-[100%] text-white py-5 px-5.5 mt-6 hover:bg-blue-700 rounded-3xl"
            >
              Submit
            </Button>
          </form>
        </section>
      </div>
    </Sheet>
  );
};

export default AddStaffModal;
