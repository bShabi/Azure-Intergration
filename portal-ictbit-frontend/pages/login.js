import React, { useEffect, useState, useContext } from 'react';

import { CardActionArea, TextField } from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { API_URL } from '../config';
import AuthContext from '../context/AuthContext';
import nookies from 'nookies';

export default function SignInSide() {
  const [otp, setOtp] = useState('');
  const [otpComponent, setOtpComponent] = useState(false);

  const { setUserToMember, member } = useContext(AuthContext);
  const [pageState, setPageState] = useState({
    identifier: '',
    password: '',
    otp: '',
    phone: '',
    code: '',
    name: '',
  });
  const router = useRouter();

  useEffect(() => {
    let userInfo = window.localStorage.getItem('userInfo');
    let code = window.localStorage.getItem('code');
    if (userInfo && code) {
      let user = JSON.parse(userInfo);
      axios
        .post(`${API_URL}/auth/otp-confirmation`, {
          // add azure user
          identifier: user.email ? user.email : user.identifier,
          code,
        })
        .then((response) => {
          setTimeout(() => {
            axios
              .post(`${API_URL}/auth/verifyUser`, {
                identifier: user.email ? user.email : user.identifier,
              })
              .then((resp) => {
                console.log(resp.data);
                let username1 = new String(resp.data?.azureAccount?.username);
                let username2 = new String(resp.data?.email);
                console.log(
                  'testing Email Compare ',
                  username1.toLowerCase(),
                  username2.toLowerCase()
                );
                if (
                  username1.toLocaleLowerCase() ===
                  username2.toLocaleLowerCase()
                ) {
                  toast('הנך כעת משתמש מאומת');
                  //sendNoPassOtp(user.email ? user.email : user.identifier);
                  sendOtpToPhone();
                  return setOtpComponent(true);
                } else {
                  axios
                    .post(`${API_URL}/auth/verifyUser`, {
                      identifier: user.email ? user.email : user.identifier,
                    })
                    .then(async (resp) => {
                      console.log('Auth/VerifuUser', resp.data);
                      let username1 = new String(
                        resp.data?.azureAccount?.username
                      );
                      let username2 = new String(resp.data?.email);
                      console.log(username1, username2);
                      if (
                        username1.toLocaleLowerCase ===
                        username2.toLocaleLowerCase
                      ) {
                        toast('הנך כעת משתמש מאומת');
                        // sendNoPassOtp(
                        //   user.email ? user.email : user.identifier
                        // );
                        sendOtpToPhone();

                        return setOtpComponent(true);
                      } else {
                        toast.error('שם משתמש אינו תואם לחשבון Azure');
                        await axios.delete(`${API_URL}/users/${resp.data.id}`);
                        router.push('/');
                        // delete and redirect section
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      //  router.push;
                    });
                }
              })
              .catch((error) => {
                console.log(error);

                //  router.push;
              });
          }, 2000);
        })
        .catch((error) => {
          toast.error('הסשן הנוכחי הסתיים');
          window.localStorage.removeItem('code');
          window.localStorage.removeItem('userInfo');
          console.log(error.response?.data);
          router.push('/');
        });
    } else {
      router.push('/');
    }
  }, []);

  const sendNoPassOtp = (email) => {
    let userInfo = window.localStorage.getItem('userInfo');
    let user = JSON.parse(userInfo);

    axios
      .post(`${API_URL}/auth/local`, {
        identifier: user.email ? user.email : user.identifier,
      })
      .then((resp) => {
        setOtpComponent(true);
        toast.success('נשלח OTP לכתובת המייל שהוזנה');
      })
      .catch((err) => {
        console.log(err.response?.data);
        toast.error('האימות נכשל, נסה שוב מאוחר יותר.');
      });
  };
  const otpValidation = (email) => {
    let userInfo = window.localStorage.getItem('userInfo');
    let user = JSON.parse(userInfo);
    axios
      .post(`${API_URL}/auth/otpvalidation`, {
        identifier: user.email ? user.email : user.identifier,
        otp,
      })
      .then((resp) => {
        toast.success('כניסה בוצעה בהצלחה');
        // console.log('after_Login', resp.data.user);
        const getResponse = resp.data.user;
        console.log('getResponse', getResponse.members_tbl);
        setUserToMember(getResponse.members_tbl);

        window.localStorage.setItem('token', resp.data.jwt);
        nookies.set('res', 'token', resp.data.jwt, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
        setTimeout(() => {
          if (getResponse?.isManager) {
            router.push('/Requests/Manager');
          } else {
            router.push('/Requests/Users');
          }
        }, 500);
      })
      .catch((error) => {
        toast.error('OTP אינו תואם');
      })
      .finally(() => {
        // window.localStorage.removeItem('code');
        // window.localStorage.removeItem('userInfo');
      });
  };

  const sendOtpToPhone = () => {
    let userInfo = window.localStorage.getItem('userInfo');
    let user = JSON.parse(userInfo);
    let identifier = user.email ? user.email : user.identifier;

    if (!identifier) {
      toast.error('אנא הכנס את ערכי החובה');
    } else {
      axios
        .post(`${API_URL}/auth/otpToPhone`, {
          identifier: identifier,
          phone: user.phone,
        })
        .then((resp) => {
          toast.success('הודעת שרת: ' + resp.data.message);
        })
        .catch((err) => {
          console.log('Login ', err.response?.data, pageState);
          toast.error('האימות נכשל, אנא נסה שוב מאוחר יותר.');
        });
    }
  };

  /**
   * old
   */
  // const sendOtpToPhone = () => {
  //   let userInfo = window.localStorage.getItem('userInfo');
  //   let user = JSON.parse(userInfo);
  //   let identifier = user.email ? user.email : user.identifier;

  //   if (!identifier) {
  //     toast.error('אנא הכנס את ערכי החובה');
  //   } else {
  //     axios
  //       .post(`${API_URL}/auth/send-otp-to-phone`, {
  //         identifier: identifier,
  //       })
  //       .then((resp) => {
  //         toast.success('הודעת שרת: ' + resp.data.message);
  //       })
  //       .catch((err) => {
  //         console.log('Login ', err.response?.data, pageState);
  //         toast.error('האימות נכשל, אנא נסה שוב מאוחר יותר.');
  //       });
  //   }
  // };

  return (
    <>
      <Head>
        <link
          rel='stylesheet'
          href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
        />
      </Head>
      <div>
        <div className='row no-gutters' style={{ width: '100%' }}>
          <div
            className='d-none d-sm-block d-md-block col-md-7'
            style={{ height: '100vh' }}>
            <div
              className='image-class'
              style={{
                backgroundSize: 'cover',
                backgroundPosition: ' center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: ' 100%',
                backgroundImage: 'url("https://source.unsplash.com/random")',
              }}></div>
          </div>
          <div className='col-md-5' style={{ height: '100vh' }}>
            <div className='mt-5 p-5'>
              {!otpComponent ? (
                <h2 className='text-center'> Validating ...</h2>
              ) : (
                ''
              )}
              {otpComponent ? (
                <div className='text-center '>
                  <div>
                    <h6
                      className='text-center alert alert-info'
                      style={{ width: '100%' }}>
                      We send a OTP in your mail did not get yet ?
                      <span
                        onClick={(e) => sendNoPassOtp()}
                        style={{
                          marginLeft: '10px',
                          cursor: 'pointer',
                          color: 'blue',
                          fontWeight: '600',
                          textDecoration: 'underline',
                        }}>
                        Send Again
                      </span>
                    </h6>

                    <h6
                      className='text-center alert alert-info'
                      style={{ width: '100%' }}>
                      Want to get OTP on Your Phone ?
                      <span
                        onClick={(e) => sendOtpToPhone(e)}
                        style={{
                          marginLeft: '10px',
                          cursor: 'pointer',
                          color: 'blue',
                          fontWeight: '600',
                          textDecoration: 'underline',
                        }}>
                        Click Here
                      </span>
                    </h6>
                    <div className='  mb-3'>
                      <TextField
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        name='OTP'
                        id='filled-required'
                        style={{ width: '100%' }}
                        label='OTP'
                        placeholder='Enter your OTP'
                        type='number'
                        variant='filled'
                      />
                    </div>
                  </div>
                  <div className='text-left'>
                    {otp ? (
                      <button
                        onClick={(e) => otpValidation()}
                        className='btn btn-success'>
                        Send
                      </button>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
