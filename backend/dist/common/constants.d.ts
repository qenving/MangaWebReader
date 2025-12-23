export declare const UserRole: {
    readonly OWNER: "OWNER";
    readonly ADMIN: "ADMIN";
    readonly MODERATOR: "MODERATOR";
    readonly MEMBER: "MEMBER";
    readonly GUEST: "GUEST";
};
export type UserRoleType = typeof UserRole[keyof typeof UserRole];
export declare const MangaStatus: {
    readonly ONGOING: "ONGOING";
    readonly COMPLETED: "COMPLETED";
    readonly HIATUS: "HIATUS";
};
export type MangaStatusType = typeof MangaStatus[keyof typeof MangaStatus];
export declare const MangaType: {
    readonly MANGA: "MANGA";
    readonly MANHWA: "MANHWA";
    readonly MANHUA: "MANHUA";
};
export type MangaTypeValue = typeof MangaType[keyof typeof MangaType];
