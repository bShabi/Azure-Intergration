const crypto = require('crypto');
const _ = require('lodash');
const grant = require('grant-koa');
const { sanitizeEntity } = require('strapi-utils');
const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

const { getService } = require('../util');
var request = require('request');
const logMailer = require('../../../logMailer');

module.exports = {
  // Get all  subscription
  async findMySubscription(ctx) {
    const userInfo = getService('user').sanitizeUser(ctx.state.user);

    var options = {
      method: 'GET',
      url: 'https://management.azure.com/subscriptions?api-version=2020-01-01',
      headers: {
        Authorization: 'Bearer ' + userInfo.azureToken,
      },
    };
    let subscriptions = await request(options);
    ctx.send(subscriptions);
  },
  // Rename subscription
  async renameSubscription(ctx) {
    const userInfo = getService('user').sanitizeUser(ctx.state.user);
    const params = ctx.request.body;
    console.log('params renameSubscription ====> ', params);
    if (!params.sub_rename) {
      return ctx.badRequest({ message: 'sub_rename Name is required ! ' });
    }
    if (!params.sub_id) {
      return ctx.badRequest({ message: 'sub_id ID is required ! ' });
    }
    // let sub_rename = "AUTHSUBSCRI";
    // let sub_id = "2071da9f-bf6f-4e23-a54f-8a064ad9d447"; //subscriptionToEdit

    let sub_rename = params.sub_rename;
    let sub_id = params.sub_id;
    console.log('Access token ', userInfo.azureToken);
    var options = {
      method: 'POST',
      url:
        'https://management.azure.com/subscriptions/' +
        sub_id +
        '/providers/Microsoft.Subscription/rename?api-version=2019-03-01-preview',
      headers: {
        Authorization: 'Bearer ' + userInfo.azureToken,
      },
      body: JSON.stringify({
        SubscriptionName: sub_rename,
      }),
    };
    let update = await request(options);
    console.log(update);
    ctx.send(update);
    // logMailer()
  },

  //  Add tag to subscription
  async addTagToSubscription(ctx) {
    const userInfo = getService('user').sanitizeUser(ctx.state.user);
    const params = ctx.request.body;
    console.log('params addTagToSubscription ====> ', params);
    if (!params.sub_id) {
      return ctx.badRequest({ message: 'sub_name Name is required ! ' });
    }
    // let sub_rename = "AUTHSUBSCRI";
    // let sub_id = "2071da9f-bf6f-4e23-a54f-8a064ad9d447"; //subscriptionToEdit
    var options = {
      method: 'PUT',
      url:
        'https://management.azure.com/subscriptions/' +
        params.sub_id +
        '/providers/Microsoft.Resources/tags/default?api-version=2021-04-01',
      headers: {
        Authorization: 'Bearer ' + userInfo.azureToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          tags: {
            envierment: params.envierment,
            scheduling: params.scheduling,
            period: params.period,
            portalName: params.portalName,
          },
        },
      }),
    };
    console.log('options12', options);
    let result = await request(options);
    ctx.send(result);
  },

  //  get budget list
  async budgetList(ctx) {
    const userInfo = getService('user').sanitizeUser(ctx.state.user);
    const params = ctx.request.body;
    console.log('params addTagToSubscription', addTagToSubscription);
    if (!params.sub_id) {
      return ctx.badRequest({ message: 'sub_id required ' });
    }
    var options = {
      method: 'GET',
      url:
        'https://management.azure.com/subscriptions/' +
        params.sub_id +
        '/providers/Microsoft.Consumption/budgets?api-version=2019-10-01',
      headers: {
        Authorization: 'Bearer ' + userInfo.azureToken,
      },
    };
    let result = await request(options);
    ctx.send(result);
  },
  // create budget
  async createBudget(ctx) {
    const userInfo = getService('user').sanitizeUser(ctx.state.user);
    const params = ctx.request.body;
    console.log('params createBudget', params);
    if (!params.amount) {
      return ctx.badRequest({ message: 'amount required ' });
    }
    if (!params.budget_name) {
      return ctx.badRequest({ message: 'budget_name required ' });
    }
    if (!params.sub_id) {
      return ctx.badRequest({ message: 'sub_id required ' });
    }

    let amount = params.amount;
    let budget_name = params.budget_name;

    var options = {
      method: 'PUT',
      url:
        'https://management.azure.com/subscriptions/' +
        params.sub_id +
        '/providers/Microsoft.Consumption/budgets/' +
        budget_name +
        '?api-version=2019-10-01',
      headers: {
        Authorization: 'Bearer ' + userInfo.azureToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          category: 'Cost',
          amount: amount,
          timeGrain: 'Monthly',
          timePeriod: {
            startDate: '2021-10-01T00:00:00Z',
            endDate: '2022-12-31T00:00:00Z',
          },
          filter: {
            and: [
              {
                dimensions: {
                  name: 'ResourceId',
                  operator: 'In',
                },
              },
              {
                tags: {
                  name: 'category',
                  operator: 'In',
                  values: ['Dev', 'Prod'],
                },
              },
              {
                tags: {
                  name: 'department',
                  operator: 'In',
                  values: ['engineering', 'sales'],
                },
              },
            ],
          },
          notifications: {
            Actual_GreaterThan_80_Percent: {
              enabled: true,
              operator: 'GreaterThan',
              threshold: 80,
              locale: 'en-us',
              contactEmails: ['bshabi1994@gmail.com'],
              contactRoles: ['Contributor', 'Reader'],
              thresholdType: 'Actual',
            },
          },
        },
      }),
    };
    let result = await request(options);
    ctx.send(result);
  },

  //  Delete budget
  async deleteBudget(ctx) {
    const userInfo = getService('user').sanitizeUser(ctx.state.user);
    const params = ctx.request.body;
    if (!params.sub_id) {
      return ctx.badRequest({ message: 'sub_id required ' });
    }
    if (!params.budget_name) {
      return ctx.badRequest({ message: 'budget_name required ' });
    }
    var options = {
      method: 'DELETE',
      url:
        'https://management.azure.com/subscriptions/' +
        params.sub_id +
        `/providers/Microsoft.Consumption/budgets/${params.budget_name}?api-version=2019-10-01`,
      headers: {
        Authorization: 'Bearer ' + userInfo.azureToken,
      },
    };
    let result = request(options);
    ctx.send(result);
  },
  async assignRole(ctx) {
    const sub_role_definition_id = 'acdd72a7-3385-48ef-bd42-f606fba81ae7'; ///role definition identifier. You can see the list of built in roles and   their
    const sub_user_id = '3f78db44-4f53-4ee0-a0f3-a011e6e63787'; //objectID of the user. portal.azure.com --> Azure Active Directory --> Users ----
    const role_assignment_id = '3f78db44-4f53-4ee0-a0f3-a011e6e63787'; //roleAssignmentId: You can generate a random GUID by a GUID generator. Just for example (https://www.guidgenerator.com/)

    const userInfo = getService('user').sanitizeUser(ctx.state.user);
    console.log(userInfo);
    const params = ctx.request.body;
    console.log('called api ', params.sub_id);

    if (!params.sub_id) {
      console.log(params.sub_id);

      return ctx.badRequest({ message: 'sub_id required ' });
    }
    if (!role_assignment_id) {
      console.log(role_assignment_id);
      return ctx.badRequest({ message: 'role_assignment_id required ' });
    }
    //console.log("Hello to the world" , sub_id)
    var options = {
      method: 'PUT',
      url:
        'https://management.azure.com/subscriptions/' +
        params.sub_id +
        '/providers/microsoft.authorization/roleassignments/' +
        role_assignment_id +
        '?api-version=2015-07-01',
      headers: {
        Authorization: 'Bearer ' + userInfo.azureToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          roleDefinitionId:
            '/subscriptions/' +
            params.sub_id +
            '/providers/Microsoft.Authorization/roleDefinitions/' +
            sub_role_definition_id,
          principalId: sub_user_id,
        },
      }),
    };

    let result = request(options);
    console.log(result);
    ctx.send(result);
  },
};
