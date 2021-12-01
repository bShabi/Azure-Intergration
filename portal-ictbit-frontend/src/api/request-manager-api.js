import { NEXT_URL, API_URL } from '../../config/index';
import GeneralConstants from '../constants/status-constants';
import axios from 'axios';
/// example json request.
// {
//     "StatusRequest" : "Submited", // const
//     "ProjectNameinCloud" : "B-WEBTest-4321222", // cloudName
//     "BudgetOnDemand" : 3000, // budget
//     "CloadProviderName":"Azure", // provider
//     "BudgetReasonNotes": "i need this project please", // commandOfBudget
//     "DateCCFORequestNotes": "2021-08-04T09:00:00.000Z", //
//     "DateCreateRequest": "2021-08-04T09:00:00.000Z", // date.now()
//     "LastDateUpdateRequest": "2021-08-03T09:00:00.000Z", // date.now()
//     "ReasonOfUnUseofScheduling": "Reson to select None inScheduling ",
//     "CloudName": "6117779587710a3eba6dab08", // title
//     "memberID": {
//       "_id": "6110f964b7f28f831eebb253" // const temporary
//     }
// }
/**
 *
 * @param {*} preperedRequestData
 * @returns
 */
const createNewRequest = async (preperedRequestData) => {
  let query = API_URL + '/requests-tbls';
  console.log('preperedRequestData11', preperedRequestData);
  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'post',
      body: JSON.stringify(preperedRequestData),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};
/**
 *
 * @param {*} requestId
 * @param {*} preperedData
 * @returns
 */
const updateDataRequest = async (requestId, preperedData) => {
  let updatedId = GeneralConstants.requestTblStatuses['Re-Submited'].id;

  let preperedDataWithStatus = {
    ...preperedData,
    requests_status_tbl: {
      _id: updatedId,
      id: updatedId,
    },
  };

  let query = API_URL + '/requests-tbls/' + requestId;
  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(preperedDataWithStatus),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('FromApiUpdate', data);
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        console.log(result.error, 'result.error');
        reject(result.error);
      });
  });
};

const updateRequestAfterAprrove = async (requestID, budget) => {
  let query = API_URL + '/requests-tbls/' + requestID;
  console.log('query', query);
  let update = {
    BudgetOnDemand: budget,
  };
  console.log('budgetupdateAprrove', update);
  console.log(requestID);
  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(update),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('UpdateBudget', data);
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        console.log(result.error, 'result.error');
        reject(result.error);
      });
  });
};

const createDraftRequest = async (preperedData) => {
  let updatedId = GeneralConstants.requestTblStatuses['draft'].id;

  let preperedDataWithStatus = {
    ...preperedData,
    requests_status_tbl: {
      _id: updatedId,
      id: updatedId,
    },
  };

  let query = API_URL + '/requests-tbls';
  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'post',
      body: JSON.stringify(preperedDataWithStatus),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('FromApiDraft', data);
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        console.log(result.error, 'result.error');
        reject(result.error);
      });
  });
};

const createOwnerRequest = async (requestId, preperedData) => {
  let updatedId = GeneralConstants.requestTblStatuses['InProgress'].id;

  let preperedDataWithStatus = {
    ...preperedData,
    requests_status_tbl: {
      _id: updatedId,
      id: updatedId,
    },
  };

  let query = API_URL + '/requests-tbls/' + requestId;
  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(preperedDataWithStatus),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('FromApiUpdate', data);
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        console.log(result.error, 'result.error');
        reject(result.error);
      });
  });
};
const createOwnerRequestBudget = async (budgetID, preperedData) => {
  let query = API_URL + '/update-budget-requests-tbls/' + budgetID;
  let updateId = GeneralConstants.requestTblStatuses['InProgress'].id;
  let preperedDataWithStatus = {
    ...preperedData,
    requests_status_tbl: {
      _id: updateId,
      id: updateId,
    },
  };

  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(preperedDataWithStatus),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('FromApiUpdate', data);
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        console.log(result.error, 'result.error');
        reject(result.error);
      });
  });
};

/// example json request.
// {
// "SubscriptionName": "testPosst",
// "CurrentBudget": 10, // budget
// "NewBudget" : null,
// "NewBudgetNotes" : "blalbal", // commandOfBudget
// "lastUpdated": "2021-08-15", // date.now()
// "requests_tbl" :  “611a0aa17d7d60308e7ef242” // return from last request
// }
/**
 *
 * @param {*} preperedBudgetData
 * @returns
 */
const updateBudget = async (preperedBudgetData) => {
  let query = API_URL + '/update-budget-requests-tbls';

  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'post',
      body: JSON.stringify(preperedBudgetData),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};
/**
 *
 * @param {*} requestId
 * @param {*} preperedData
 * @returns
 */
const deniedDataRequest = async (requestId, preperedData) => {
  let query = API_URL + '/requests-tbls/' + requestId;
  let deniedId = GeneralConstants.requestTblStatuses.denied.id;
  let preperedDataWithStatus = {
    ...preperedData,
    requests_status_tbl: {
      _id: deniedId,
      id: deniedId,
    },
  };

  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(preperedDataWithStatus),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};
const cancelDataRequest = async (requestId, preperedData) => {
  let query = API_URL + '/requests-tbls/' + requestId;
  let cancelId = GeneralConstants.requestTblStatuses.canceled.id;
  let preperedDataWithStatus = {
    ...preperedData,
    requests_status_tbl: {
      _id: cancelId,
      id: cancelId,
    },
  };

  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(preperedDataWithStatus),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};
/**
 *
 * @param {*} requestId
 * @returns
 */
const approvedDataRequest = async (requestId) => {
  let query = API_URL + '/requests-tbls/' + requestId;
  let approvedId = GeneralConstants.requestTblStatuses.approved.id;
  let preperedData = {
    requests_status_tbl: {
      _id: approvedId,
      id: approvedId,
    },
  };

  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(preperedData),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        //Do Here FunctionLocig // rename , add tags,addPremission,createBudget,setBudget
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};
/**
 *
 * @returns Cloud Provider l.e Azure/AWS
 */
const getCloudProivder = async () => {
  try {
    const strapiRes = await fetch(`${API_URL}/cloud-providers-tbls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const data = await strapiRes.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 * @returns Cloud Permssion
 */
const getCloudPremission = async () => {
  try {
    const strapiRes = await fetch(`${API_URL}/cloud-permission-tbls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const data = await strapiRes.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 * @returns Cloud Envirment i.e Test,Develop,Mivzai
 */
const getCloudEnvirment = async () => {
  try {
    const strapiRes = await fetch(`${API_URL}/cloud-environment-area-tbls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const data = await strapiRes.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 * @returns Cloud Scheduling i.e 17:00 20:00 none
 */
const getCloudScheduling = async () => {
  try {
    const strapiRes = await fetch(`${API_URL}/scheduling-tbls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const data = await strapiRes.json();
    console.log(
      '🚀 ~ file: request-manager-api.js ~ line 163 ~ getAllBudgets ~ data',
      data
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 * @returns Limit Project i.e monthly,yealy
 */
const getLimitOfProject = async () => {
  try {
    const strapiRes = await fetch(`${API_URL}/budget-kind-tbls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const data = await strapiRes.json();
    console.log(
      '🚀 ~ file: request-manager-api.js ~ line 163 ~ BudgetKind_TBLS ~ data',
      data
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};
const requestByMemberId = async (memberID) => {
  try {
    const strapiRes = await fetch(`${API_URL}/members-tbls?GUID=${memberID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const data = await strapiRes.json();
    console.log('🚀 ~  requestByMemberId ~ data', data);

    return data[0]?.requests_tbls;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 * @returns Get all Budget
 */
const getAllBudgets = async () => {
  try {
    const strapiRes = await fetch(`${API_URL}/requests-tbls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const data = await strapiRes.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 * @param {*} memberId
 * @returns
 */
const getRequestTblByMemberId = async (memberId) => {
  console.log('memberId22222', memberId);

  try {
    if (!memberId) return;
    const strapiRes = await fetch(
      `${API_URL}/requests-tbls?memberID=${memberId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    const data = await strapiRes.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 * @param {*} preperedRequestData
 * @returns
 */
const submittedBudgetDataRequest = async (preperedRequestData) => {
  console.log(
    '🚀 ~ file: request-manager-api.js ~ line 252 ~ submittedBudgetDataRequest ~ preperedRequestData',
    preperedRequestData
  );
  let query = API_URL + '/update-budget-requests-tbls';

  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'post',
      body: JSON.stringify(preperedRequestData),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};
/////////PUT Method////////////
/**
 *
 * @param {*} budgetID
 * @param {*} preperedRequestData
 * @returns
 */
const deniedBudgetRequest = async (budgetID, preperedRequestData) => {
  let query = API_URL + '/update-budget-requests-tbls/' + budgetID;
  let deniedId = GeneralConstants.requestTblStatuses.denied.id;
  let preperedDataWithStatus = {
    ...preperedRequestData,
    requests_status_tbl: {
      _id: deniedId,
      id: deniedId,
    },
  };

  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(preperedDataWithStatus),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};
const cancelBudgetRequest = async (budgetID, preperedRequestData) => {
  let query = API_URL + '/update-budget-requests-tbls/' + budgetID;
  let canceledId = GeneralConstants.requestTblStatuses.canceled.id;
  let preperedDataWithStatus = {
    ...preperedRequestData,
    requests_status_tbl: {
      _id: canceledId,
      id: canceledId,
    },
  };

  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(preperedDataWithStatus),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};
/**
 *
 * @param {*} budgetID
 * @returns
 */
const aprrovedBudgetRequest = async (budgetID) => {
  let query = API_URL + '/update-budget-requests-tbls/' + budgetID;
  let approvedId = GeneralConstants.requestTblStatuses.approved.id;
  let preperedData = {
    requests_status_tbl: {
      _id: approvedId,
      id: approvedId,
    },
  };

  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(preperedData),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};
/**
 *
 * @param {*} budgetID
 * @param {*} preperedBudgetData
 * @returns
 */
const updateBudgetRequest = async (budgetID, preperedBudgetData) => {
  let query = API_URL + '/update-budget-requests-tbls/' + budgetID;
  let updatedId = GeneralConstants.requestTblStatuses.updated.id;
  let preperedDataWithStatus = {
    ...preperedBudgetData,
    requests_status_tbl: {
      _id: updatedId,
      id: updatedId,
    },
  };
  console.log(
    '🚀 ~ file: request-manager-api.js ~ line 371 ~ updateBudgetRequest ~ preperedDataWithStatus',
    preperedDataWithStatus
  );

  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'put',
      body: JSON.stringify(preperedDataWithStatus),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};

//Get All Subscription from azure
/**
 *
 * @returns
 */
const getAllSubscripitionFromAzure = async () => {
  let query = `${API_URL}/users-permissions/get-my-subscriptions`;
  let hdr = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  };

  return new Promise(async (resolve, reject) => {
    let result = {};

    axios
      .get(query, hdr)
      .then((resp) => {
        console.log(resp, 'fromBackend');
        result = resp?.data.value;

        if (!resp?.data.value) {
          reject('Azure token expired !! Please login again !!!');
        }
        resolve(result);
      })
      .catch((err) => {
        reject('Your token expired please login again  pro process again ....');

        console.log(err);
      });
  });
};
/**
 *
 * @param {*} subscriptionID
 * @param {*} newName
 * @returns
 */
// Rename SubscriptionByID
const setRenameSubscription = async (subscriptionID, newName) => {
  if (!newName) return;
  let info = {
    sub_rename: newName,
    sub_id: subscriptionID,
  };

  let query = `${API_URL}/users-permissions/rename-subscription`;
  let hdr = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  };

  return new Promise(async (resolve, reject) => {
    let result = {};

    axios
      .post(query, info, hdr)
      .then((resp) => {
        if (resp.status != 200) {
          reject(false);
        }
        resolve(true);
      })
      .catch((err) => {
        reject(false);

        console.log(err);
      });
  });
};
/**
 *
 * @param {*} subscriptionID
 * @param {*} tags
 * @returns
 */
// set Tags for  Subscription by subscription ID
const setTagsToSubscription = async (subscriptionID, tags) => {
  if (!tags) return;
  if (!subscriptionID) return;
  let info = {
    sub_id: subscriptionID,
    envierment: tags.envierment,
    scheduling: tags.scheduling,
    period: tags.period,
    portalName: tags.portalName,
  };
  console.log('info', info);

  let query = `${API_URL}/users-permissions/add-tag`;
  let hdr = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  };
  return new Promise(async (resolve, reject) => {
    let result = {};
    axios
      .post(query, info, hdr)
      .then((res) => {
        console.log(res, 'AfterAddTags');
        result =
          'Request send to Azure ,  update operation may take some time in azure';
        resolve(res);
      })
      .catch((err) => {
        reject('Error', err);
      });
  });
};
/**
 *
 * @param {*} subscriptionID
 * @param {*} amount
 * @returns
 */
// create budget  for subscription
const createBudgetInAzurePortal = async (subscriptionID, amount) => {
  // if (!budgetInfo) return;
  // if (!subscriptionID) return;
  // if (!name) return;

  // if (!name || !amount) {
  //   return toast('Validation failde ');
  // }
  // toast('Requesting  to Azure Cloud ...');
  let query = `${API_URL}/users-permissions/create-budget`;
  let hdr = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  };
  let info = {
    sub_id: subscriptionID,
    amount: amount,
    budget_name: 'FirstBudget',
  };
  return new Promise(async (resolve, reject) => {
    let result = {};
    axios
      .post(query, info, hdr)
      .then((res) => {
        result = 'Created Successfull !!';
        resolve(res);
      })
      .catch((err) => {
        console.log('frombudget', err);
        reject('Error');
      });
  });
};
/**
 *
 * @param {*} subscriptionID
 * @param {*} name
 * @returns
 */
const deleteBudgetFromSubscription = async (subscriptionID, name) => {
  let query = `${API_URL}/users-permissions/delete-budget`;
  let hdr = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  };
  let info = {
    sub_id: 'e441aa91-df0c-441a-9589-7fc3c21b2129',
    budget_name: 'AfterAprove',
  };
  return new Promise(async (resolve, reject) => {
    let result = {};
    axios
      .post(query, info, hdr)
      .then((res) => {
        resolve('Deleted  !!');
      })
      .catch((err) => {
        reject('Error');
      });
  });
};
/**
 *
 * @param {*} subscriptionID
 * @returns
 */
const getBudgetsFromSubscription = async (subscriptionID) => {
  let query = `${API_URL}/users-permissions/get-budget-list`;
  let hdr = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  };
  let info = {
    sub_id: 'e441aa91-df0c-441a-9589-7fc3c21b2129',
  };
  return new Promise(async (resolve, reject) => {
    let result = {};
    axios
      .post(query, info, header)
      .then((res) => {
        resolve(res.data.value);
      })
      .catch((err) => {
        reject('Error');
      });
  });
};
/**
 *
 * @param {*} subscriptionID
 * @param {*} clientID
 * @returns
 */
const addPremssionToSubscription = async (subscriptionID, clientID) => {
  let query = `${API_URL}/users-permissions/assign-role`;
  let hdr = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  };

  let info = {
    sub_id: 'e441aa91-df0c-441a-9589-7fc3c21b2129',
    // budget_name: name,
  };
  // /users-permissions/assign-role
  return new Promise(async (resolve, reject) => {
    let result = {};
    axios
      .post(query, info, hdr)
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        if (err.response?.data?.error?.code == 'InvalidAuthenticationToken') {
          reject('Your Azure Token Expired  , Please login Again ');
        }

        result = 'Error';
        console.log(err.response?.data);
      });
  });
};
const SendEmail = (msgInfo) => {
  // const type = () => {
  //   switch (Type) {
  //     case 'Information':
  //       return;
  //     case 'Actions':
  //       return;

  //       break;
  //   }
  // };
  let query = `${API_URL}/emails`;

  const body = {
    subject: msgInfo.subject,
    body: msgInfo.body,
    sender: msgInfo.sender,
    receiver: msgInfo.receiver,
  };
  console.log('bodybody', body);
  return new Promise(async (resolve, reject) => {
    let result = {};

    fetch(query, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
        resolve(result);
      })
      .catch((e) => {
        result.message = ('Message: ', e);
        result.error = e;
        reject();
      });
  });
};

export default {
  createNewRequest,
  updateDataRequest,
  createDraftRequest,
  createOwnerRequest,
  createOwnerRequestBudget,
  updateBudget,
  getCloudProivder,
  getCloudPremission,
  getCloudEnvirment,
  getCloudScheduling,
  getLimitOfProject,
  getAllBudgets,
  deniedDataRequest,
  cancelDataRequest,
  approvedDataRequest,
  getRequestTblByMemberId,
  submittedBudgetDataRequest,
  deniedBudgetRequest,
  cancelBudgetRequest,
  aprrovedBudgetRequest,
  updateBudgetRequest,
  getAllSubscripitionFromAzure,
  setRenameSubscription,
  updateRequestAfterAprrove,
  setTagsToSubscription,
  createBudgetInAzurePortal,
  // addPremssionToSubscription,
  deleteBudgetFromSubscription,
  getBudgetsFromSubscription,
  SendEmail,
  requestByMemberId,
};
