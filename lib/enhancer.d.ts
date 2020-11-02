import { Config } from './config';
export interface PersistEnhancer {
    (opts?: Config): any;
}
declare const persistEnhancer: PersistEnhancer;
export { persistEnhancer };
