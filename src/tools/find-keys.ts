import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import * as dynamicImport from 'acorn-dynamic-import';

const DYNAMIC_IMPORT_BASEVISITOR = Object.assign({}, walk.base, {
    [dynamicImport.DynamicImportKey]: () => { },
});

/**
 * Parse the code and find all the i18n keys declared using the _() function
 * @param {string} code The source code to scan
 */
export function findI18nKeys(code : string, i18nFunctions : string[]) {
    const found : { [K : string] : string } = {};
    const program = acorn.Parser
        .extend(dynamicImport.default as any)
        .parse(code, { sourceType: 'module' });
    walk.simple(
        program,
        {
            CallExpression(node : any) {
                // The function call if for a i18n function and the first arg is a literal
                if (i18nFunctions.indexOf(node.callee.name) !== -1) {
                    found[node.arguments[0].value] = node.arguments[1] ? node.arguments[1].value : '';
                }
            },
        },
        DYNAMIC_IMPORT_BASEVISITOR,
    );
    return found;
}
