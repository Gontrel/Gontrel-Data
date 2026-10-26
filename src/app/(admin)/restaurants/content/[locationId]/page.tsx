"use client";

import { useState, use, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc-client";
import { RestaurantDetailsSkeleton } from "@/components/Loader/restaurants/RestaurantDetailsSkeleton";
import { Post, Tag } from "@/interfaces/posts";
import { ApprovalStatusEnum } from "@/types/enums";
import { errorToast, successToast } from "@/utils/toast";
import { RestaurantDetailLeftPanel, LeftPanelFieldData } from "@/components/restaurants/details/RestaurantDetailLeftPanel";
import { RestaurantDetailRightPanel } from "@/components/restaurants/details/RestaurantDetailRightPanel";
import { MediaCarousel } from "@/components/restaurants/details/MediaCarousel";
import { PreviewVideoModal } from "@/components/modals/PreviewVideoModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useVideoStore } from "@/stores/videoStore";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import Icon from "@/components/svgs/Icons";
import { PAGE_SIZE } from "@/constants";
import { Location, GontrelRestaurantData } from "@/interfaces/restaurants";
import { Admin } from "@/interfaces/user";

const ApprovedContentDetailPage = ({
  params,
}: {
  params: Promise<{ locationId: string }>;
}) => {
  const { locationId } = use(params);
  const router = useRouter();
  const utils = trpc.useContext();

  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [postCount, setPostCount] = useState(0);

  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [tags, setTags] = useState<Tag[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCuisines, setAvailableCuisines] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasLeftPanelChanges, setHasLeftPanelChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [leftPanelFields, setLeftPanelFields] = useState<LeftPanelFieldData | null>(null);

  const { activeVideoUrl, setActiveVideoUrl } = useVideoStore();

  const {
    data: restaurant,
    isLoading,
    isError,
    error,
    refetch: refetchRestaurant,
  } = trpc.restaurant.getRestaurantById.useQuery(
    { locationId },
    { enabled: !!locationId }
  );

  const { data: cuisinesData } = trpc.restaurant.getCuisines.useQuery();

  useEffect(() => {
    if (cuisinesData) {
      setAvailableCuisines(cuisinesData.map((c: { name: string }) => c.name));
    }
  }, [cuisinesData]);

  const { data: tagSuggestionsData } = trpc.restaurant.getTagSuggestions.useQuery(
    { placeId: restaurant?.placeId || "", quantity: 20 },
    { enabled: !!restaurant?.placeId }
  );

  useEffect(() => {
    if (tagSuggestionsData) {
      setAvailableTags(tagSuggestionsData.map((t: { id: string; name: string; isTaste?: boolean }) => ({
        id: t.id,
        name: t.name,
        createdAt: "",
        modifiedAt: "",
        deletedAt: null,
        deletedBy: null,
        updatedBy: null,
        firebaseId: null,
        count: 0,
        image: "",
        resource: "",
        type: "",
        isTaste: t.isTaste || false,
      })));
    }
  }, [tagSuggestionsData]);

  const { mutate: deletePostMutation } = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      successToast("Post deleted successfully");
      setShowDeletePostModal(false);
      setPostToDelete(null);
      refetchPosts();
    },
    onError: (error) => {
      errorToast(error.message || "Failed to delete post");
    },
  });

  const { mutate: updateRestaurant } = trpc.restaurant.updateRestaurant.useMutation({
    onSuccess: () => {
      successToast("Changes saved successfully");
      setIsSaving(false);
      setHasChanges(false);
      refetchRestaurant();
    },
    onError: (error) => {
      errorToast(error.message || "Failed to save changes");
      setIsSaving(false);
    },
  });

  const fetchPosts = useCallback(
    async (pageNumber: number) => {
      setIsFetching(true);
      try {
        const res = await utils.post.getPosts.fetch({
          locationId,
          status: ApprovalStatusEnum.APPROVED,
          quantity: PAGE_SIZE,
          pageNumber,
        });

        const newPosts: Post[] = res.data;
        const meta = res.meta as { approvalCount?: number; pendingCount?: number } | undefined;
        setPostCount(meta?.approvalCount ?? newPosts.length);

        if (newPosts.length === 0) {
          setHasMore(false);
          if (pageNumber === 1) {
            setPosts([]);
          }
        } else {
          if (newPosts.length < PAGE_SIZE) {
            setHasMore(false);
          }
          setPosts((prev) => {
            if (pageNumber === 1) {
              return newPosts;
            }
            const existingIds = new Set(prev.map((p) => p.id));
            const filteredNewPosts = newPosts.filter((p) => !existingIds.has(p.id));
            return [...prev, ...filteredNewPosts];
          });
        }

        if (pageNumber === 1 && newPosts.length > 0) {
          setTags(newPosts[0].tags || []);
        }
      } finally {
        setIsFetching(false);
      }
    },
    [utils, locationId]
  );

  const refetchPosts = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    setCurrentPostIndex(0);
    fetchPosts(1);
  }, [fetchPosts]);

  useEffect(() => {
    if (locationId) {
      fetchPosts(1);
    }
  }, [locationId, fetchPosts]);

  useEffect(() => {
    if (posts.length > 0 && posts[currentPostIndex]?.tags) {
      setTags(posts[currentPostIndex].tags);
    }
  }, [currentPostIndex, posts]);

  const handleSaveChanges = useCallback(() => {
    if (!restaurant || !leftPanelFields) return;

    setIsSaving(true);

    updateRestaurant({
      locationId,
      address: leftPanelFields.address.content,
      website: leftPanelFields.website,
      menu: leftPanelFields.menu.content,
      orderLink: leftPanelFields.orderLink.content,
      reservation: leftPanelFields.reservation.content,
    });
  }, [restaurant, locationId, leftPanelFields, updateRestaurant]);

  const handleLeftPanelFieldsChange = useCallback((data: LeftPanelFieldData, panelHasChanges: boolean) => {
    setLeftPanelFields(data);
    setHasLeftPanelChanges(panelHasChanges);
  }, []);

  const handleDeletePost = useCallback((postId: string) => {
    setPostToDelete(postId);
    setShowDeletePostModal(true);
  }, []);

  const confirmDeletePost = useCallback(() => {
    if (postToDelete) {
      deletePostMutation({ postId: postToDelete });
    }
  }, [postToDelete, deletePostMutation]);

  const handleTagsChange = useCallback((newTags: Tag[]) => {
    setTags(newTags);
    setHasChanges(true);
  }, []);

  const handleCuisinesChange = useCallback((newCuisines: string[]) => {
    setCuisines(newCuisines);
    setHasChanges(true);
  }, []);

  const handlePostIndexChange = useCallback((index: number) => {
    setCurrentPostIndex(index);
  }, []);

  if (isLoading) {
    return <RestaurantDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Restaurant not found.</p>
      </div>
    );
  }

  const currentPost = posts[currentPostIndex] || null;
  const restaurantData: GontrelRestaurantData = {
    id: restaurant.id,
    name: restaurant.name,
    videoUrl: currentPost?.videoUrl,
    menu: restaurant.menu,
    reservation: restaurant.reservation,
    rating: restaurant.rating,
    address: restaurant.address,
    website: restaurant.website || "",
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <PreviewVideoModal
        open={!!activeVideoUrl}
        onOpenChange={(isOpen) => !isOpen && setActiveVideoUrl(null)}
        showCloseButton={false}
      />

      <div className="flex gap-0 h-screen">
        <div className="w-[287px] min-w-[287px] border-r border-gray-200 bg-white">
          <RestaurantDetailLeftPanel
            restaurant={restaurant as Location & { admin?: Admin }}
            onFieldsChange={handleLeftPanelFieldsChange}
            onDeleteClick={() => currentPost && handleDeletePost(currentPost.id)}
            isSaving={isSaving}
            deleteButtonLabel="Delete Post"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-[#2E3032]">{restaurant.name}</h1>
            <p className="text-xs text-gray-400">#{restaurant.id}</p>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#171A1C] p-2">
              Approved Content ({postCount})
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-[11px]">
              <button className="flex items-center gap-1 px-2 py-2 bg-white border border-[#F0F1F2] rounded text-sm text-[#171A1C] cursor-pointer hover:bg-gray-50 w-[140px]">
                <span className="flex-1 font-medium text-left">All post types</span>
                <Icon name="arrowdownIcon" stroke="#4D5255" width={16} height={16} />
              </button>
              <DateRangeFilter
                value={{ startDate: new Date(), endDate: new Date() }}
                onChange={() => {}}
                placeholder="All Time"
                className="w-[140px]"
              />
            </div>
          </div>

          <hr className="border-[#F0F1F2] mb-4" />

          <div className="flex gap-4">
            <div className="flex-1">
              {posts.length > 0 ? (
                <MediaCarousel
                  posts={posts}
                  restaurant={restaurantData}
                  currentIndex={currentPostIndex}
                  onIndexChange={handlePostIndexChange}
                />
              ) : (
                <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-xl">
                  <p className="text-gray-500">No approved content</p>
                </div>
              )}
            </div>

            <div className="w-[430px] min-w-[430px] border-l border-[#F0F1F2]">
              <RestaurantDetailRightPanel
                currentPost={currentPost}
                tags={tags}
                cuisines={cuisines}
                availableTags={availableTags}
                availableCuisines={availableCuisines}
                onTagsChange={handleTagsChange}
                onCuisinesChange={handleCuisinesChange}
                onDeleteMedia={handleDeletePost}
                onSaveChanges={handleSaveChanges}
                isSaving={isSaving}
                hasChanges={hasChanges || hasLeftPanelChanges}
                googleRating={4.5}
                gontrelRating={restaurant.rating}
                stats={{
                  totalLikes: 0,
                  totalSaves: 0,
                  totalViews: 0,
                  totalShares: 0,
                  totalBookings: 0,
                  totalInteractions: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeletePostModal}
        onClose={() => {
          setShowDeletePostModal(false);
          setPostToDelete(null);
        }}
        title="Delete post?"
        description="Are you sure you want to delete this post? This action cannot be undone."
        showCommentField={false}
        onConfirm={confirmDeletePost}
        confirmLabel="Delete"
        successButtonClassName="w-full h-14 bg-red-600 text-white rounded-[20px] transition-colors text-lg font-semibold hover:bg-red-700"
      />
    </div>
  );
};

export default ApprovedContentDetailPage;
