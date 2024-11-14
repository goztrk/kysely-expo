import { ColumnNameBasedConverter } from "./column-name-based-converter";
import { OnError } from "./error-type";
export type ExpoDialectConfig = {
    database: string;
    disableForeignKeys?: boolean;
    disableStrictModeCreateTable?: boolean;
    debug?: boolean;
    autoAffinityConversion?: boolean;
    columnNameBasedConversion?: ColumnNameBasedConverter[];
    onError?: OnError;
};
