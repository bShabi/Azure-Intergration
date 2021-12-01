import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { CardContent, Card } from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { API_URL } from '../config';
export default function Subscriptions() {
  const [budgetList, setBudgetList] = useState([]);
  const [value, setValue] = React.useState(2);
  const [stage, setStage] = useState(0);
  const [header, setHeader] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectSubID, setSelectSubID] = useState('');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    let hdr = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      },
    };
    setHeader(hdr);
    axios
      .get(`${API_URL}/users-permissions/get-my-subscriptions`, hdr)
      .then((resp) => {
        console.log(resp, ' all list ');
        if (!resp.data.value) {
          toast.error('חשבון אינו תקף, אנא נסה שוב.');
        }
        setSubscriptions(resp.data.value);
      })
      .catch((err) => {
        toast.error(
          'חשבון אינו תקף, אנא נסה שוב.'
        );
        console.log(err);
      });
  }, []);
  const renameSubscription = (id) => {
    let name = window.prompt('Please enter New name');
    if (!name) return;
    let info = {
      sub_rename: name,
      sub_id: id,
    };
    axios
      .post(`${API_URL}/users-permissions/rename-subscription`, info, header)
      .then((res) => {
        toast(
          'הבקשה נשלחה, העדכון עלול לקחת זמן.'
        );
      })
      .catch((err) => {
        toast.error('שגיאה כללית');
      });
  };

  const addTagSubscription = (id) => {
    let name = window.prompt(
      'Please enter tag name   , put comma to make seperated  name!'
    );
    if (!name) return;
    let info = {
      sub_id: id,
      tags: {
        sub_tag_0: name,
      },
    };
    // let splited= name.split(",")

    axios
      .post(`${API_URL}/users-permissions/add-tag`, info, header)
      .then((res) => {
        toast(
          'הבקשה נשלחה, העדכון עלול לקחת זמן.'
        );
      })
      .catch((err) => {
        toast.error('שגיאה כללית');
      });
  };

  const getBudgetList = (id) => {
    setSelectSubID(id);
    toast('בקשה נשלחה');
    let info = {
      sub_id: id,
    };
    axios
      .post(`${API_URL}/users-permissions/get-budget-list`, info, header)
      .then((res) => {
        setBudgetList(res.data.value);
      })
      .catch((err) => {
        toast.error('שגיאה כללית');
      });
  };

  const createBudget = (id) => {
    let amount = window.prompt('Enter Amount');
    let name = window.prompt('Enter Name');
    if (!name || !amount) {
      return toast('האימות נכשל');
    }
    toast('בקשה נשלחה לשרת');
    let info = {
      sub_id: id,
      amount: amount,
      budget_name: name,
    };
    axios
      .post(`${API_URL}/users-permissions/create-budget`, info, header)
      .then((res) => {
        toast('נוצר בהצלחה');
        setTimeout(() => {
          window.location.reload();
        }, 200);
      })
      .catch((err) => {
        toast.error('שגיאה כללית');
      });
  };

  const deleteBudget = (name) => {
    toast('בקשה נשלחה');
    let info = {
      sub_id: selectSubID,
      budget_name: name,
    };
    axios
      .post(`${API_URL}/users-permissions/delete-budget`, info, header)
      .then((res) => {
        toast('נמחק');
        setTimeout(() => {
          window.location.reload();
        }, 200);
      })
      .catch((err) => {
        toast.error('שגיאה כללית');
      });
  };
  const assignrole = (id) => {
    toast('בקשה נשלחה לשרת');
    let info = {
      sub_id: id,
      // budget_name: name,
    };
    // /users-permissions/assign-role
    axios
      .post(`${API_URL}/users-permissions/assign-role`, info, header)
      .then((res) => {
        console.log(res);
        toast('נשלח לרישום');
        setTimeout(() => {
          window.location.reload();
        }, 200);
      })
      .catch((err) => {
        if (err.response?.data?.error?.code == 'InvalidAuthenticationToken') {
          return toast.error('חשבון אינו תקף');
        }

        toast.error('שגיאה כללית');
        console.log(err.response?.data);
      });
  };
  return (
    <>
      <Head>
        <title> subscriptions-אלדין</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <link
          rel='stylesheet'
          href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
        />
      </Head>

      <div className='container mt-5'>
        <Paper square>
          <Tabs
            value={value}
            indicatorColor='primary'
            textColor='primary'
            onChange={handleChange}
            aria-label='disabled tabs example'>
            <Tab
              onClick={(e) => setStage(0)}
              className='btn btn-default'
              label='Permission'
            />
            <Tab
              onClick={(e) => setStage(1)}
              className='btn btn-default'
              label='Subscription List'
            />
            <Tab
              onClick={(e) => setStage(2)}
              className='btn btn-default'
              label='Subscription Rename '
            />
            <Tab
              onClick={(e) => setStage(3)}
              className='btn btn-default'
              label='Add Tags'
            />
            <Tab
              onClick={(e) => setStage(4)}
              className='btn btn-default'
              label='Budget List'
            />
            <Tab
              onClick={(e) => setStage(5)}
              className='btn btn-default'
              label='Create Budget'
            />
            <Tab
              onClick={(e) => setStage(6)}
              className='btn btn-default'
              label='Remove Budget'
            />
          </Tabs>
        </Paper>

        {stage == 0 ? (
          <Card className='mt-6'>
            <CardContent>
              <h3>Permission</h3>
              <hr />
              <div className='mt-3'>
                {/* {budgetList.length == 0 ? (
                <table class="table table-responsive">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">ID</th>
                      <th scope="col">Authorization Source</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((el) => (
                      <tr>
                        <th scope="row"> {el.displayName} </th>
                        <td>{el.subscriptionId}</td>
                        <td>{el.state}</td>
                        <td> {el.authorizationSource} </td>
                        <td>
                          <button
                            onClick={(e) => getBudgetList(el.subscriptionId)}
                            className="btn btn-info btn-sm "
                          >
                            Get Budget List
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table class="table table-responsive">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetList.map((bgt) => (
                      <tr>
                        <th scope="row"> {bgt.name} </th>
                        <td>{bgt.properties.amount}</td>
                        <td>{bgt.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )} */}

                <table class='table table-responsive'>
                  <thead>
                    <tr>
                      <th scope='col'>Name</th>
                      <th scope='col'>ID</th>
                      <th scope='col'>Authorization Source</th>
                      <th scope='col'>Status</th>
                      <th scope='col'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((el) => (
                      <tr>
                        <th scope='row'> {el.displayName} </th>
                        <td>{el.subscriptionId}</td>
                        <td>{el.state}</td>
                        <td> {el.authorizationSource} </td>
                        <td>
                          <button
                            onClick={(e) => assignrole(el.subscriptionId)}
                            className='btn btn-info btn-sm '>
                            Assign Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          ''
        )}
        {stage == 1 ? (
          <Card className='mt-6'>
            <CardContent>
              <h3>Subscription List</h3>
              <hr />
              <div className='mt-3'>
                <table class='table table-responsive'>
                  <thead>
                    <tr>
                      <th scope='col'>Name</th>
                      <th scope='col'>ID</th>
                      <th scope='col'>Authorization Source</th>
                      <th scope='col'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((el) => (
                      <tr>
                        <th scope='row'> {el.displayName} </th>
                        <td>{el.subscriptionId}</td>
                        <td>{el.state}</td>
                        <td> {el.authorizationSource} </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          ''
        )}

        {stage == 2 ? (
          <Card className='mt-6'>
            <CardContent>
              <h3>Subscription Rename</h3>
              <hr />
              <div className='mt-3'>
                <table class='table table-responsive'>
                  <thead>
                    <tr>
                      <th scope='col'>Name</th>
                      <th scope='col'>ID</th>
                      <th scope='col'>Authorization Source</th>
                      <th scope='col'>Status</th>
                      <th scope='col'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((el) => (
                      <tr>
                        <th scope='row'> {el.displayName} </th>
                        <td>{el.subscriptionId}</td>
                        <td>{el.state}</td>
                        <td> {el.authorizationSource} </td>
                        <td>
                          <button
                            onClick={(e) =>
                              renameSubscription(el.subscriptionId)
                            }
                            className='btn btn-info btn-sm '>
                            Rename
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          ''
        )}

        {stage == 3 ? (
          <Card className='mt-6'>
            <CardContent>
              <h3>Add Tags</h3>
              <hr />
              <div className='mt-3'>
                <table class='table table-responsive'>
                  <thead>
                    <tr>
                      <th scope='col'>Name</th>
                      <th scope='col'>ID</th>
                      <th scope='col'>Authorization Source</th>
                      <th scope='col'>Tags</th>
                      <th scope='col'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((el) => (
                      <tr>
                        <th scope='row'> {el.displayName} </th>
                        <td>{el.subscriptionId}</td>
                        <td>{el.state}</td>
                        <td>
                          {el.tags ? (
                            <>
                              {Object.keys(el.tags).map((k) => (
                                <span className='mr-1 badge badge-info'>
                                  {el.tags[k]}
                                  {console.log(el.tags[k])}
                                </span>
                              ))}
                            </>
                          ) : (
                            ''
                          )}
                        </td>
                        <td>
                          <button
                            onClick={(e) =>
                              addTagSubscription(el.subscriptionId)
                            }
                            className='btn btn-info btn-sm '>
                            Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          ''
        )}

        {stage == 4 ? (
          <Card className='mt-6'>
            <CardContent>
              <h3>Budget List</h3>
              <hr />
              <div className='mt-3'>
                {budgetList.length == 0 ? (
                  <table class='table table-responsive'>
                    <thead>
                      <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>ID</th>
                        <th scope='col'>Authorization Source</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((el) => (
                        <tr>
                          <th scope='row'> {el.displayName} </th>
                          <td>{el.subscriptionId}</td>
                          <td>{el.state}</td>
                          <td> {el.authorizationSource} </td>
                          <td>
                            <button
                              onClick={(e) => getBudgetList(el.subscriptionId)}
                              className='btn btn-info btn-sm '>
                              Get Budget List
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table class='table table-responsive'>
                    <thead>
                      <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>Amount</th>
                        <th scope='col'>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetList.map((bgt) => (
                        <tr>
                          <th scope='row'> {bgt.name} </th>
                          <td>{bgt.properties.amount}</td>
                          <td>{bgt.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          ''
        )}

        {stage == 5 ? (
          <Card className='mt-6'>
            <CardContent>
              <h3>Create Budget </h3>
              <p>Select a Item to create </p>
              <hr />
              <div className='mt-3'>
                <table class='table table-responsive'>
                  <thead>
                    <tr>
                      <th scope='col'>Name</th>
                      <th scope='col'>ID</th>
                      <th scope='col'>Authorization Source</th>
                      <th scope='col'>Status</th>
                      <th scope='col'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((el) => (
                      <tr>
                        <th scope='row'> {el.displayName} </th>
                        <td>{el.subscriptionId}</td>
                        <td>{el.state}</td>
                        <td> {el.authorizationSource} </td>
                        <td>
                          <button
                            onClick={(e) => createBudget(el.subscriptionId)}
                            className='btn btn-info btn-sm '>
                            Create under this
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          ''
        )}

        {stage == 6 ? (
          <Card className='mt-6'>
            <CardContent>
              <h3> Remove Budget </h3>
              <hr />
              <div className='mt-3'>
                {budgetList.length == 0 ? (
                  <table class='table table-responsive'>
                    <thead>
                      <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>ID</th>
                        <th scope='col'>Authorization Source</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((el) => (
                        <tr>
                          <th scope='row'> {el.displayName} </th>
                          <td>{el.subscriptionId}</td>
                          <td>{el.state}</td>
                          <td> {el.authorizationSource} </td>
                          <td>
                            <button
                              onClick={(e) => getBudgetList(el.subscriptionId)}
                              className='btn btn-info btn-sm '>
                              Get Budget List
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table class='table table-responsive'>
                    <thead>
                      <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>Amount</th>
                        <th scope='col'>Type</th>
                        <th scope='col'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetList.map((bgt) => (
                        <tr>
                          <th scope='row'> {bgt.name} </th>
                          <td>{bgt.properties.amount}</td>
                          <td>{bgt.type}</td>
                          <td>
                            <button
                              onClick={(e) => deleteBudget(bgt.name)}
                              className='btn btn-danger btn-sm'>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
