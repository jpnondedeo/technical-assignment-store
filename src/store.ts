import { IStore } from "./interfaces/store-interface";
import { Permission } from "./types/permission-types";
import { StoreResult } from "./types/store-result-types";
import { StoreValue } from "./types/store-value-types";
import { JSONObject } from "./types/json-types";
import { Helper } from "./helper/helper";

export class Store implements IStore {
  public defaultPolicy: Permission = "rw";
  private helper: Helper = new Helper();
  [key: string]: any;

  public allowedToRead(key: string): boolean {
    const permission = Reflect.getMetadata(this.helper.PERMISSION_DECORATOR, this, key) || this.defaultPolicy;
    return this.helper.canRead(permission);
  }

  public allowedToWrite(key: string): boolean {
    const permission = Reflect.getMetadata(this.helper.PERMISSION_DECORATOR, this, key) || this.defaultPolicy;
    return this.helper.canWrite(permission);
  }

  public read(path: string): StoreResult {
    const keys = path.split(':');
    let result = this;

    keys.forEach((elem) => {
      if(!result.allowedToRead(elem)){
        throw new Error(`Read permission is denied by: '${elem}'`);
      }
      if (typeof result[elem] === 'function') {
        result = result[elem]();
      } else {
        result = result[elem];
      }
    });

    return result as StoreResult;
  }

  public write(path: string, value: StoreValue): StoreValue {
    if(typeof value === 'object'){
      const store = new Store();
      for (const [key, val] of Object.entries(value as JSONObject)) {
        store.write(key, val as StoreValue);
      }
      value = store;
    }
    const paths = path.split(':'),
        keys = paths.slice(0, paths.length - 1),
        lastKey = paths[paths.length - 1];

    let result = this;

    keys.forEach((elem, index) => {
      if (index === keys.length - 1 && !result.allowedToWrite(elem)){
        throw new Error(`Write permission is denied by: ${lastKey}`);
      }
      if (!result[elem]){
        result[elem] = new Store();
      }

      result = result[elem];
    });

    if(!result.allowedToWrite(lastKey)){
      throw new Error(`Write permission is denied by: ${lastKey}`);
    }

    result[lastKey] = value;
    return value as StoreValue;
  }

  public writeEntries(entries: JSONObject): void {
    for(const [key, value] of Object.entries(entries)){
      this.write(key, value);
    }
  }

  public entries(): JSONObject {
    const entries: JSONObject = {};

    for(const [key, value] of Object.entries(this)){
      if(!this.allowedToRead(key)) continue;
      entries[key] = value;
    }
    return entries;
  }
}
