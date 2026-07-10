import APIRequest from "@/api/service";

/**
 * Upload a video file directly via the API service
 * @param file - The video file to upload
 * @param userId - Optional user ID to include in the upload
 * @param onUploadProgress - Optional callback for upload progress updates
 * @returns Object containing the uploaded video URL, thumbnail URL, HLS URL and first frame URL
 */
export const uploadVideoFile = async (
  file: File,
  userId?: string,
  onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void
): Promise<{
  videoUrl: string;
  thumbUrl: string;
  hlsUrl?: string;
  firstFrameUrl?: string;
}> => {
  const apiRequest = APIRequest.getInstance();
  return apiRequest.uploadVideo(file, userId, onUploadProgress);
};
