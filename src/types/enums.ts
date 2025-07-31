export enum AdminRoleEnum {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  ANALYST = 'analyst',
  MANAGER = 'manager'
}

export enum ApprovalStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ManagerTableTabsEnum {
  ACTIVE_RESTAURANTS = 'active_restaurants',
  PENDING_RESTAURANTS = 'pending_restaurants',
  PENDING_VIDEOS = 'pending_videos'
}

export enum AnalystTableTabsEnum {
  ACTIVE_RESTAURANTS = 'active_restaurants',
  SUBMITTED_RESTAURANTS = 'submitted_restaurants',
  SUBMITTED_VIDEOS = 'submitted_videos'
}

export enum TableStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined'
}

export enum TrendEnum {
  POPULAR_SEARCHES = 'Popular searches',
  TRENDING_TIKTOK = 'Trending TikTok #',
  NONE = 'None'
}