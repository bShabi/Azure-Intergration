import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { CardActionArea, TextField } from '@material-ui/core';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-toastify';
import * as EmailValidator from 'email-validator';
import { useRouter } from 'next/router';
import { API_URL } from '../config';
export default function SignInSide() {
  const [pageState, setPageState] = useState({
    identifier: '',
    password: '',
    otp: '',
    code: '',
  });
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const [headerText, setHeaderText] = useState('Login Here');
  const [otpComponent, setOtpComponent] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      router.push('/');
      console.log('not did code');
    }
    window.localStorage.setItem('code', code);
    router.push('/login');
  }, []);

  const sendAgain = () => {
    if (!pageState.identifier || !pageState.password) {
      toast.error('אנא הכנס ערכי חובה');
    } else {
      const localOtpTime = window.localStorage.getItem('localOtpTime');
      if (localOtpTime) {
        window.localStorage.setItem('localOtpTime', parseInt(localOtpTime) + 1);
      } else {
        window.localStorage.setItem('localOtpTime', parseInt(1));
      }
      if (parseInt(localOtpTime) > 3) {
        return toast('אינך מאושר לקבלת זמן נוסף');
      } else {
        setSubmitButtonText('Requesting ...');

        axios
          .post(`${API_URL}/auth/local`, pageState)
          .then((resp) => {
            console.log(resp);
            setSubmitButtonText('Submit');
            setHeaderText('Enter Your OTP');
            setOtpComponent(true);
            toast.success('נשלח OTP לכתובת המייל שהוזנה');
          })
          .catch((err) => {
            setSubmitButtonText('Submit');
            console.log('Login ', err.response?.data, pageState);
            toast.error('האימות נכשל, אנא נסה שוב מאוחר יותר.');
          });
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (otpComponent) {
      if (!pageState.identifier || !pageState.password || !pageState.otp) {
        console.log(pageState);
        toast.error('אנא הנכס את ערכי החובה');
      } else {
        setSubmitButtonText('Requesting ...');
        axios
          .post(`${API_URL}/auth/otp-confirmation`, pageState)
          .then((resp) => {
            console.log(resp);
            toast.success('כניסה בוצעה בהצלחה');
            setTimeout(() => {
              window.localStorage.setItem('token', resp.data.jwt);
              router.push('/dashboard');
            }, 1500);
          })
          .catch((err) => {
            console.log('OTP check ', err.response?.data);
            setSubmitButtonText('Submit');
            toast.error('האימות נכשל, OTP אינו תואם.');
          });
      }
    } else {
      if (!pageState.identifier || !pageState.password) {
        toast.error('אנא הכנס את כל ערכי החובה');
      } else {
        // const localOtpTime = window.localStorage.getItem("localOtpTime");
        // if (localOtpTime) {
        //   window.localStorage.setItem(
        //     "localOtpTime",
        //     parseInt(localOtpTime) + 1
        //   );
        // } else {
        //   window.localStorage.setItem("localOtpTime", parseInt(1));
        // }
        setSubmitButtonText('Requesting ...');
        axios
          .post(`${API_URL}/auth/local`, pageState)
          .then((resp) => {
            console.log(resp);
            setSubmitButtonText('Submit');
            setHeaderText('Enter Your OTP');
            setOtpComponent(true);
            toast.success('נשלח OTP לכתובת המייל שהוזנה');
          })
          .catch((err) => {
            setSubmitButtonText('Submit');
            console.log('Login ', err.response?.data, pageState);
            toast.error('הבקשה נכשלה, אנא נסה שוב מאוחר יותר.');
          });
      }
    }
  };
  const sendOtpToPhone = () => {
    if (!pageState.identifier || !pageState.password) {
      toast.error('אנא הכנס את כל ערכי החובה');
    } else {
      const localOtpTime = window.localStorage.getItem('localOtpTime');
      if (localOtpTime) {
        window.localStorage.setItem('localOtpTime', parseInt(localOtpTime) + 1);
      } else {
        window.localStorage.setItem('localOtpTime', parseInt(1));
      }
      if (parseInt(localOtpTime) > 3) {
        return toast('אינך מאושר לקבלת זמן נוסף');
      } else {
        setSubmitButtonText('Requesting ...');

        axios
          .post(`${API_URL}/auth/send-otp-to-phone`, pageState)
          .then((resp) => {
            console.log(resp);
            setSubmitButtonText('Submit');
            setHeaderText('Enter Your OTP');
            setOtpComponent(true);
            toast.success("הודעת שרת: " + resp.data.message);
          })
          .catch((err) => {
            setSubmitButtonText('Submit');
            console.log('Login ', err.response?.data, pageState);
            toast.error('האימות נכשל, אנא נסה שוב מאוחר יותר.');
          });
      }
    }
  };

  return (
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
            <div className='text-center'>
              <LockOutlinedIcon />
              <h2>{headerText}</h2>
            </div>
            <form style={{ width: '100%' }} onSubmit={(e) => submitHandler(e)}>
              <hr />
              {!otpComponent ? (
                <div>
                  <div className='mb-3'>
                    <TextField
                      onChange={(e) =>
                        setPageState({
                          ...pageState,
                          identifier: e.target.value,
                        })
                      }
                      required
                      id='filled-required'
                      style={{ width: '100%' }}
                      label='Email'
                      placeholder='Enter your Email'
                      variant='filled'
                    />
                  </div>
                  <div className='mb-3'>
                    <TextField
                      onChange={(e) =>
                        setPageState({
                          ...pageState,
                          password: e.target.value,
                        })
                      }
                      type='password'
                      required
                      id='filled-required'
                      style={{ width: '100%' }}
                      label='Password'
                      placeholder='Enter your Password'
                      variant='filled'
                    />
                  </div>
                </div>
              ) : (
                <div className='text-center '>
                  <h6
                    className='text-center alert alert-info'
                    style={{ width: '100%' }}>
                    We send a OTP in your mail did not get yet ?
                    <span
                      onClick={(e) => sendAgain(e)}
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
                      onChange={(e) =>
                        setPageState({
                          ...pageState,
                          otp: e.target.value,
                        })
                      }
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
              )}
              {otpComponent ? (
                <div className=' mb-3'>
                  <CardActionArea className=' '>
                    <Button type='submit' variant='contained'>
                      {submitButtonText}
                    </Button>
                  </CardActionArea>
                </div>
              ) : (
                <CardActionArea className=' '>
                  <Button type='submit' variant='contained'>
                    {submitButtonText}
                  </Button>
                </CardActionArea>
              )}

              <p>
                Not have a account ?
                <Link href='/register'>Go to Registration </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
