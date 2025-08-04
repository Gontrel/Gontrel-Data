import { UserCircle, LogOut } from "lucide-react";
import Icon from "../svgs/Icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CenterModal } from "@/components/ui/CenterModal";
import { trpc } from "@/lib/trpc-client";
import Button from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

export const UserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { mutate: logoutMutation, isSuccess } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      console.error("Failed to sign out:", error);
    },
  });

  const handleSignOut = () => {
    logoutMutation();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 p-1 rounded-full cursor-pointer hover:bg-gray-100">
            <UserCircle size={24} />
            <Icon name="arrowdownIcon" className="w-4 h-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CenterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Sign Out"
      >
        <div className="p-4">
          <p className="mb-6 text-center">Are you sure you want to sign out?</p>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              No
            </button>
            <button
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isSuccess
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={handleSignOut}
              disabled={isSuccess}
            >
              {isSuccess ? "Signing Out..." : "Yes, Sign Out"}
            </button>
          </div>
        </div>
      </CenterModal>
    </>
  );
};
