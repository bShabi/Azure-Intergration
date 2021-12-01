const crypto = require('crypto');
const _ = require('lodash');
const grant = require('grant-koa');
const { sanitizeEntity } = require('strapi-utils');
const sendMail = require('../../../mailer');
const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];
const accountSid = 'AC6278c1d39b3255a60904be7878222b7d';
const authToken = '2af57c1d37cb0b1491af9f3d812353c3';
const client = require('twilio')(accountSid, authToken);

const msal = require('@azure/msal-node');
const winLogger = require('../../../winLogger');

const frontendUrl =
'https://portal-ictbitt-frontend.herokuapp.com/redirect';
// 'http://localhost:3000/redirect';

// const config = {
//   auth: {
//     clientId: '6f657c97-2689-4a7e-a469-d7657955ed0a',
//     authority:
//       'https://login.microsoftonline.com/36c3adf0-e2f9-427e-9023-cad65e418c1f',
//     clientSecret: '2xL7Q.b2L6wH_x-OSLmL1Z~LL5~2~9y6iO',
//   },
//   system: {
//     loggerOptions: {
//       loggerCallback(loglevel, message, containsPii) {
//         console.log(message);
//       },
//       piiLoggingEnabled: false,
//       logLevel: msal.LogLevel.Verbose,
//     },
//   },
// };

// Create msal application object

/**
 *
 */
const config = {
  auth: {
    clientId: '6f934409-1787-4eee-b6cd-1090f53746a6',
    authority:
      'https://login.microsoftonline.com/e9cb89fb-61e3-4eb7-84e1-5faa18a66971',
    clientSecret: '~pxJf_-M5kFnF2fHnM~RH9I~tsr-wQs5l8',
    // clientId: '6f657c97-2689-4a7e-a469-d7657955ed0a',
    // authority:
    //   'https://login.microsoftonline.com/36c3adf0-e2f9-427e-9023-cad65e418c1f',
    // clientSecret: '2xL7Q.b2L6wH_x-OSLmL1Z~LL5~2~9y6iO',
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

const cca = new msal.ConfidentialClientApplication(config);

module.exports = {
  async phoneotpSender(phone, OTP, ctx) {
    try {
      client.messages
        .create({
          body: `Your Login Verification Code is ${OTP}`,
          // from: "+18783484702",//jsconfig
          // to: `+88${phone}`,//jsconfig

          from: '+15732600885',
          to: `+972${phone}`, //
        })
        .then((message) => {
          console.log('Message sent to ', message.sid);
        })
        .done((err) => {
          if (err) {
            console.log(err);
          }
        });
      ctx.send({ message: 'OTP send  to client ' });
    } catch (error) {
      console.log(error);
    }
  },

  async otpToPhone(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }
      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your username or your e-mail.',
          })
        );
      }

      if (!params.phone) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your Phone Number',
          })
        );
      }
      const query = { provider };
      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne(query);
      // console.log(user);
      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Please Provide your correct Username and Password',
          })
        );
      }
      if (
        _.get(await store.get({ key: 'advanced' }), 'email_confirmation') &&
        user.confirmed !== true
      ) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.confirmed',
            message: 'Your account email is not confirmed',
          })
        );
      }

      if (user.blocked === true) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.blocked',
            message: 'Your account has been blocked by an administrator',
          })
        );
      }

      if (false) {
      } else {
        await strapi
          .query('user', 'users-permissions')
          .update({ id: user.id }, { otp: 0, authToken: {} });
        const callback = () => {
          // console.log(JSON.parse(authSign));
          ctx.send({
            message:
              'A verification Code has been send in your mail , Please check !',
          });
        };
        // creating OTP to save in user profile and send in mail
        let OTP = Math.floor(100000 + Math.random() * 900000);
        // updateing user with OTP
        await strapi
          .query('user', 'users-permissions')
          .update({ id: user.id }, { otp: OTP });
        this.phoneotpSender(params.phone, OTP, ctx);
      }
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'provider.disabled',
            message: 'This provider is disabled.',
          })
        );
      }

      // Connect the user with the third-party provider.
      let user;
      let error;
      try {
        [user, error] = await strapi.plugins[
          'users-permissions'
        ].services.providers.connect(provider, ctx.query);
      } catch ([user, error]) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      if (!user) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    }
  },

  async callback(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }
      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your username or your e-mail.',
          })
        );
      }

      const query = { provider };
      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne(query);
      // console.log(user);
      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Please Provide your correct Username and Password',
          })
        );
      }
      if (
        _.get(await store.get({ key: 'advanced' }), 'email_confirmation') &&
        user.confirmed !== true
      ) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.confirmed',
            message: 'Your account email is not confirmed',
          })
        );
      }

      if (user.blocked === true) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.blocked',
            message: 'Your account has been blocked by an administrator',
          })
        );
      }
      console.log('Password check disabled here ');

      if (false) {
        // if (!validPassword) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Password Invalid !',
          })
        );
      } else {
        await strapi
          .query('user', 'users-permissions')
          .update({ id: user.id }, { otp: 0, authToken: {} });
        const callback = () => {
          // console.log(JSON.parse(authSign));
          ctx.send({
            message:
              'A verification Code has been send in your mail , Please check !',
          });
        };
        // creating OTP to save in user profile and send in mail
        let OTP = Math.floor(100000 + Math.random() * 900000);
        // updateing user with OTP
        await strapi
          .query('user', 'users-permissions')
          .update({ id: user.id }, { otp: OTP });
        // sendMail(
        //   'strapinoreply@gmail.com',
        //   params.identifier,
        //   'Verification Code  ',
        //   `Your  Verification Code is  :${OTP}`,
        //   callback
        // );
      }
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'provider.disabled',
            message: 'This provider is disabled.',
          })
        );
      }

      // Connect the user with the third-party provider.
      let user;
      let error;
      try {
        [user, error] = await strapi.plugins[
          'users-permissions'
        ].services.providers.connect(provider, ctx.query);
      } catch ([user, error]) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      if (!user) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    }
  },

  async otpConfirmation(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;
    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your username or your e-mail.',
          })
        );
      }
      const query = { provider };
      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);
      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne(query);
      // console.log(user);
      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Your session is Expired ',
          })
        );
      }

      const authSign = {
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
        message: 'You are logged in ',
      };
      // console.log("Getting code ");
      const tokenRequest = {
        code: params.code,
        scopes: ['https://management.azure.com/.default'],
        //  scopes: ["user.read,user_impersonation"],
        redirectUri: frontendUrl,
      };

      cca
        .acquireTokenByCode(tokenRequest)
        .then(async (response) => {
          let access_token_response = response.accessToken;
          await strapi.query('user', 'users-permissions').update(
            { id: user.id },
            {
              azureToken: access_token_response,
              azureAccount: response.account,
            }
          );
        })
        .catch((error) => {
          return ctx.send(error);
          console.log(error);
        });
      return ctx.send(authSign);
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'provider.disabled',
            message: 'This provider is disabled.',
          })
        );
      }

      // Connect the user with the third-party provider.
      let user;
      let error;
      try {
        [user, error] = await strapi.plugins[
          'users-permissions'
        ].services.providers.connect(provider, ctx.query);
      } catch ([user, error]) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      if (!user) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    }
  },

  async otpValidation(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;
    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your username or your e-mail.',
          })
        );
      }

      // The OTP is Required
      if (!params.otp) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.password.provide',
            message: 'Please provide your OTP.',
          })
        );
      }
      const query = { provider };
      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);
      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne(query);
      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Your session is Expired ',
          })
        );
      }
      if (user.otp == params.otp) {
        console.log('Otp Matched');

        const authSign = {
          jwt: strapi.plugins['users-permissions'].services.jwt.issue({
            id: user.id,
          }),
          user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
            model: strapi.query('user', 'users-permissions').model,
          }),
          message: 'You are logged in ',
        };
        ctx.send(authSign);
      } else {
        console.log('Otp Invalid');
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Your Provided OTP Does not  matched ! ',
          })
        );
      }
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'provider.disabled',
            message: 'This provider is disabled.',
          })
        );
      }

      // Connect the user with the third-party provider.
      let user;
      let error;
      try {
        [user, error] = await strapi.plugins[
          'users-permissions'
        ].services.providers.connect(provider, ctx.query);
      } catch ([user, error]) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      if (!user) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    }
  },
  async verifyUser(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your username or your e-mail.',
          })
        );
      }
      const query = { provider };
      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);
      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne(query);
      // console.log(user);
      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Your session is Expired ',
          })
        );
      }
      return ctx.send(user);
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'provider.disabled',
            message: 'This provider is disabled.',
          })
        );
      }

      // Connect the user with the third-party provider.
      let user;
      let error;
      try {
        [user, error] = await strapi.plugins[
          'users-permissions'
        ].services.providers.connect(provider, ctx.query);
      } catch ([user, error]) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      if (!user) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    }
  },

  async sendOtpToPhone(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your username or your e-mail.',
          })
        );
      }

      // The password is required.
      // if (!params.password) {
      //   return ctx.badRequest(
      //     null,
      //     formatError({
      //       id: "Auth.form.error.password.provide",
      //       message: "Please provide your password.",
      //     })
      //   );
      // }

      const query = { provider };

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne(query);
      console.log('User information', user);
      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Please Provide your correct Username and Password',
          })
        );
      }
      if (
        _.get(await store.get({ key: 'advanced' }), 'email_confirmation') &&
        user.confirmed !== true
      ) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.confirmed',
            message: 'Your account email is not confirmed',
          })
        );
      }

      if (user.blocked === true) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.blocked',
            message: 'Your account has been blocked by an administrator',
          })
        );
      }

      // The user never authenticated with the `local` provider.
      // if (!user.password) {
      //   return ctx.badRequest(
      //     null,
      //     formatError({
      //       id: "Auth.form.error.password.local",
      //       message:
      //         "This user never set a local password, please login with the provider used during account creation.",
      //     })
      //   );
      // }

      const validPassword = await strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(params.password, user.password);

      const callback = () => {
        // console.log(JSON.parse(authSign));
        ctx.send({
          message:
            'A verification Code has been send in your Phone, Please check !',
        });
      };
      // creating OTP to save in user profile and send in mail
      let OTP = Math.floor(100000 + Math.random() * 900000);
      // updateing user with OTP
      await strapi
        .query('user', 'users-permissions')
        .update({ id: user.id }, { otp: OTP });
      // sendMail(
      //   "strapinoreply@gmail.com",
      //   params.identifier,
      //   "Verification Code  ",
      //   `Your  Verification Code is  :${OTP}`,
      //   callback
      // );
      client.messages
        .create({
          body: `Your Login Verification Code is ${OTP}`,
          from: '+15407798837',
          to: `+97${user.phone}`,
        })
        .then((message) => {
          console.log(message.sid);
        })
        .done((err) => {
          if (err) {
            console.log(err);
          }
        });
      callback();

      // if (!validPassword) {
      //   return ctx.badRequest(
      //     null,
      //     formatError({
      //       id: "Auth.form.error.invalid",
      //       message: "Password Invalid !",
      //     })
      //   );
      // } else {
      //   await strapi
      //     .query("user", "users-permissions")
      //     .update({ id: user.id }, { otp: 0 });
      //   // Generating  auth token and adding user profile obj   as token to send  save in user profile , while user  will submit otp , this  object will go as token from database  ,
      //   const callback = () => {
      //     // console.log(JSON.parse(authSign));
      //     ctx.send({
      //       message:
      //         "A verification Code has been send in your Phone, Please check !",
      //     });
      //   };
      //   // creating OTP to save in user profile and send in mail
      //   let OTP = Math.floor(100000 + Math.random() * 900000);
      //   // updateing user with OTP
      //   await strapi
      //     .query("user", "users-permissions")
      //     .update({ id: user.id }, { otp: OTP });
      //   // sendMail(
      //   //   "strapinoreply@gmail.com",
      //   //   params.identifier,
      //   //   "Verification Code  ",
      //   //   `Your  Verification Code is  :${OTP}`,
      //   //   callback
      //   // );
      //   client.messages
      //     .create({
      //       body: `Your Login Verification Code is ${OTP}`,
      //       from: "+15407798837",
      //       to: `+97${user.phone}`,
      //     })
      //     .then((message) => {
      //       console.log(message.sid);
      //     })
      //     .done((err) => {
      //       if (err) {
      //         console.log(err);
      //       }
      //     });
      //   callback();
      // }
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'provider.disabled',
            message: 'This provider is disabled.',
          })
        );
      }

      // Connect the user with the third-party provider.
      let user;
      let error;
      try {
        [user, error] = await strapi.plugins[
          'users-permissions'
        ].services.providers.connect(provider, ctx.query);
      } catch ([user, error]) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      if (!user) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    }
  },

  async register(ctx) {
    const pluginStore = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const settings = await pluginStore.get({
      key: 'advanced',
    });

    if (!settings.allow_register) {
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.advanced.allow_register',
          message: 'Register action is currently disabled.',
        })
      );
    }

    const params = {
      ..._.omit(ctx.request.body, [
        'confirmed',
        'confirmationToken',
        'resetPasswordToken',
      ]),
      provider: 'local',
    };

    // Email is required.
    if (!params.email) {
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.email.provide',
          message: 'Please provide your email.',
        })
      );
    }

    // Throw an error if the password selected by the user
    // contains more than three times the symbol '$'.
    if (
      strapi.plugins['users-permissions'].services.user.isHashed(
        params.password
      )
    ) {
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.password.format',
          message:
            'Your password cannot contain more than three times the symbol `$`.',
        })
      );
    }

    const role = await strapi
      .query('role', 'users-permissions')
      .findOne({ type: settings.default_role }, []);

    if (!role) {
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.role.notFound',
          message: 'Impossible to find the default role.',
        })
      );
    }

    // Check if the provided email is valid or not.
    const isEmail = emailRegExp.test(params.email);

    if (isEmail) {
      params.email = params.email.toLowerCase();
    } else {
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.email.format',
          message: 'Please provide valid email address.',
        })
      );
    }

    params.role = role.id;
    params.password = await strapi.plugins[
      'users-permissions'
    ].services.user.hashPassword(params);

    const user = await strapi.query('user', 'users-permissions').findOne({
      email: params.email,
    });

    try {
      if (!settings.email_confirmation) {
        params.confirmed = true;
      }

      const user = await strapi
        .query('user', 'users-permissions')
        .create(params);
      const sanitizedUser = sanitizeEntity(user, {
        model: strapi.query('user', 'users-permissions').model,
      });

      if (settings.email_confirmation) {
        try {
          await strapi.plugins[
            'users-permissions'
          ].services.user.sendConfirmationEmail(user);
        } catch (err) {
          return ctx.badRequest(null, err);
        }

        return ctx.send({ user: sanitizedUser });
      }

      const jwt = strapi.plugins['users-permissions'].services.jwt.issue(
        _.pick(user, ['id'])
      );

      return ctx.send({
        jwt,
        user: sanitizedUser,
      });
    } catch (err) {
      console.log(err);
      const adminError = _.includes(err.message, 'username')
        ? {
          id: 'Auth.form.error.username.taken',
          message: 'Username already taken',
        }
        : { id: 'Auth.form.error.email.taken', message: 'Email already taken' };

      ctx.badRequest(null, formatError(adminError));
    }
  },

  async checkUserExist(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your identifier or your e-mail.',
          })
        );
      }

      const query = { provider };

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne(query);
      ctx.send(user);
    }
  },
  async loginWithAzure(ctx) {
    const authCodeUrlParameters = {
      scopes: ['user.read'],
      redirectUri: frontendUrl,
    };

    // get url to sign user in and consent to scopes needed for application
    cca
      .getAuthCodeUrl(authCodeUrlParameters)
      .then((response) => {
        ctx.redirect(response);
      })
      .catch((error) => {
        ctx.send({
          error,
        });
      });
  },
  async redirectURL(ctx) {
    console.log(ctx);
    let code = ctx.request.url.split('code=');
    console.log(code[1]);
    const tokenRequest = {
      code: code[1],
      scopes: ['user.read'],
      redirectUri: frontendUrl,
    };
    cca
      .acquireTokenByCode(tokenRequest)
      .then((response) => {
        console.log('\nResponse: \n:', response);
        ctx.send({
          response,
        });
        winLogger(
          'User Action',
          'User',
          'User Just logged  in  to our plateform !! '
        );
        // res.sendStatus(200);
      })
      .catch((error) => {
        console.log(error);
        ctx.send({
          error,
        });
        // res.status(500).send(error);
      });
  },
};
