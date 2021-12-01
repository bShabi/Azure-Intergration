'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findMember(ctx) {
    let entities = await strapi.services.avatar.find();
    let sanitizedEntity = entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.avatar })
    );
    console.log(user.id);
    let filtered = sanitizedEntity.filter((el) => el.userID == user.id);
    return ctx.send(filtered);
  },

  async updateLastLogin(ctx) {
    let entities = await strapi.services.avatar.find();
    let sanitizedEntity = entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.avatar })
    );
    console.log(user.id);
    let filtered = sanitizedEntity.filter((el) => el.userID == user.id);
    return ctx.send(filtered);
  },
};
