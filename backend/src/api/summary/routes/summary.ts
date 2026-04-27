/**
 * summary router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::summary.summary' as never, {
  config: {
    create: {
      middlewares: ['api::summary.on-summary-create'],
    },
  },
});
