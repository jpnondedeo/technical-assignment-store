import { Permission } from "../types/permission-types";
import { HelperInterface } from "../interfaces/helper.interface";

export class Helper implements HelperInterface {

    public PERMISSION_DECORATOR = 'permission-decorator';

    // returns whether the user has the right to read
    public canRead(permission: Permission): boolean {
        return permission === "r" || permission === "rw";
    }

    //returns whether the user has the right to write
    public canWrite(permission: Permission): boolean {
        return permission === "w" || permission === "rw";
    }
}
