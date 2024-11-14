export default class ExpoMigrationProvider {
    constructor(props) {
        this.migrations = props.migrations;
    }
    getMigrations() {
        return Promise.resolve(this.migrations);
    }
}
