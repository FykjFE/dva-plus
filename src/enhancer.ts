import _ from 'lodash';
import { config, Config } from './config';

let lastState = {};
export interface PersistEnhancer {
  (opts?: Config): any;
}
const persistEnhancer: PersistEnhancer = (opts = {}) => {
  const { key, keyPrefix, blacklist, whitelist, storage } = {
    ...config,
    ...opts,
  };
  const defaultState = storage.get(`${keyPrefix}:${key}`);
  return (createStore: any) => (reducer: any, initialState = defaultState, enhancer: any) => {
    const store = createStore(reducer, { ...initialState, ...defaultState }, enhancer);
    function dispatch(action: any) {
      const res = store.dispatch(action);
      let thatState = store.getState();
      if (_.isArray(whitelist) && !_.isEmpty(whitelist)) {
        thatState = _.pick(thatState, whitelist);
      } else if (_.isArray(blacklist) && !_.isEmpty(blacklist)) {
        thatState = _.omit(thatState, blacklist);
      }
      if (!_.isEqual(lastState, thatState)) {
        lastState = _.merge(lastState, thatState);
        storage.set(`${keyPrefix}:${key}`, lastState);
      }
      return res;
    }
    return { ...store, dispatch };
  };
};
export { persistEnhancer };
