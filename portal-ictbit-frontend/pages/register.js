import {
  Card,
  Button,
  CardActionArea,
  CardContent,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { API_URL } from '../config';

export default function Home() {
  const [pageState, setPageState] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const submitHandler = (e) => {
    e.preventDefault();
    if (
      !pageState.email ||
      !pageState.password ||
      !pageState.username ||
      !pageState.phone
    ) {
      return toast.error('אנא הכנס את כל ערכי החובה');
    }
    if (parseInt(pageState.phone).toString().length !== 10) {
      return toast.error('מספר הטלפון אינו חוקי');
    } else {
      setSubmitButtonText('Creating Account ...');
      axios
        .post(`${API_URL}/auth/local/register`, pageState)
        .then((resp) => {
          setSubmitButtonText('Submit');
          toast.success('הרישום בוצע בהצלחה');
        })
        .catch((err) => {
          setSubmitButtonText('Submit');
          console.log(err.response?.data);
          toast.error(
            'הרישום נכשל, אנא הכנס שם ומייל שונים ונסה שוב.'
          );
        });
    }
  };
  return (
    <div>
      <Head>
        <link
          rel='stylesheet'
          href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
        />
      </Head>
      <div className='container mt-5'>
        <div className='row'>
          <div className='mt-5 col-md-6 offset-md-3'>
            <form onSubmit={(e) => submitHandler(e)}>
              <Card>
                <CardContent>
                  <h2 className='text-center ' style={{ color: '#878787' }}>
                    Register Here .
                  </h2>
                  <hr />
                  <div className='row'>
                    <div className='col-6 mb-3'>
                      <TextField
                        onChange={(e) =>
                          setPageState({
                            ...pageState,
                            username: e.target.value,
                          })
                        }
                        required
                        id='filled-required'
                        style={{ width: '100%' }}
                        label='Name'
                        placeholder='Enter your Name'
                        variant='filled'
                      />
                    </div>
                    <div className='col-6 mb-3'>
                      <TextField
                        onChange={(e) =>
                          setPageState({ ...pageState, email: e.target.value })
                        }
                        required
                        id='filled-required'
                        style={{ width: '100%' }}
                        label='Email'
                        placeholder='Enter your Email'
                        variant='filled'
                      />
                    </div>

                    <div className='col-6 mb-3'>
                      <TextField
                        onChange={(e) =>
                          setPageState({
                            ...pageState,
                            phone: e.target.value,
                          })
                        }
                        required
                        type='number'
                        label='Enter Phone Number'
                        id='filled-start-adornment'
                        // className={clsx(classes.margin, classes.textField)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              +97
                            </InputAdornment>
                          ),
                        }}
                        variant='filled'
                      />
                      {/* <TextField
                        onChange={(e) =>
                          setPageState({
                            ...pageState,
                            phone: e.target.value,
                          })
                        }
                        type="text"
                        required
                        id="filled-required"
                        style={{ width: "100%" }}
                        label="Phone Number"
                        placeholder="Enter your Phone Number"
                        variant="filled"
                      /> */}
                    </div>
                    <div className='col-6 mb-3'>
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
                  <CardActionArea className=' '>
                    <button type='submit'>{submitButtonText}</button>
                  </CardActionArea>
                  <p>
                    Already have a account ?<Link href='/'>Go to Login </Link>
                  </p>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
