import React from 'react';
import RequestManagerApi from '../api/request-manager-api';
/**
 *
 * @param {*} subs
 * @returns The first Avlaivble sub
 */
const getFirstAvaliabeSubscription = (subs) => {
  return subs.find((e) => e.displayName.includes('sub_free'));
};

const getAllSubscriptions = () => {
  return RequestManagerApi.getAllSubscripitionFromAzure();
};

const renameSubscription = (sub, newName) => {
  return RequestManagerApi.setRenameSubscription(sub.subscriptionId, newName);
};
const setTag = (sub, tag) => {
  return RequestManagerApi.setTagsToSubscription(sub.subscriptionId, tag);
};
const setBudget = (sub, budget) => {
  return RequestManagerApi.createBudgetInAzurePortal(
    sub.subscriptionId,
    budget
  );
};
const setPermssion = (sub) => {};

export default {
  getFirstAvaliabeSubscription,
  getAllSubscriptions,
  renameSubscription,
  setTag,
  setBudget,
};
