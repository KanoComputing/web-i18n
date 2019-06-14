# Web i18n

Provide a simple message DB managment and localization function.

## Usage

Add to your project using `yarn add @kano/i18n`;

Im port and use as follow

```js
import { _, setDefaultLang, addSupportedLanguage } from '@kano/i18n/index.js';

// Add the supported langauges before using any other functions
addSupportedLanguage('de-DE');
// Set the default language, will be used if the browser is configured to use a non supported language
setDefaultLang('en-GB');

// Use the _ function to resolve all messages. Provide a fallback that will be used to generate
// the default language file
const message = _('UPDATE_NOW', 'Update now');

```

## Generating the language files

Once all the strings in your codebase has been tokenized using the `_` function, you can generate a language file using the provided tool.


Example:
```
i18n-generator ./code/**/*.js
```

Will print all keys and their default values from the codebase. Run `i18n-generator --help` to see all options
