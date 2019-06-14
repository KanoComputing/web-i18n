/**
 * Finds all i18n keys and values used in components using the legacy I18nMixin
 * @param {string} code The source code to scan
 */
export function findLegacyKeys(code : string) {
    const found : { [K : string] : string } = {};
    // Use regexp to find legacy I18nMixin style keys
    const reg = /\[\[localize\('(.+?)'(, ?'(.*?)')?\)/g;
    let m;
    while (m = reg.exec(code)) {
        if (m && m[1]) {
            found[m[1]] = m[3] || '';
        }
    }
    return found;
}