export enum ManagerTableTabs {
    ACTIVE_RESTAURANTS = 'active_restaurants',
    PENDING_RESTAURANTS = 'pending_restaurants',
    PENDING_VIDEOS = 'pending_videos'
}

export enum AnalystTableTabs {
    ACTIVE_RESTAURANTS = 'active_restaurants',
    SUBMITTED_RESTAURANTS = 'submitted_restaurants',
    SUBMITTED_VIDEOS = 'submitted_videos'
}

export enum TableStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    DECLINED = 'declined'
}

/**
 * Table column sizes for consistent layout
 */
export const TABLE_COLUMN_SIZES = {
    ID: 50,
    NAME: 200,
    VIDEO: 150,
    WEBSITE: 180,
    ADDRESS: 300,
    MENU_LINK: 300,
    RESERVATION_LINK: 300,
    OPENING_HOURS: 150,
    ADDED_BY: 190,
    DATE_ADDED: 170,
    ACTIONS: 190,
} as const;