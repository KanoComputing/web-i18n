#!/usr/bin/env node
import fg from 'fast-glob';
import * as path from 'path';
import * as fs from 'fs';
import sywac from 'sywac';
import { findI18nKeys } from './find-keys';
import { findLegacyKeys } from './polymer';

(sywac as any)
    .positional('<patterns:array>', {
        paramsDesc: 'List of glob patterns',
    })
    .string('-o --out', {
        desc: 'Create a JSON file and save the results there'
    })
    .stringArray('--functions', {
        desc: 'A list of i18n functions to look for. e.g. _(\'Update\', \'Update\')',
        defaultValue: ['_'],
    })
    .help('-h, --help')
    .version('-v, --version')
    .showHelpByDefault()
    .parseAndExit()
    .then((argv : any) => {
        return findAll(argv.patterns, { i18nFunctions: argv.functions })
            .then((keys) => {
                const data = JSON.stringify(keys, null, '    ');
                if (!argv.out) {
                    console.log(data);
                } else {
                    fs.writeFileSync(path.resolve(argv.out), data, 'utf-8');
                }
            });
    });

export interface IFindAllOptions {
    i18nFunctions? : string[];
}

function findAll(patterns : string[], options : IFindAllOptions = {}) {
    const keys = {};
    return fg<string>(patterns, { ignore: ['**/node_modules/**/*'] })
        .then((files) => {
            files.forEach((f) => {
                const text = fs.readFileSync(path.resolve(f), 'utf-8');
                try {
                    Object.assign(keys, findI18nKeys(text, options.i18nFunctions || ['_']));
                } catch (e) {
                    throw new Error(`Could not extract keys for file ${f}: ${e.message}`);
                }
                Object.assign(keys, findLegacyKeys(text));
            });
            return keys;
            
        });
}

