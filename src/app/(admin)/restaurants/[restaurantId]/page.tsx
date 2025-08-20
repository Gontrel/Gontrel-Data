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
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import { EditVideo } from "@/components/modals/EditPostModal";
import { RestaurantInfoCard } from "@/components/restaurants/details/RestaurantInfoCard";
import { AccountSummary } from "@/components/restaurants/details/AccountSummary";
import { PAGE_SIZE } from "@/constants";

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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [meta, setMetadata] = useState<IPostMeta>({
    pendingCount: 0,
    approvalCount: 0,
  });
  const [comment, setComment] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

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

  const { mutate } = trpc.restaurant.getToggleLocation.useMutation({
    onSuccess: () => {
      successToast("Restaurant status updated successfully");
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });

  const { mutate: deleteVideoMutation } = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setCurrentPostId(null);
      successToast("Post successfully deleted");
      refetch();
    },
  });

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

        const newPosts: Post[] = res.data;
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

        setMetadata(meta);

        if (newPosts.length === 0) {
          setHasMore(false);
          if (pageNumber === 1) {
            setPosts([]); // No posts at all
          }
        } else {
          setPosts((prev) => {
            // For first page, replace all posts
            if (pageNumber === 1) {
              return newPosts;
            }
            // For subsequent pages, append new posts
            const existingIds = new Set(prev.map((p) => p.id));
            const filteredNewPosts = newPosts.filter(
              (p) => !existingIds.has(p.id)
            );
            return [...prev, ...filteredNewPosts];
          });
        }

        setInitialLoadComplete(true);
      } finally {
        setIsFetching(false);
      }
    },
    [utils, restaurantId]
  );

  const refetch = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    fetchPosts(
      1,
      activeTab === "pending"
        ? ApprovalStatusEnum.PENDING
        : ApprovalStatusEnum.APPROVED
    );
  }, [activeTab, fetchPosts]);

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

  const toggleLocation = useCallback(async () => {
    mutate({ locationId: restaurantId });
  }, [restaurantId, mutate]);

  const handleConfirmation = () => {
    toggleLocation();
    setConfirmationModalOpen(false);
    refetch();
    refetchRest();
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleOpenEditModal = useCallback((postId: string) => {
    setCurrentPostId(postId);
    setEditModalOpen(true);
  }, []);

  const handleOpenDeleteModal = useCallback((postId: string) => {
    setCurrentPostId(postId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteVideo = useCallback(() => {
    if (!currentPostId) return;

    deleteVideoMutation({ postId: currentPostId });
  }, [currentPostId, deleteVideoMutation]);

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
    // Trigger load when user scrolls to 80% of the container
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
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

  const handlePostCreated = useCallback(async () => {
    await refetch();
    successToast("Posts list updated");
  }, [refetch]);

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

  const onDateRangeChange = () => {};

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const gontrelRestaurantData: GontrelRestaurantData = {
    name: restaurant.name,
    menu: restaurant.menu?.content,
    reservation: restaurant.reservation?.content,
    rating: restaurant?.rating,
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8 w-min-[512px]">
          {/* Restaurant Info Card */}
          <RestaurantInfoCard restaurant={restaurant} isActive={isActive} />
          {/* Account Summary Card */}
          <AccountSummary
            totalPosts={restaurant?.summary?.totalPosts ?? 0}
            tiktokPosts={restaurant?.summary?.tiktokPosts ?? 0}
            userPosts={restaurant?.summary?.userPosts ?? 0}
          />
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
              <div className="w-48 p-2 border-[#D9D9D9] flex flex-row items-center justify-between rounded-lg text-gray-500">
                <span> All post types</span>
                <Icon
                  name="arrowdownIcon"
                  stroke="#0070F3"
                  width={15}
                  height={15}
                />
              </div>

              <DateRangeFilter
                value={{ startDate: new Date(), endDate: new Date() }}
                onChange={() => {
                  onDateRangeChange();
                }}
                placeholder="All Time"
                className="w-[280px]"
              />
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            {/* Initial loading state */}
            {initialLoadComplete && isFetching && (
              <div className="flex justify-center p-4">
                <p className="text-gray-500">Loading posts...</p>
              </div>
            )}

            {/* No posts found (after initial load) */}
            {!initialLoadComplete && posts.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-center text-gray-500">
                  No {activeTab === "approved" ? "active" : "pending"} posts
                  found.
                </p>
              </div>
            )}

            {/* Render posts */}
            {posts.length > 0 && (
              <>
                {posts.map((post: Post) => (
                  <LivePostCard
                    key={post.id}
                    post={post}
                    restaurant={restaurant}
                    RestaurantDetailsFlow={true}
                    handleOpenEditModal={() => handleOpenEditModal(post.id)}
                    handleOpenDeleteModal={() => handleOpenDeleteModal(post.id)}
                    handleApprove={
                      activeTab === "pending"
                        ? () => handleApprovePost(restaurant.id, post.id)
                        : undefined
                    }
                    handleDecline={
                      activeTab === "pending"
                        ? () => handleDeclinePost(restaurant.id, post.id, "")
                        : undefined
                    }
                  />
                ))}

                {/* Loading more indicator */}
                {isFetching && (
                  <div className="flex justify-center p-4">
                    <p className="text-gray-500">Loading more posts...</p>
                  </div>
                )}

                {/* No more posts indicator */}
                {!hasMore && !isFetching && posts.length > 0 && (
                  <div className="flex justify-center p-4 mb-8">
                    <p className="text-gray-500">No more videos</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* New Restaurant Modal */}
      <NewPostSheet
        open={showNewPostModal}
        restaurant={restaurant}
        onOpenChange={handleNewPostModalOpenChange}
        onPostCreated={handlePostCreated}
      />

      {/* Restaurant Deactivation Modal */}
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

      {/* Edit Restaurant Modal */}
      <EditVideo
        submissionId={currentPostId ?? ""}
        title="Edit restaurant video"
        description="The Edit video modal allows you to modify the details of the restaurant video"
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      {/* Video Deletion Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete video?"
        description="Are you sure you want to delete this video? This action cannot be undone"
        showCommentField={false}
        onConfirm={handleDeleteVideo}
        confirmLabel="Delete"
        successButtonClassName="w-full h-18 text-white rounded-[20px] transition-colors text-[20px] font-semibold bg-[#D80000]"
      />
    </div>
  );
};

export default RestaurantDetailsPage;
