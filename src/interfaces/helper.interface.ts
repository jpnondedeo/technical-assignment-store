import { Permission } from "../types/permission-types";

export interface HelperInterface {
    PERMISSION_DECORATOR: string;
    canRead: (perm: Permission) => boolean;
    canWrite: (perm: Permission) => boolean;
}
