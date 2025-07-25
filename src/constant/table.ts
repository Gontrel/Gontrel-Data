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

/**
 * Table column sizes for consistent layout
 */
export const TABLE_COLUMN_SIZES = {
    ID: 50,
    NAME: 200,
    VIDEO: 180,
    WEBSITE: 180,
    ADDRESS: 200,
    MENU_LINK: 150,
    RESERVATION_LINK: 150,
    OPENING_HOURS: 150,
    ADDED_BY: 150,
    DATE_ADDED: 150,
    ACTIONS: 150,
} as const;