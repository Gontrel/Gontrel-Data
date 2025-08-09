"use client";

import { useState, use, useRef, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { LivePostCard } from "@/components/restaurants/LivePostCard";
import { NewPostSheet } from "@/components/posts/NewPostsModal";
import { PreviewVideoModal } from "@/components/modals/PreviewVideoModal";
import { GontrelPostView } from "@/components/video/GontrelPostView";
import { useVideoStore } from "@/stores/videoStore";
import { trpc } from "@/lib/trpc-client";
import { RestaurantDetailsSkeleton } from "@/components/Loader/restaurants/RestaurantDetailsSkeleton";
import { Post } from "@/interfaces/posts";
import Icon from "@/components/svgs/Icons";
import { GontrelRestaurantData } from "@/interfaces";
import {
  ApprovalStatusEnum,
  ApprovalType,
  ManagerTableTabsEnum,
} from "@/types/enums";
import { errorToast, successToast } from "@/utils/toast";
import { usePendingRestaurantsStore } from "@/stores/tableStore";
import { useHeaderStore } from "@/stores/headerStore";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

const PAGE_SIZE = 10;

interface IPostMeta {
  pendingCount: number;
  approvalCount: number;
}

const RestaurantDetailsPage = ({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) => {
  const { restaurantId } = use(params);
  const [activeTab, setActiveTab] = useState<"approved" | "pending">(
    "approved"
  );
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const { activeVideoUrl, setActiveVideoUrl, restaurantData, tiktokUsername } =
    useVideoStore();
  const { isConfirmationModalOpen, setConfirmationModalOpen, isActive } =
    useHeaderStore();
  const { approveRestaurant, declineRestaurant } = usePendingRestaurantsStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [meta, setMetadata] = useState<IPostMeta>({
    pendingCount: 0,
    approvalCount: 0,
  });
  const [comment, setComment] = useState<string>("");

  const { setIsActive, setIsActiveText } = useHeaderStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useContext();

  const { mutate: approveRestaurantStatus } =
    trpc.restaurant.approveRestaurantStatus.useMutation({
      onSuccess: () => {
        successToast("Restaurant status updated successfully");
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  const {
    data: restaurant,
    isLoading,
    isError,
    error,
    refetch: refetchRest,
  } = trpc.restaurant.getRestaurantById.useQuery(
    { locationId: restaurantId },
    { enabled: !!restaurantId }
  );

  const fetchPosts = useCallback(
    async (pageNumber: number, status: ApprovalStatusEnum) => {
      setIsFetching(true);
      try {
        const res = await utils.post.getPosts.fetch({
          locationId: restaurantId,
          status,
          quantity: PAGE_SIZE,
          pageNumber,
        });

        const posts: Post[] = res.data;
        const metaRaw = res.meta;
        const meta: IPostMeta = {
          pendingCount:
            typeof metaRaw?.pendingCount === "number"
              ? metaRaw.pendingCount
              : 0,
          approvalCount:
            typeof metaRaw?.approvalCount === "number"
              ? metaRaw.approvalCount
              : 0,
        };

        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const filteredNewPosts = posts.filter((p) => !existingIds.has(p.id));
          return [...prev, ...filteredNewPosts];
        });

        setMetadata(meta);
        setIsFetching(false);
      } finally {
        setIsFetching(false);
      }
    },
    [utils, restaurantId]
  );

  const refetch = useCallback(() => {
    setPosts([]);
    if (activeTab === "pending") {
      fetchPosts(1, ApprovalStatusEnum.PENDING);
    } else if (activeTab === "approved") {
      fetchPosts(1, ApprovalStatusEnum.APPROVED);
    }
  }, [activeTab, setPosts, fetchPosts]);

  const handleApprovePost = useCallback(
    (locationId: string, postId: string) => {
      approveRestaurant(
        ManagerTableTabsEnum.PENDING_RESTAURANTS,
        locationId,
        "posts",
        postId
      );
      approveRestaurantStatus({
        resourceId: postId,
        locationId,
        type: ApprovalType.POST,
        status: ApprovalStatusEnum.APPROVED,
      });
      refetch();
    },
    [approveRestaurant, approveRestaurantStatus, refetch]
  );

  const handleDeclinePost = useCallback(
    (locationId: string, postId: string, comment: string) => {
      declineRestaurant(
        ManagerTableTabsEnum.PENDING_RESTAURANTS,
        locationId,
        "posts",
        postId
      );
      approveRestaurantStatus({
        resourceId: postId,
        locationId,
        type: ApprovalType.POST,
        status: ApprovalStatusEnum.REJECTED,
        comment,
      });
      refetch();
    },
    [declineRestaurant, approveRestaurantStatus, refetch]
  );

  const { mutate } = trpc.restaurant.getToggleLocation.useMutation({
    onSuccess: () => {
      successToast("Restaurant status updated successfully");
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });

  const toggleLocation = useCallback(async () => {
    mutate({ locationId: restaurantId });
  }, [restaurantId, mutate]);

  useEffect(() => {
    if (restaurantId) {
      setPosts([]);
      setPage(1);
      fetchPosts(1, ApprovalStatusEnum.APPROVED);
    }
  }, [restaurantId, fetchPosts]);

  useEffect(() => {
    if (restaurant) {
      setIsActive(restaurant.isActive);
    }
  }, [restaurant, setIsActive, setIsActiveText]);

  const handleTabChange = (tab: "approved" | "pending") => {
    setActiveTab(tab);
    setPage(1);
    setHasMore(true);

    if (tab === "pending") {
      setPosts([]);
      fetchPosts(1, ApprovalStatusEnum.PENDING);
    }

    if (tab === "approved") {
      setPosts([]);
      fetchPosts(1, ApprovalStatusEnum.APPROVED);
    }
  };
  // Infinite scroll logic
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isFetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (scrollHeight - (scrollTop + clientHeight) < 100) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(
        nextPage,
        activeTab === "approved"
          ? ApprovalStatusEnum.APPROVED
          : ApprovalStatusEnum.PENDING
      );
    }
  }, [page, activeTab, isFetching, hasMore, fetchPosts]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Handle loading and error states
  if (isLoading && isFetching) {
    return <RestaurantDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error: {error.message}
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Restaurant not found.
      </div>
    );
  }

  const handleNewPostModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setActiveVideoUrl(null);
      setShowNewPostModal(false);
    }
  };

  const handleConfirmation = () => {
    //TODO: API call
    toggleLocation();
    setConfirmationModalOpen(false);
    refetch();
    refetchRest();
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const gontrelRestaurantData: GontrelRestaurantData = {
    name: restaurant.name,
    menu: restaurant.menu,
    reservation: restaurant.reservation,
    rating: restaurant.rating,
  };

  return (
    <div className="bg-[#FAFAFA] p-8 relative">
      <PreviewVideoModal
        open={!!activeVideoUrl}
        onOpenChange={handleNewPostModalOpenChange}
        showCloseButton={false}
      >
        {restaurantData && (
          <GontrelPostView
            videoUrl={activeVideoUrl}
            restaurantData={gontrelRestaurantData}
            tiktokUsername={tiktokUsername || ""}
          />
        )}
      </PreviewVideoModal>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fixed">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8 w-[512px]">
          {/* Restaurant Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={restaurant?.imageUrl}
                alt={restaurant?.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">#{restaurant?.id}</p>
                <h1 className="text-2xl font-bold">{restaurant?.name}</h1>
                <p className="text-sm text-gray-500">
                  Created by: {restaurant?.admin?.name}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <a
                href={restaurant?.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-[#FAFAFA]  rounded-lg hover:bg-gray-200"
              >
                <Icon name="restaurantTiktokIcon" className="w-5 h-5" /> View
                TikTok <Icon name="externalLinkIcon" className="w-5 h-5" />
              </a>
              <a
                href={restaurant?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-[#FAFAFA] rounded-lg hover:bg-gray-200"
              >
                <Icon name="worldIcon" className="w-5 h-5" /> View website{" "}
                <Icon name="externalLinkIcon" className="w-5 h-5" />
              </a>
              <a
                href={restaurant?.mapLink}
                className="flex items-center gap-2 p-2 bg-[#FAFAFA]  rounded-lg hover:bg-gray-200"
              >
                <Icon name="restaurantLocationIcon" className="w-5 h-5" />
                View address
                <Icon name="externalLinkIcon" className="w-5 h-5" />
              </a>
              <a
                href={restaurant?.menu?.content}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-[#FAFAFA]  rounded-lg hover:bg-gray-200"
              >
                <Icon name="menuIcon" className="w-5 h-5" /> <p>View menu</p>{" "}
                <Icon name="externalLinkIcon" className="w-5 h-5" />
              </a>
              <a
                href={restaurant?.reservation?.content}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-[#FAFAFA]  rounded-lg hover:bg-gray-200"
              >
                <Icon name="restaurantReversationIcon" className="w-5 h-5" />
                View reservation{" "}
                <Icon name="externalLinkIcon" className="w-5 h-5" />
              </a>
              <a
                href={""} //restaurant.opening_hours[0]
                className="flex items-center gap-2 p-2 bg-[#FAFAFA] rounded-lg hover:bg-gray-200"
              >
                <Icon name="restaurantTimeIcon" className="w-5 h-5" /> View
                working hours
              </a>
            </div>
          </div>

          {/* Account Summary Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-[42px] text-[#9DA1A5] text-base">
              Account summary
            </h2>
            <div className="flex justify-between text-center">
              <div>
                <p className="text-2xl text-[#2E3032] font-bold">
                  {restaurant?.summary?.totalPosts ?? 0}
                </p>
                <p className="text-base text-[#9DA1A5]">Total posts</p>
              </div>
              <div>
                <p className="text-2xl text-[#2E3032] font-bold">
                  {restaurant?.summary?.tiktokPosts ?? 0}
                </p>
                <p className="text-base  text-[#9DA1A5]">From TikTok</p>
              </div>
              <div>
                <p className="text-2xl text-[#2E3032] font-bold">
                  {restaurant?.summary?.userPosts ?? 0}
                </p>
                <p className="text-base text-[#9DA1A5]">UGC created</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 bg-white p-6 ml-[91px] rounded-2xl shadow-sm flex flex-col w-[744px] h-[980px]">
          {/* Header and Filters (fixed height) */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-8">
                <button
                  onClick={() => handleTabChange("approved")}
                  className={`py-[10px] px-[20px] ${
                    activeTab === "approved"
                      ? "border-2 border-[#F0F1F2] font-semibold rounded-[10px]"
                      : "text-[#9DA1A5]"
                  }`}
                >
                  Live posts ({meta?.approvalCount ?? 0})
                </button>
                <button
                  onClick={() => handleTabChange("pending")}
                  className={`py-[10px] px-[20px] ${
                    activeTab === "pending"
                      ? "border-2 border-[#F0F1F2] font-semibold rounded-[10px]"
                      : "text-gray-500"
                  }`}
                >
                  Pending videos ({meta?.pendingCount ?? 0})
                </button>
              </div>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="bg-[#0070F3] text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} /> New Post
              </button>
            </div>
            <div className="flex flex-row justify-between mb-6">
              <div
                className="w-48 p-2 border flex flex-row items-center justify-between
               rounded-lg text-gray-500"
              >
                <span> All post types</span>
                <Icon
                  name="arrowdownIcon"
                  stroke="#0070F3"
                  width={24}
                  height={24}
                />
              </div>

              <div className="w-48 border rounded-lg flex flex-row items-center justify-between gap-2 text-gray-500 p-[14px]">
                <div className="flex flex-row items-center justify-between gap-2">
                  <Icon
                    name="postCalendarIcon"
                    stroke="#0070F3"
                    width={24}
                    height={24}
                  />
                  <span>All time</span>
                </div>
                <Icon
                  name="arrowdownIcon"
                  stroke="#0070F3"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            {activeTab === "approved" && !isFetching ? (
              posts?.length > 0 ? (
                posts?.map((post: Post) => (
                  <LivePostCard
                    key={post.id}
                    post={post}
                    restaurant={restaurant}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-center text-gray-500">
                    No active posts found.
                  </p>
                </div>
              )
            ) : posts?.length > 0 && !isFetching ? (
              posts?.map((post: Post) => (
                <LivePostCard
                  key={post.id}
                  handleApprove={handleApprovePost ?? undefined}
                  handleDecline={
                    handleDeclinePost
                      ? () => handleDeclinePost(restaurant.id, post.id, "")
                      : undefined
                  }
                  post={post}
                  restaurant={restaurant}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-center text-gray-500">
                  No pending posts found.
                </p>
              </div>
            )}

            {isFetching && (
              <div className="flex justify-center p-4">
                <p className="text-gray-500">Loading more posts...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* New Restaurant Modal */}
      <NewPostSheet
        open={showNewPostModal}
        restaurant={restaurant}
        onOpenChange={handleNewPostModalOpenChange}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseModal}
        title={`${
          isActive ? "Deactivate restaurant?" : "Deactivate restaurant?"
        }`}
        description={`${
          isActive
            ? "Are you sure you want to deactivate this restaurant?"
            : "Are you sure you want to re-activate this restaurant?"
        }`}
        comment={isActive ? comment : ""}
        showCommentField={isActive ? true : false}
        onCommentChange={handleCommentChange}
        onConfirm={handleConfirmation}
        confirmLabel={`${isActive ? "Deactivate" : "Re-activate?"}`}
        commentPlaceholder="Add reason here"
        commentLabel="Reason"
        successButtonClassName={`w-full h-18 text-white rounded-[20px] transition-colors text-[20px] font-semibold ${
          isActive ? "bg-[#D80000]" : "bg-[#0070F3]"
        }`}
      />
    </div>
  );
};

export default RestaurantDetailsPage;
