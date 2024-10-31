import { policy } from '@strapi/utils';
import type { Context } from 'koa';

const { createPolicy } = policy;

export default createPolicy({
  name: 'plugin::liquid-templates.liquid-template.admin',
  handler(ctx: Context, config) {
    const { user } = ctx.state;

    if (!user) {
      return false;
    }

    // TODO: Check for entity permissions instead of role
    const isAdmin = user.roles.some((role) => role.code === 'strapi-super-admin');

    return isAdmin;
  },
});
