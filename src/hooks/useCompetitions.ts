import { trpc } from "@/lib/trpc-client";

interface UseGetCompetitionsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

interface UseGetCompetitionParticipantsParams {
  pageNumber?: number;
  quantity?: number;
  searchTerm?: string;
}

export const useGetCompetitions = ({
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  endDate,
  isActive,
}: UseGetCompetitionsProps) => {
  const { data: queryData, isLoading, error, refetch } =
    trpc.admin.getCompetitions.useQuery({
      pageNumber: currentPage,
      quantity: pageSize,
      query: searchTerm,
      startDate,
      endDate,
      isActive,
    });

  return { queryData, isLoading, error, refetch };
};

// Create competition
export interface CreateCompetitionPayload {
  title: string;
  type: string;
  startDate?: string;
  endDate?: string;
  eligibleWinners?: number;
  eligibleQualifiers?: number;
  totalParticipants?: number;
  aggregation?: string;
  aggregationValue?: number;
}

export const useCreateCompetition = () => {
  const {
    mutateAsync: createCompetition,
    isPending: isLoading,
    isError,
    isSuccess,
    isIdle,
    isPaused,
    error,
  } = trpc.admin.createCompetition.useMutation();

  const handleCreateCompetition = async (data: CreateCompetitionPayload) => {
    await createCompetition(data);
  };

  return {
    handleCreateCompetition,
    isLoading,
    isError,
    isSuccess,
    isIdle,
    isPaused,
    error,
  };
};

export const useGetCompetitionById = (competitionId: string | undefined) => {
  const enabled = Boolean(competitionId);
  const { data, isLoading, error, refetch } = trpc.admin.getCompetitionById.useQuery(
    { competitionId: (competitionId as string) },
    { enabled }
  );

  return { data, isLoading, error, refetch };
};


export const useGetCompetitionParticipants = ({
  pageNumber,
  quantity,
  searchTerm,
}: UseGetCompetitionParticipantsParams) => {

  const { data, isLoading, error, refetch } =
    trpc.admin.getCompetitionParticipants.useQuery(
      {
        pageNumber,
        quantity,
        query: searchTerm,
      },
    );

  return { data, isLoading, error, refetch };
};

export const useToggleCompetitionActive = () => {
  const {
    mutateAsync: toggleCompetition,
    isPending: isLoading,
    isError,
    error,
    isSuccess,
  } = trpc.admin.toggleCompetitionActive.useMutation();

  return { toggleCompetition, isLoading, isError, isSuccess, error };
};
