import { trpc } from "@/lib/trpc-client";

interface UseAdminListFeatureFlagsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  environment?: string;
  lastTokenId?: string;
}

export const useGetFeatureFlagCards = () => {
  const { data, isLoading, error, refetch } =
    trpc.feature.getFeatureFlagCards.useQuery();
  return { data, isLoading, error, refetch };
};

export const useAdminListFeatureFlags = ({
  currentPage,
  pageSize,
  searchTerm,
  environment,
  lastTokenId,
}: UseAdminListFeatureFlagsProps) => {
  const { data, isLoading, error, refetch } =
    trpc.feature.adminListFeatureFlags.useQuery({
      pageNumber: currentPage,
      quantity: pageSize,
      query: searchTerm,
      environment,
      lastTokenId,
    });

  return { data, isLoading, error, refetch };
};

export const useToggleFeatureFlagActive = () => {
  const {
    mutateAsync: toggleAsync,
    isPending: isToggling,
    isError: toggleError,
    isSuccess: toggleSuccess,
  } = trpc.feature.toggleFeatureFlagActive.useMutation();

  const toggle = async (params: {
    featureFlagId: string;
  }) => {
    await toggleAsync(params);
  };

  return { toggle, isToggling, toggleError, toggleSuccess };
};

export const useCreateFeatureFlag = () => {
  const {
    mutateAsync: createAsync,
    isPending: isCreating,
    isError: createError,
    isSuccess: createSuccess,
  } = trpc.feature.createFeatureFlag.useMutation();

  const create = async (params: { name: string;}) => {
    await createAsync(params);
  };

  return { create, isCreating, createError, createSuccess };
};
