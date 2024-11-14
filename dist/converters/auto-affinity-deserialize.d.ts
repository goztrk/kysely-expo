import { OnError } from "../types/error-type";
declare const deserialize: <T>(rows: any[], onError?: OnError) => any[];
export { deserialize };
