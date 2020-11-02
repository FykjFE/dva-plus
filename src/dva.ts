import { create } from 'dva-core';
import { persistEnhancer } from './enhancer';
export function initStore(models: any[], options: any): any {
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
