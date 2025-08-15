"use client";

import { Sheet } from "@/components/modals/Sheet";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

interface AddRestaurantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddRestaurantSheet = ({
  open,
  onOpenChange,
}: AddRestaurantSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right">
      <div className="p-6">
        <h2 className="text-2xl font-semibold">New restaurant</h2>
        <p className="text-gray-500 mb-6">Create a new restaurant profile</p>

        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full"
            style={{ width: "33%" }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mb-6">Confirmation</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Restaurant name</label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search for a restaurant" className="pl-10" />
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
};
