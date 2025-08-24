export enum AdminRoleEnum {
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  ANALYST = "analyst",
  MANAGER = "manager",
  USER = "user",
}

export enum ApprovalStatusEnum {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum StaffTableTabsEnum {
  ACTIVE_STAFF = "activeStaffs",
  DEACTIVATED_STAFF = "deactivatedStaffs",
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
  PENDING_USER_VIDEOS = "pendingUserVideos",
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


export enum ActivityType {
  UNKNOWN = "UNKNOWN",
  POST = "POST",
  LOCATION = "LOCATION",
  APPROVAL = "APPROVAL",
  INTENT = "INTENT",
  PASSWORD = "PASSWORD",
}
