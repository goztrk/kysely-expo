import { OnError } from "../types/error-type";
declare function isStringIso8601(date: string): boolean;
declare function isStringJson(value: string): boolean;
declare function isStringArray(value: string): boolean;
declare function isStringBoolean(value: string): boolean;
declare function isUint8Array(value: unknown): value is Uint8Array;
declare function isBigInt(value: unknown): value is bigint;
declare const safeParse: (json: any, onError?: OnError) => any;
export { safeParse, isStringIso8601, isStringArray, isStringJson, isStringBoolean, isUint8Array, isBigInt, };
