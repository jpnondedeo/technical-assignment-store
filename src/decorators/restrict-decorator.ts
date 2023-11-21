import { Permission } from "../types/permission-types";
import 'reflect-metadata';
import { Helper } from "../helper/helper";

export function Restrict(permission: Permission): any {
    const helper: Helper = new Helper();

    return function (target: any, key: string) {
        Reflect.defineMetadata(helper.PERMISSION_DECORATOR, permission, target, key);
    };
}
