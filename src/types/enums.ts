export enum AdminRoleEnum {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  ANALYST = 'analyst',
  MANAGER = 'manager',
  USER = 'user',
}

export enum ApprovalStatusEnum {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ApprovalType {
  POST = "post",
  ADDRESS = "address",
  LOCATION = "location",
  RESERVATION = "reservation",
  MENU = "menu",
}

export enum ManagerTableTabsEnum {
  ACTIVE_RESTAURANTS = "activeRestaurants",
  PENDING_RESTAURANTS = "pendingRestaurants",
  PENDING_VIDEOS = "pendingVideos",
}

export enum StaffTableTabsEnum {
  ACTIVE_STAFF = "activeStaff",
  DEACTIVATED_STAFF = "deactivatedStaff",
}

export enum AnalystTableTabsEnum {
  ACTIVE_RESTAURANTS = "activeRestaurants",
  SUBMITTED_RESTAURANTS = "submittedRestaurants",
  SUBMITTED_VIDEOS = "submittedVideos",
}

export enum TrendEnum {
  POPULAR_SEARCHES = "Popular searches",
  TRENDING_TIKTOK = "Trending TikTok #",
  NONE = "None",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export enum DayOfTheWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}
