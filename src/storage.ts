const engine = require('store/src/store-engine');
const storages = [require('store/storages/sessionStorage')];
const plugins = [require('store/plugins/defaults')];
export const storage = engine.createStore(storages, plugins);
export type Storage = typeof storage;
