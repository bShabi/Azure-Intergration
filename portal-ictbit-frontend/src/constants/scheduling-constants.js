const requestTblScheduling = {
  "17:00": {
    id: '6110d34759c5875bd29320fc',
  },
  "20:00": {
    id: '6110d35c59c5875bd29320fd',
  },
  "none": {
    id: '6110d38e59c5875bd29320fe',
  }
};

const requestTblIdToSchedulingValue = {
  [requestTblScheduling["17:00"].id]: "17:00",
  [requestTblScheduling["20:00"].id]: "20:00",
  [requestTblScheduling["none"].id]: "none"
};

export default {
  requestTblScheduling,
  requestTblIdToSchedulingValue
};
