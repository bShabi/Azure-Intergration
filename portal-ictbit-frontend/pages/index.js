import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { CardActionArea, Paper, TextField } from '@material-ui/core';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Head from 'next/head';
import * as EmailValidator from 'email-validator';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { Container } from 'react-bootstrap';
import { makeStyles } from '@material-ui/styles';
import { API_URL } from '../config';
export default function SignInSide() {
  // const classes = useStyles();

  const [pageState, setPageState] = useState({
    identifier: '',
    phone: '',
  });
  const [headerText, setHeaderText] = useState('מסך התחברות לפורטל');
  const router = useRouter();

  const checkUserExist = () => {
    if (!EmailValidator.validate(pageState.identifier)) {
      return toast.error('כתובת מייל אינה חוקית');
    }
    if (parseInt(pageState.phone).toString().length !== 9) {
      return toast.error('מספר טלפון אינו חוקי');
    }
    window.localStorage.setItem('userInfo', JSON.stringify(pageState));
    toast('בדיקת ולידציה עם השרת');
    axios
      .post(`${API_URL}/check-user-exist`, pageState)
      .then((resp) => {
        if (resp.data) {
          console.log('after check user exist');
          window.localStorage.setItem('userInfo', JSON.stringify(resp.data));
          window.localStorage.setItem('uesrExist', true);
          setTimeout(() => {
            router.push(`${API_URL}/api/azure-login`);
            // fetch(`${API_URL}/api/azure-login`, {
            //   method: 'GET',
            //   headers: { 'Content-Type': 'application/json' },
            // }).then((response) => response.json());
          }, 500);
        } else {
          window.localStorage.setItem('userInfo', JSON.stringify(pageState));
          let GUID = uuidv4();
          axios
            .post(`${API_URL}/members-tbls`, {
              serialNumer: GUID,
              GUID: GUID,
              MemberEmail: pageState.identifier,
              azureUsername: pageState.identifier,
              MemberPhoneNumber: pageState.phone,
              // LastLoginDate: new Date(),
              DateCreateMember: getDate(),
            })
            .then((resp) => {
              console.log('resprespresp', resp.data);
              axios
                .post(`${API_URL}/auth/local/register`, {
                  email: pageState.identifier,
                  username: pageState.identifier,
                  phone: pageState.phone,
                  members_tbl: resp?.data?.id,
                })
                .then((resp) => {
                  console.log(resp);
                  router.push(`${API_URL}/api/azure-login`);
                })
                .catch((err) => {
                  console.log('err4', err);
                  console.log(err);
                });
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {
        console.log(err);
        toast('שגיאה!!');
      });
  };

  function getDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //janvier = 0
    let yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }
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
            <Container>
              <Paper>
                <div className='mt-5 p-5'>
                  <div className='text-center'>
                    <LockOutlinedIcon />
                    <h2>{headerText}</h2>
                  </div>
                  <form style={{ width: '100%' }}>
                    <hr />
                    <div>
                      <div className='mb-3' dir='rtl'>
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
                          // label='כתובת מייל'
                          placeholder='כתובת מייל'
                          variant='filled'
                          // InputLabelProps={{
                          //   classes: {
                          //     root: classes.textField_root,
                          //   },
                          // }}
                        />
                      </div>
                      <div className='mb-3' dir='rtl'>
                        <TextField
                          onChange={(e) =>
                            setPageState({
                              ...pageState,
                              phone: e.target.value,
                            })
                          }
                          type='number'
                          required
                          id='filled-required'
                          style={{ width: '100%', dir: 'rtl' }}
                          // label='מספר טלפון'
                          placeholder='מספר טלפון'
                          variant='filled'
                          // InputLabelProps={{
                          //   classes: {
                          //     root: classes.textField_root,
                          //   },
                          // }}
                        />
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Button
                        variant='contained'
                        fullWidth
                        onClick={(e) => checkUserExist()}>
                        כניסה לפורטל
                      </Button>
                    </div>
                  </form>
                </div>
              </Paper>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}
