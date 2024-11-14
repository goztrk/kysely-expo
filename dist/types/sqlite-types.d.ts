import { RawBuilder } from "kysely";
export type RealSQLiteTypes = "text" | "real" | "integer" | "any" | "blob";
export declare const SQLiteType: Readonly<Record<"Boolean" | "DateTime" | "Number" | "Integer" | "String" | "Json" | "Blob" | "Any", RawBuilder<unknown>>>;
