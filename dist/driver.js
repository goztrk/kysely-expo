var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExpoDriver_connectionMutex, _ExpoDriver_connection, _ConnectionMutex_promise, _ConnectionMutex_resolve;
import { SqliteIntrospector, SqliteQueryCompiler, SqliteAdapter, } from "kysely";
import * as SQLite from "expo-sqlite";
import { deserialize as autoAffinityDeserialize } from "./converters/auto-affinity-deserialize";
import { deserialize as nameBasedDeserialize } from "./converters/column-based-deserialize";
import { serialize } from "./converters/serialize";
/**
 * Expo dialect for Kysely.
 */
export class ExpoDialect {
    constructor(config) {
        this.config = config;
    }
    createDriver() {
        return new ExpoDriver(this.config);
    }
    createQueryCompiler() {
        return new SqliteQueryCompiler();
    }
    createAdapter() {
        return new SqliteAdapter();
    }
    createIntrospector(db) {
        return new SqliteIntrospector(db);
    }
}
/**
 * Expo driver for Kysely.
 */
export class ExpoDriver {
    constructor(config) {
        _ExpoDriver_connectionMutex.set(this, new ConnectionMutex());
        _ExpoDriver_connection.set(this, void 0);
        __classPrivateFieldSet(this, _ExpoDriver_connection, new ExpoConnection(config), "f");
    }
    async releaseConnection() {
        __classPrivateFieldGet(this, _ExpoDriver_connectionMutex, "f").unlock();
    }
    async init() { }
    async acquireConnection() {
        await __classPrivateFieldGet(this, _ExpoDriver_connectionMutex, "f").lock();
        return __classPrivateFieldGet(this, _ExpoDriver_connection, "f");
    }
    async beginTransaction(connection) {
        await connection.directQuery("begin transaction");
    }
    async commitTransaction(connection) {
        await connection.directQuery("commit");
    }
    async rollbackTransaction(connection) {
        await connection.directQuery("rollback");
    }
    async destroy() {
        __classPrivateFieldGet(this, _ExpoDriver_connection, "f").closeConnection();
    }
    async getDatabaseRuntimeVersion() {
        try {
            const res = await __classPrivateFieldGet(this, _ExpoDriver_connection, "f").directQuery("select sqlite_version() as version;");
            //@ts-ignore
            return res[0].version;
        }
        catch (e) {
            console.error(e);
            return "unknown";
        }
    }
}
_ExpoDriver_connectionMutex = new WeakMap(), _ExpoDriver_connection = new WeakMap();
/**
 * Expo connection for Kysely.
 */
class ExpoConnection {
    constructor(config) {
        var _a;
        this.sqlite = SQLite.openDatabaseSync(config.database);
        this.debug = (_a = config.debug) !== null && _a !== void 0 ? _a : false;
        this.config = config;
        if (this.config.disableForeignKeys) {
            this.sqlite.execSync("PRAGMA foreign_keys = OFF;");
        }
        else {
            this.sqlite.execSync("PRAGMA foreign_keys = ON;");
        }
    }
    async closeConnection() {
        return this.sqlite.closeAsync();
    }
    async executeQuery(compiledQuery) {
        let { sql, parameters, query } = compiledQuery;
        // Kysely uses varchar(255) as the default string type for migrations which is not supported by STRICT mode.
        if (query.kind === "CreateTableNode" &&
            !sql.includes("kysely_migration") &&
            !sql.includes("kysely_migration_lock") &&
            !sql.includes("STRICT") &&
            !this.config.disableStrictModeCreateTable) {
            sql += " STRICT";
        }
        const readonly = query.kind === "SelectQueryNode" || query.kind === "RawNode";
        const transformedParameters = serialize([...parameters]);
        if (this.debug) {
            console.debug(`${query.kind}${readonly ? " (readonly)" : ""}: ${sql}`);
        }
        if (readonly) {
            let res = await this.sqlite.getAllAsync(sql, transformedParameters);
            const skip = query.kind === "SelectQueryNode" && sql.includes("pragma_table_info"); // @todo: fix this hack - find a better way
            if (this.config.columnNameBasedConversion && !skip) {
                if (this.debug)
                    console.log("processing nameBasedDeserialize");
                return {
                    rows: nameBasedDeserialize(res, this.config.columnNameBasedConversion),
                };
            }
            if (this.config.autoAffinityConversion && !skip) {
                if (this.debug)
                    console.log("processing autoAffinityDeserialize");
                return {
                    rows: autoAffinityDeserialize(res, this.config.onError),
                };
            }
            return {
                rows: res,
            };
        }
        else {
            const res = await this.sqlite.runAsync(sql, transformedParameters);
            const queryResult = {
                numUpdatedOrDeletedRows: BigInt(res.changes),
                numAffectedRows: BigInt(res.changes),
                insertId: BigInt(res.lastInsertRowId),
                rows: [],
            };
            if (this.debug)
                console.log("queryResult", queryResult);
            return queryResult;
        }
    }
    async directQuery(query) {
        return await this.sqlite.getAllAsync(query, []);
    }
    streamQuery(compiledQuery, chunkSize) {
        const { sql, parameters, query } = compiledQuery;
        throw new Error("Expo SQLite driver does not support iterate on prepared statements");
    }
}
class ConnectionMutex {
    constructor() {
        _ConnectionMutex_promise.set(this, void 0);
        _ConnectionMutex_resolve.set(this, void 0);
    }
    async lock() {
        while (__classPrivateFieldGet(this, _ConnectionMutex_promise, "f")) {
            await __classPrivateFieldGet(this, _ConnectionMutex_promise, "f");
        }
        __classPrivateFieldSet(this, _ConnectionMutex_promise, new Promise((resolve) => {
            __classPrivateFieldSet(this, _ConnectionMutex_resolve, resolve, "f");
        }), "f");
    }
    unlock() {
        const resolve = __classPrivateFieldGet(this, _ConnectionMutex_resolve, "f");
        __classPrivateFieldSet(this, _ConnectionMutex_promise, undefined, "f");
        __classPrivateFieldSet(this, _ConnectionMutex_resolve, undefined, "f");
        resolve === null || resolve === void 0 ? void 0 : resolve();
    }
}
_ConnectionMutex_promise = new WeakMap(), _ConnectionMutex_resolve = new WeakMap();
