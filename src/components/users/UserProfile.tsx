import { UserCircle, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CenterModal } from "@/components/ui/CenterModal";
import { trpc } from "@/lib/trpc-client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/DropdownMenu";
import { useAuthStore, useCurrentUser } from "@/stores/authStore";
import { Button } from "../ui/Button";

export const UserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuthStore();
  const user = useCurrentUser();
  const router = useRouter();

  const { mutate: logoutMutation, isSuccess } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      router.push("/");
    },
    onError: () => {},
  });

  const handleSignOut = () => {
    logoutMutation();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white border border-gray-200 hover:shadow-sm cursor-pointer">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name ?? "User"}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircle size={20} className="text-gray-500" />
              </div>
            )}
            <ChevronDown size={16} className="text-gray-700" />
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
            <Button
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              No
            </Button>
            <Button
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isSuccess
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={handleSignOut}
              disabled={isSuccess}
            >
              {isSuccess ? "Signing Out..." : "Yes, Sign Out"}
            </Button>
          </div>
        </div>
      </CenterModal>
    </>
  );
};
