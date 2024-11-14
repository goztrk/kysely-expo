function isStringIso8601(date) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(date);
}
function isStringJson(value) {
    try {
        const result = JSON.parse(value);
        return result && typeof result === "object";
    }
    catch {
        return false;
    }
}
function isStringArray(value) {
    try {
        const result = JSON.parse(value);
        return result && Array.isArray(result);
    }
    catch {
        return false;
    }
}
function isStringBoolean(value) {
    return value === "true" || value === "false";
}
function isUint8Array(value) {
    return value instanceof Uint8Array;
}
function isBigInt(value) {
    return typeof value === "bigint";
}
const safeParse = (json, onError) => {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        onError && onError(`Failed to parse value: ${json}`, e);
        return undefined;
    }
};
export { safeParse, isStringIso8601, isStringArray, isStringJson, isStringBoolean, isUint8Array, isBigInt, };
