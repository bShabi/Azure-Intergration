'use strict';

const logMailer = require("../../../logMailer");


module.exports = {
  async create(ctx) {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;
    if (!params.sender || !params.receiver || !params.subject || !params.body) {
      return ctx.badRequest({
        error: "Please provide Sender Mail ID , Receiver mail ID , Subject and  Body "
      })
    }
    logMailer(params.sender, params.receiver, params.subject, params.body)
    const mailLog = await strapi.services.emails.create(params)
    return ctx.send(mailLog)
  }
};
