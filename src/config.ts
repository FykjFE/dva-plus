import { storage } from './storage';

const config = {
  key: 'model',
  storage,
  blacklist: ['@@dva'],
  whitelist: [],
  keyPrefix: 'persist',
};

export default config;
