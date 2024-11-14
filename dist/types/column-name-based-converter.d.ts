import { ValidTypes } from "../converters/introspection";
export type ColumnNameBasedConverter = {
    type: ValidTypes;
    match: (value: string) => boolean;
};
