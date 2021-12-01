import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NEXT_URL, API_URL } from '../config/index';
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState('hii');
  const [auth, setAuth] = useState(true);

  let univeristy = [];
  let degrees = [];
  let allUsername = [];
  let allEmail = [];
  let allArticles = [];
  let allMentors = [];
  const [pageState, setPageState] = useState({
    identifier: '',
    password: '',
    otp: '',
  });

  const [error, setError] = useState(null);
  // const [univeristy, setUniveristy] = useState()

  const router = useRouter();
  useEffect(async () => {
    // await forgotPassword()
  }, []);

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
    <AuthContext.Provider value={{ otpConfirm, auth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
