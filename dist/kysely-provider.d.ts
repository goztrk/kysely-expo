import { Kysely } from "kysely";
import React, { PropsWithChildren } from "react";
import { ExpoDialectConfig } from "./types/expo-dialect-config";
export default function KyselyProvider<T>({ children, database, onInit, disableForeignKeys, disableStrictModeCreateTable, autoAffinityConversion, columnNameBasedConversion, debug, onError, }: PropsWithChildren & ExpoDialectConfig & {
    onInit?: (kysely: Kysely<T>) => void;
}): React.JSX.Element | null;
declare function useKysely<T>(): Kysely<T>;
export { useKysely };
