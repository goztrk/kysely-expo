import { ColumnNameBasedConverter } from "../types/column-name-based-converter";
import { OnError } from "../types/error-type";
declare const deserialize: <T>(rows: any[], columnBasedConverter: ColumnNameBasedConverter[], onError?: OnError) => any[];
export { deserialize };
