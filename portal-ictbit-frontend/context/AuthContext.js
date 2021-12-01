import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NEXT_URL, API_URL } from '../config/index';
import axios from 'axios';
import { set } from 'nprogress';

const AuthContext = createContext();

const permissionOnCloud_init = [];
const environmentCloud_init = [];
const schedulingCloud_init = [];
const providerCloud_init = [];
const AllRequest_init = [];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [member, setMember] = useState();

  const [auth, setAuth] = useState(true);
  //save from DB
  const [cloudProivder, setCloudProivder] = useState([]);
  const [cloudScheduling, setScheduling] = useState([]);
  const [cloudEnvirment, setCloudEnvirment] = useState([]);
  const [cloudPremission, setCloudPremission] = useState([]);
  const [allRequest, setAllRequest] = useState();
  const [requestsByMember, setRequestsByMember] = useState();

  // after set option
  const [permissionOnCloud, setPermissionOnCloud] = useState(
    ...permissionOnCloud_init
  );

  const [environmentCloud, setEnvironmentCloud] = useState(
    ...environmentCloud_init
  );
  const [providerCloud, setProviderCloud] = useState(...schedulingCloud_init);
  const [schedulingCloud, setSchedulingCloud] = useState(...providerCloud_init);

  let univeristy = [];
  let degrees = [];
  let listBudgets = [];
  let ListRequests = [];
  const [pageState, setPageState] = useState({
    identifier: '',
    password: '',
    otp: '',
  });

  const [error, setError] = useState(null);
  // const [univeristy, setUniveristy] = useState()

  const router = useRouter();

  // useEffect(() => {
  //   if (member) localStorage.setItem('memberItem', JSON.stringify(member));
  // }, [member]);

  useEffect(() => {
    console.log('useEffect AuthContext 2', member);
  });

  useEffect(() => {
    const memberData = JSON.parse(localStorage.getItem('userInfo'));

    if (!member) {
      try {
        const memberData = JSON.parse(localStorage.getItem('userInfo'));
        if (memberData) {
          setMember(memberData?.members_tbl);
          setAuth(true);
        }
      } catch (error) {}
    }

    console.log('useEffect AuthContext 1', member);

    const asyncCalls = async () => {
      console.log('useEffect1 AuthContext', member);

      // await getCloudEnvirment();
      // await getCloudScheduling();
      // await getCloudProivder();
      // await getCloudPremission();
      // await getAllRequest();

      // await setCloudPremissionOption();
      // await setCloudProivderOption();
      // await setCloudSchedulingOption();
      // await setCloudEnvirmentOption();
    };

    // asyncCalls();
  }, []);

  /////////////Set User After Login////////////

  const setUserToMember = (member) => {
    console.log(
      '🚀 ~ file: AuthContext.js ~ line 71 ~ setUserToMember ~ member',
      member
    );
    setMember(member);
    setAuth(true);
  };

  ///////////////////////////////////////

  /////////////Get All BudgetByMemberId////////

  const getAllBudgetByMemberId = () => {};
  ///////////////////////////////////////
  /////////////Get All RequestByMemberId////////

  const getAllRequestByMemberId = async (memberId) => {
    if (!memberId) return;
    try {
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
      const data = strapiRes.json();
      console.log('resresres', data);
      // setRequestByMemberID(res.json());
    } catch (error) {
      console.log(error);
    }
  };

  ///////////////////////////////////////

  const getAllRequest = async () => {
    try {
      const strapiRes = await fetch(`${API_URL}/requests-tbls`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await strapiRes.json();

      setAllRequest(data);
    } catch (error) {
      console.log(error);
    }
  };

  const setCloudPremissionOption = async () => {
    console.log('cloudPremission', cloudPremission);
    cloudPremission.forEach(async (element) => {
      console.log(
        '🚀 ~ file: AuthContext.js ~ line 69 ~ cloudPremission.forEach ~ element',
        element
      );
      permissionOnCloud_init.push({ optionValue: element.CloudPermissionName });
      console.log('cloudPremissionEuse1', element.CloudPermissionName);
    });
    setPermissionOnCloud(permissionOnCloud_init);
    console.log('permissionOnCloud_inttit', permissionOnCloud_init);
  };
  const setCloudProivderOption = async () => {
    cloudProivder.forEach(async (element) => {
      providerCloud_init.push({ optionValue: element.Cloud });
      console.log('CloudCloud', element.Cloud);
    });
    setProviderCloud(providerCloud_init);
  };
  const setCloudEnvirmentOption = async () => {
    cloudEnvirment.forEach(async (element) => {
      environmentCloud_init.push({
        optionValue: element.CloudEnvironmentAreaName,
      });
      console.log('cloudPremissionEuse1', element.CloudEnvironmentAreaName);
      setEnvironmentCloud(environmentCloud_init);
    });
  };
  const setCloudSchedulingOption = async () => {
    cloudScheduling.forEach(async (element) => {
      schedulingCloud_init.push({ optionValue: element.SchedulingOption });
      console.log('SchedulingOption', element.SchedulingOption);
    });
    setSchedulingCloud(schedulingCloud_init);
    console.log(
      '🚀 ~ file: AuthContext.js ~ line 105 ~ setCloudSchedulingOption ~ schedulingCloud_init',
      schedulingCloud_init
    );
  };

  //  GET Varibles to Request Forms

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
      console.log('from getCloudProivder', data);
      setCloudProivder(data);
    } catch (error) {
      console.log(error);
    }
  };
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
      console.log('from getCloudProivder', data);
      setCloudPremission(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCloudEnvirment = async () => {
    try {
      const strapiRes = await await fetch(
        `${API_URL}/cloud-environment-area-tbls`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      const data = await strapiRes.json();
      console.log('from getCloudEnvirment', data);
      setCloudEnvirment(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCloudScheduling = async () => {
    try {
      const strapiRes = await await fetch(`${API_URL}/scheduling-tbls`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await strapiRes.json();
      console.log('from scheduling-tbls', data);
      setScheduling(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllBudgets = async () => {
    console.log('hii');
    try {
      const strapiRes = await fetch(`${API_URL}/requests-tbls`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await strapiRes.json();
      console.log('from Context', data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const getListRequest = async () => {
    const getReqeusts = await fetch(
      `${API_URL}/requests-tbls?memberID=${member.members_tbl.id}`
    );
    const Data = await getReqeusts.json();
    console.log(Data);
    return Data;
  };

  //POST Subscripiton
  const NewRequest = async (Request) => {
    console.log('from Context-NewRequest', Request);

    const strapiRes = await fetch(`${API_URL}/requests-tbls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(Request),
    });

    const data = await strapiRes.json();
    // console.log("**id", data._id)
    return data;
  };
  const newRequestBudget = async (Request) => {
    const { _id } = Request;
    console.log('_id', _id);
    return _id;
  };

  // const forgotPassword = async (email) => {
  //     axios
  //         .post('${API_URL}/auth/forgot-password', {
  //             email: 'bshabi.dev@gmail.com',
  //             url:
  //                 'http:/localhost:1337/admin/plugins/users-permissions/auth/reset-password',
  //         })
  //         .then(response => {
  //             // Handle success.
  //             console.log('Your user received an email');
  //         })
  //         .catch(error => {
  //             // Handle error.
  //             console.log('An error occurred:', error.response);
  //         });
  // }
  const register = async (user) => {
    const res = await fetch(`${NEXT_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    console.log('data', res.data);
    console.log('data', data);
    if (res.ok) {
      setUser(data.user);
      router.push('/');
    } else {
      setError(data.message);
      setError(null);
    }
  };

  //  Login User
  const otpConfirm = async (pageState) => {
    const query = await axios.post(
      '${API_URL}/auth/otp-confirmation',
      pageState
    );

    return query;
  };
  const login = async (pageState) => {
    const query = await axios.post('${API_URL}/auth/local', pageState);
    setMember(query.data);
    return query;
  };

  // Logout user
  const logout = async () => {
    const res = await fetch(`${NEXT_URL}/api/logout`, {
      method: 'POST',
    });

    if (res.ok) {
      setUser(null);
      router.push('/');
    }
  };

  // Check if user is logged in
  const checkUserLoggedIn = async (user) => {
    const res = await fetch(`${NEXT_URL}/api/user`);
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        newRequestBudget,
        NewRequest,
        getListRequest,
        getAllBudgets,
        otpConfirm,
        setUserToMember,
        auth,
        user,
        setUser,
        listBudgets,
        ListRequests,
        permissionOnCloud,
        environmentCloud,
        providerCloud,
        schedulingCloud,
        permissionOnCloud_init,
        environmentCloud_init,
        schedulingCloud_init,
        providerCloud_init,
        allRequest,
        setRequestsByMember,
        requestsByMember,
        getAllRequestByMemberId,
        register,
        login,
        logout,
        setIsAdmin,
        isAdmin,
        setMember,
        member,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// export function useAppContext() {

//   return useContext(AuthContext);
// }
