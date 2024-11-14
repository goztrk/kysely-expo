import { Kysely } from "kysely";
import React, { createContext, useContext, useState, } from "react";
import { ExpoDialect } from "./driver";
// @todo figure out how to make this a generic context that works everywhere - if that is possible.
const KyselyContext = createContext(null);
// Create the provider component
export default function KyselyProvider({ children, database, onInit, disableForeignKeys, disableStrictModeCreateTable, autoAffinityConversion, columnNameBasedConversion, debug, onError, }) {
    const [kyselyContext, setKyselyContext] = useState();
    if (!database)
        throw new Error("database is required");
    if (columnNameBasedConversion &&
        columnNameBasedConversion.length > 0 &&
        autoAffinityConversion) {
        throw new Error("columnNameBasedConversion and autoAffinityConversion cannot be used together");
    }
    const dialect = new ExpoDialect({
        disableStrictModeCreateTable,
        database,
        debug,
        autoAffinityConversion,
        disableForeignKeys,
        columnNameBasedConversion,
        onError,
    });
    const startDatabase = async () => {
        const database = new Kysely({
            dialect,
        });
        if (onInit) {
            onInit(database);
        }
        setKyselyContext(database);
    };
    if (!kyselyContext) {
        startDatabase();
        return null;
    }
    return (<KyselyContext.Provider value={kyselyContext}>
      {children}
    </KyselyContext.Provider>);
}
// Export the custom hook
function useKysely() {
    return useContext(KyselyContext);
}
export { useKysely };
