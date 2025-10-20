"use client";

import React, {
  use,
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import { type DateRangeValue } from "@/utils/dateRange";
import {
  useUserDetails,
  useUserPostsByUser,
  useUserLocationVisits,
} from "@/hooks/useUserHook";
import UserProfileCard from "@/components/users/UserProfileCard";
import UserSummaryCard from "@/components/users/UserSummaryCard";
import { LivePostCard } from "@/components/restaurants/LivePostCard";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import UserActionsHeader from "@/components/users/UserActionsHeader";
import { trpc } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";
import type { Post } from "@/interfaces/posts";
import { Restaurant } from "@/interfaces";
import StaffDetailsSkeleton from "@/components/Loader/staffs/staffDetails";
import { UserDetailsTabsEnum } from "@/types";

const UserDetailsPage = ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = use(params);
  const [activeTab, setActiveTab] = useState<UserDetailsTabsEnum>(
    UserDetailsTabsEnum.VIDEOS
  );
  const [dateRange, setDateRange] = useState<DateRangeValue | undefined>(
    undefined
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize = 10;
  const {
    user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useUserDetails(userId);
  const router = useRouter();
  const postsHook = useUserPostsByUser(userId, {
    pageNumber,
    quantity: pageSize,
    dateRange,
  });
  const visits = useUserLocationVisits(userId, {
    pageNumber,
    quantity: pageSize,
    dateRange,
  });

  const videosCount = postsHook.total;
  const restaurantsCount = visits.total;

  const TabButton = ({
    tab,
    label,
    count,
  }: {
    tab: UserDetailsTabsEnum;
    label: string;
    count: number;
  }) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`text-lg py-3 px-2.5 whitespace-nowrap border-b-4 ${
        activeTab === tab
          ? "text-blue-500 border-blue-500 font-semibold"
          : "text-gray-300 border-transparent font-medium"
      }`}
    >
      {label} ({count})
    </button>
  );

  type PostItem = {
    id: string;
    postedAt?: string;
    location?: Restaurant;
    thumbUrl?: string;
    videoUrl?: string;
    locationName?: string;
  };
  type VisitItem = {
    id: string;
    location: Restaurant;
  };
  const list = useMemo(() => {
    if (activeTab === UserDetailsTabsEnum.VIDEOS)
      return postsHook.items as PostItem[];
    return visits.items as VisitItem[];
  }, [activeTab, postsHook.items, visits.items]);

  // Infinite scroll setup for Videos tab
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useContext();

  const fetchUserPosts = useCallback(
    async (pageNo: number) => {
      if (!userId) return;
      setIsFetching(true);
      try {
        const res = await utils.user.getUserPostsByUser.fetch({
          userId,
          pageNumber: pageNo,
          quantity: pageSize,
          startDate: dateRange?.startDate?.toISOString().split("T")[0],
          endDate: dateRange?.endDate?.toISOString().split("T")[0],
        });
        const newPosts: Post[] = res?.data ?? [];
        if (newPosts.length === 0) {
          setHasMore(false);
          if (pageNo === 1) setUserPosts([]);
        } else {
          setUserPosts((prev) => {
            if (pageNo === 1) return newPosts;
            const ids = new Set(prev.map((p) => p.id));
            const merged = [...prev, ...newPosts.filter((p) => !ids.has(p.id))];
            return merged;
          });
        }
        setInitialLoadComplete(true);
      } finally {
        setIsFetching(false);
      }
    },
    [userId, pageSize, dateRange, utils]
  );

  // Trigger fetch when userId/dateRange changes or tab switches to videos
  useEffect(() => {
    if (!userId) return;
    if (activeTab !== UserDetailsTabsEnum.VIDEOS) return;
    setPageNumber(1);
    setHasMore(true);
    setUserPosts([]);
    fetchUserPosts(1);
  }, [userId, dateRange, activeTab, fetchUserPosts]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (activeTab !== UserDetailsTabsEnum.VIDEOS) return;
    if (!scrollContainerRef.current || isFetching || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      const next = pageNumber + 1;
      setPageNumber(next);
      fetchUserPosts(next);
    }
  }, [activeTab, isFetching, hasMore, pageNumber, fetchUserPosts]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const [modalOpen, setModalOpen] = useState(false);
  const [blockComment, setBlockComment] = useState<string>("");
  const { mutate: toggleUserBlock, isPending: isToggling } =
    trpc.user.toggleUserBlock.useMutation({
      onSuccess: async () => {
        setModalOpen(false);
        setBlockComment("");
        await refetchUser();
        router.refresh();
      },
    });

  if (isToggling) {
    router.refresh();
  }

  if (isLoadingUser && isFetching) {
    return <StaffDetailsSkeleton />;
  }

  return (
    <div className="p-6 bg-[#FAFAFA] min-h-screen">
      <div className="flex gap-[77px] items-start">
        {/* Left column: profile and summary */}
        <div className="flex-1 max-w-[475px] mt-[35px] space-y-10">
          <UserProfileCard
            id={user?.id ?? ""}
            name={user?.displayName ?? ""}
            role={user?.role ?? ""}
            email={user?.email ?? ""}
            phone={user?.phoneNumber || ""}
            address={user?.address || ""}
            isBlocked={user?.blocked || false}
            profileImage={user?.profileImage || "/images/avatar.png"}
          />

          <UserSummaryCard
            postCount={user?.postCount || 0}
            restaurantsPosted={user?.visitCount || 0}
            followers={user?.followers || 0}
            following={user?.following || 0}
          />
        </div>

        {/* Right column: activities */}
        <div className="flex-1 min-w-0 bg-white rounded-lg shadow p-6">
          <UserActionsHeader
            title="User's activities"
            isBlocked={user?.blocked}
            onToggle={() => setModalOpen(true)}
          />
          <div className="flex items-center justify-between border-b border-[#D5D5D5] mb-4 overflow-x-auto">
            <div className="flex items-center gap-x-7.5 min-w-0">
              <TabButton
                tab={UserDetailsTabsEnum.VIDEOS}
                label="Videos posted"
                count={videosCount}
              />
              <TabButton
                tab={UserDetailsTabsEnum.RESTAURANTS}
                label="Restaurants visited"
                count={restaurantsCount}
              />
            </div>
            <DateRangeFilter
              value={dateRange}
              onChange={(r) => {
                setDateRange(r);
                setPageNumber(1);
              }}
              placeholder="All time"
              className="w-[280px]"
            />
          </div>

          {/* Simple list rendering for now */}
          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto space-y-3"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            {activeTab === UserDetailsTabsEnum.VIDEOS && (
              <>
                {userPosts.length === 0 && initialLoadComplete ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-[#9DA1A5]">
                    <div className="w-16 h-16 mb-4 rounded-full bg-[#F0F1F2] flex items-center justify-center text-2xl">
                      🎬
                    </div>
                    <p className="text-lg font-semibold text-[#2E3032] mb-1">
                      No videos yet
                    </p>
                    <p>When this user posts videos, they will show up here.</p>
                  </div>
                ) : (
                  userPosts.map((post) => (
                    <LivePostCard
                      key={post.id}
                      post={post}
                      className="max-w-[556px]"
                      RestaurantDetailsFlow={false}
                    />
                  ))
                )}
                {isFetching && userPosts.length > 0 && (
                  <div className="flex justify-center p-4">
                    <p className="text-gray-500">Loading more posts...</p>
                  </div>
                )}
                {!hasMore && !isFetching && userPosts.length > 0 && (
                  <div className="flex justify-center p-4 mb-8">
                    <p className="text-gray-500">No more videos</p>
                  </div>
                )}
              </>
            )}

            {activeTab === UserDetailsTabsEnum.RESTAURANTS && (
              <>
                {visits.total === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-[#9DA1A5]">
                    <div className="w-16 h-16 mb-4 rounded-full bg-[#F0F1F2] flex items-center justify-center text-2xl">
                      🍽️
                    </div>
                    <p className="text-lg font-semibold text-[#2E3032] mb-1">
                      No restaurant visits
                    </p>
                    <p>
                      When this user visits restaurants, they will appear here.
                    </p>
                  </div>
                ) : (
                  list?.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="flex items-center justify-between p-4 rounded border border-[#F0F1F2]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded" />
                        <div>
                          <div className="font-semibold text-[#2E3032]">
                            {restaurant?.location?.name ?? "Restaurant"}
                          </div>
                          <div className="text-sm text-[#9DA1A5]">
                            {typeof restaurant?.location?.address === "string"
                              ? restaurant?.location?.address
                              : restaurant?.location?.address?.content}
                          </div>
                        </div>
                      </div>
                      {restaurant?.location?.id && (
                        <a
                          className="text-blue-600 font-semibold"
                          href={`/restaurants/${restaurant.location.id}`}
                        >
                          View restaurant
                        </a>
                      )}
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Block/Unblock Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${user?.isActive ? "Deactivate user?" : "Reactivate user?"}`}
        description={`${
          user?.isActive
            ? "Are you sure you want to block this user?"
            : "Are you sure you want to unblock this user?"
        }`}
        showCommentField={!!user?.isActive}
        onCommentChange={(e) =>
          setBlockComment((e?.target?.value as string) ?? "")
        }
        onConfirm={() => {
          if (!userId) return;
          toggleUserBlock({
            userId,
            comment: user?.isActive ? blockComment : undefined,
          });
        }}
        confirmLabel={`${user?.isActive ? "Deactivate" : "Reactivate"}`}
        successButtonClassName={`w-full h-18 text-white rounded-[20px] transition-colors text-[20px] font-semibold ${
          user?.isActive ? "bg-[#D80000]" : "bg-[#0070F3]"
        }`}
      />
    </div>
  );
};

export default UserDetailsPage;
