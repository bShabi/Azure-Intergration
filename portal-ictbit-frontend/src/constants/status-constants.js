const requestTblStatuses = {
  denied: {
    id: '611ca214fc9d29cd8caf29c7',
  },
  approved: {
    id: '611ca1fdfc9d29cd8caf29c6',
  },
  'Re-Submited': {
    id: '611ca161fc9d29cd8caf29c5',
  },
  submitted: {
    id: '611ca11dfc9d29cd8caf29c4',
  },
  draft: {
    id: '615463bf8e68eaf7213364f7',
  },
  InProgress: {
    id: '615c06d7f61441863b3aba6b',
  },
  canceled: {
    id: '616286102942611398486936',
  },
};

const requestTblIdToStatusName = {
  [requestTblStatuses.denied.id]: 'denied',
  [requestTblStatuses.approved.id]: 'approved',
  [requestTblStatuses['Re-Submited'].id]: 'Re-Submited',
  [requestTblStatuses.submitted.id]: 'submitted',
  [requestTblStatuses.draft.id]: 'draft',
  [requestTblStatuses.InProgress.id]: 'InProgress',
  [requestTblStatuses.canceled.id]: 'Canceled',
};

const colorByStatusRequest = (statusRequest) => {
  let color = 'black';

  switch (statusRequest) {
    case 'approved':
      return (color = 'green');
    case 'denied':
      return (color = 'red');
    case 'submitted':
      return (color = 'gray');
    case 'Re-Submited':
      return (color = 'orange');
    case 'draft':
      return (color = '#33C2FF');
    case 'InProgress':
      return (color = '#6e759f');
    case 'Canceled':
      return (color = '#6e759f');
    default:
      break;
  }
};

export default {
  requestTblStatuses,
  requestTblIdToStatusName,
  colorByStatusRequest,
};
