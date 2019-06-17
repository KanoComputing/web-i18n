import { _ } from './index.js';

type Constructor<T> = new(...args: any[]) => T;

/**
 * A Polymer mixin adding the localize method to use in templates
 */
export function I18nMixin<T extends Constructor<any>>(base : T) {
    return class extends base {
        localize(key : string, fallback? : string) {
            return _(key, fallback);
        }
    };    
}
