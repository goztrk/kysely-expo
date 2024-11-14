import { Migration, MigrationProvider } from "kysely";
type ExpoMigrationProviderProps = {
    migrations: Record<string, Migration>;
};
export default class ExpoMigrationProvider implements MigrationProvider {
    migrations: Record<string, Migration>;
    constructor(props: ExpoMigrationProviderProps);
    getMigrations(): Promise<Record<string, Migration>>;
}
export {};
