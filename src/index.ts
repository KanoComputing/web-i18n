export interface IMessageDB {
    [k : string] : string;
};

// Detected language
let lang : string|null;
// Language defined in the URL
let urlLang : string|null;
// Default language
let defaultLang : string = 'en-US';
let resolvedLang : string = defaultLang;
let didResolveLang = false;

// Stores all messages
const db : IMessageDB = {};

// Defines all the supported languages. This is used to use the fallback language if the browser
// language is not supported
const supportedLanguages = ['en-US'];

const urlLangReg = /lang=(.{2}-.{2})/;

/**
 * Read the query url params to see if the user requested a specific language
 */
function getUrlLang() {
    const result = window.location.href.match(urlLangReg);
    if (!result) {
        return null;
    }
    return result[1];
}

/**
 * Detect the browser language. Will use the navigator API to get the user language.
 * This can be overriden by using a url query value.
 * If the detected of choosen langauge is not in the list of supported languages,
 * it will use the default one
 */
function resolveLang() {
    if (didResolveLang) {
        return;
    }
    urlLang = getUrlLang();

    lang = window.navigator.languages ? window.navigator.languages[0] : null;
    lang = lang || window.navigator.language
                || (window.navigator as any).browserLanguage
                || (window.navigator as any).userLanguage;
    
    if (!lang || supportedLanguages.indexOf(lang) === -1) {
        lang = defaultLang;
    }
    resolvedLang = urlLang || lang || defaultLang;
}

/**
 * Set the default language for this session. The default language will be used if the detected
 * language is not supported
 */
export function setDefaultLang(lang : string) {
    defaultLang = lang;
}

/**
 * Get the detected language code.
 * This will try to detect the language the first time it runs
 */
export function getLang() {
    resolveLang();
    return resolvedLang;
}

/**
 * Returns a localized string based on a provided id and a fallback value
 */
export function localize(key : string, fallback? : string) {
    return db[key] || fallback;
}

// Alias for localize
export const _ = localize;

/**
 * Add a set of messages in the db
 */
export function addMessages(msgs : IMessageDB) {
    Object.assign(db, msgs);
}

/**
 * Fetch a JSON file and load the results in the db
 */
export function loadMessages(src : string) {
    return fetch(src)
        .then(r => r.json())
        .then(msgs => addMessages(msgs));
}

/**
 * Declare a language as supported. This must happen before the first ever resolve to be taken
 * in account
 */
export function addSupportedLanguage(lang : string) {
    if (didResolveLang) {
        throw new Error('Could not add a supported language: The browser language was already detected. Make sure you register all supported languages before using the getLang function');
    }
    supportedLanguages.push(lang);
}