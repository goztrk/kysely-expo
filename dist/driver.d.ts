import { Kysely, DatabaseIntrospector, DialectAdapter, Driver, QueryCompiler, DatabaseConnection, QueryResult, Dialect, CompiledQuery } from "kysely";
import * as SQLite from "expo-sqlite";
import { ExpoDialectConfig } from "./types/expo-dialect-config";
/**
 * Expo dialect for Kysely.
 */
export declare class ExpoDialect implements Dialect {
    config: ExpoDialectConfig;
    constructor(config: ExpoDialectConfig);
    createDriver(): ExpoDriver;
    createQueryCompiler(): QueryCompiler;
    createAdapter(): DialectAdapter;
    createIntrospector(db: Kysely<any>): DatabaseIntrospector;
}
/**
 * Expo driver for Kysely.
 */
export declare class ExpoDriver implements Driver {
    #private;
    constructor(config: ExpoDialectConfig);
    releaseConnection(): Promise<void>;
    init(): Promise<void>;
    acquireConnection(): Promise<ExpoConnection>;
    beginTransaction(connection: ExpoConnection): Promise<void>;
    commitTransaction(connection: ExpoConnection): Promise<void>;
    rollbackTransaction(connection: ExpoConnection): Promise<void>;
    destroy(): Promise<void>;
    getDatabaseRuntimeVersion(): Promise<any>;
}
/**
 * Expo connection for Kysely.
 */
declare class ExpoConnection implements DatabaseConnection {
    sqlite: SQLite.SQLiteDatabase;
    debug: boolean;
    config: ExpoDialectConfig;
    constructor(config: ExpoDialectConfig);
    closeConnection(): Promise<void>;
    executeQuery<R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>>;
    directQuery<T>(query: string): Promise<Array<T>>;
    streamQuery<R>(compiledQuery: CompiledQuery, chunkSize?: number): AsyncIterableIterator<QueryResult<R>>;
}
export {};
