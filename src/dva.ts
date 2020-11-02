import { create } from 'dva-core';
import { persistEnhancer } from './enhancer';
import { Config } from './config';
export function initStore(models: any[], options: Config): any {
  const app = create({
    extraEnhancers: [
      persistEnhancer({
        ...options,
      }),
    ],
  });
  models.forEach((model: any) => app.model(model));
  app.start();
  return app._store;
}
