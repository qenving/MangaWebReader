// Role and Status constants for SQLite compatibility
// Since SQLite doesn't support native enums, we use string constants

export const UserRole = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    MODERATOR: 'MODERATOR',
    MEMBER: 'MEMBER',
    GUEST: 'GUEST',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const MangaStatus = {
    ONGOING: 'ONGOING',
    COMPLETED: 'COMPLETED',
    HIATUS: 'HIATUS',
} as const;

export type MangaStatusType = typeof MangaStatus[keyof typeof MangaStatus];

export const MangaType = {
    MANGA: 'MANGA',
    MANHWA: 'MANHWA',
    MANHUA: 'MANHUA',
} as const;

export type MangaTypeValue = typeof MangaType[keyof typeof MangaType];
