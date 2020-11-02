import { Storage } from './storage';
export interface Config {
    key?: string;
    storage?: Storage;
    blacklist?: string[];
    whitelist?: string[];
    keyPrefix?: string;
}
declare const config: Config;
export default config;
