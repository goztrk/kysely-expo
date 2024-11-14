import { sql } from "kysely";
export const SQLiteType = {
    Boolean: sql `text`,
    DateTime: sql `text`,
    Number: sql `real`,
    Integer: sql `integer`,
    String: sql `text`,
    Json: sql `text`,
    Any: sql `any`,
    Blob: sql `blob`,
};
