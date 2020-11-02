import { storage, Storage } from './storage';
export interface Config {
  key?: string;
  storage?: Storage;
  blacklist?: string[];
  whitelist?: string[];
  keyPrefix?: string;
}
const config: Config = {
  key: 'model',
  storage,
  blacklist: ['@@dva'],
  whitelist: [],
  keyPrefix: 'persist',
};

export { config };
