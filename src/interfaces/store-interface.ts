import { Permission } from "../types/permission-types";
import { StoreResult } from "../types/store-result-types";
import { StoreValue } from "../types/store-value-types";
import { JSONObject } from "../types/json-types";

export interface IStore {
  defaultPolicy: Permission;
  allowedToRead(key: string): boolean;
  allowedToWrite(key: string): boolean;
  read(path: string): StoreResult;
  write(path: string, value: StoreValue): StoreValue;
  writeEntries(entries: JSONObject): void;
  entries(): JSONObject;
}
