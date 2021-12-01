const requestTblBudgetsKinds = {
  monthly: {
    id: '6116a1db8e3a766c4b744625',
  },
  quarterly: {
    id: '6116a1ef8e3a766c4b744626',
  },
  annually: {
    id: '6116a21f8e3a766c4b744627',
  },
};

const requestTblIdToBudgetLindValue = {
  [requestTblBudgetsKinds['monthly'].id]: 'Monthly',
  [requestTblBudgetsKinds['quarterly'].id]: 'Quarterly',
  [requestTblBudgetsKinds['annually'].id]: 'Annually',
};

export default {
  requestTblBudgetsKinds,
  requestTblIdToBudgetLindValue,
};
