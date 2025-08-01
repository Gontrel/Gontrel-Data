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

export enum ApprovalType {
  POST = 'post',
  ADDRESS = 'address',
  LOCATION = 'location',
  RESERVATION = 'reservation',
  MENU = 'menu',
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

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum DayOfTheWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}
