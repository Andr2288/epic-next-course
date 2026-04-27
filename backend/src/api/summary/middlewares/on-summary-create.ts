/**
 * `on-summary-create` middleware: bind user and deduct one credit
 */

import type { Core } from '@strapi/strapi';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You are not authenticated');
    }

    const availableCredits = user.credits;
    if ((availableCredits ?? 0) < 1) {
      return ctx.unauthorized('You do not have enough credits.');
    }

    const body = ctx.request.body as { data?: Record<string, unknown> };
    const modifiedBody = {
      ...body,
      data: {
        ...(body.data ?? {}),
        userId: String(user.documentId),
      },
    };
    ctx.request.body = modifiedBody;

    await next();

    try {
      await strapi.documents('plugin::users-permissions.user').update({
        documentId: user.documentId,
        data: {
          credits: (availableCredits ?? 0) - 1,
        },
      });
    } catch (error) {
      strapi.log.error('on-summary-create: failed to update user credits', error);
      return ctx.badRequest('Error updating user credits');
    }
  };
};
