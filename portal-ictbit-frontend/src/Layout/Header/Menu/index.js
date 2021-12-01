import {
  Box,
  Button,
  Dialog,
  Divider,
  List,
  ListItem,
  ListItemText,
  Menu,
  AppBar,
  Toolbar,
  MenuItem,
  Tab,
  Avatar,
  Tabs,
  useTheme,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AccountBalanceTwoTone from '@material-ui/icons/AccountBalanceTwoTone';

import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import { useEffect, useRef, useState, forwardRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import Setting from '../../../components/Dialogs/Settings';
import AnalyticsTwoToneIcon from '@material-ui/icons/AnalyticsTwoTone';
import AccountTreeTwoToneIcon from '@material-ui/icons/AccountTreeTwoTone';
import LiveHelpTwoToneIcon from '@material-ui/icons/LiveHelpTwoTone';
import DnsTwoToneIcon from '@material-ui/icons/DnsTwoTone';

import NavLink from 'src/utils/Link';
import { experimentalStyled } from '@material-ui/core/styles';
import { useStyles } from '@material-ui/core/styles';
import ExpandMoreTwoToneIcon from '@material-ui/icons/ExpandMoreTwoTone';
import { makeStyles } from '@material-ui/styles';
import theme from '../../../theme';
import { useRouter } from 'next/router';
import AuthContext from '../../../../context/AuthContext';
import Logo from 'public/ictbit.png';
import { CleaningServices } from '@material-ui/icons';
import DashbaordIcon from 'public/dashbaordIcon.png';

// const span = experimentalStyled(Avatar)(
//   ({ theme }) => `
//       background: ${theme.colors.gradients.blue3};
//       color:  ${theme.palette.primary.contrastText};
// `
// );
const ListWrapper = experimentalStyled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
            font-size: 20px;
        }

        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            font-size: 20px;
            color: 'red';
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
                font-size: 20px;

                .MuiListItemText-root {
                  font-size: 200px;
                  .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 45px;
                            font-size: 20px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function HeaderMenu() {
  const { t } = useTranslation();
  const { member } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  console.log('🚀 ~ file: index.js ~ line 104 ~ HeaderMenu ~ user', isAdmin);
  const router = useRouter();
  useEffect(() => {
    if (member) {
      let admin = member.isManager;
      setIsAdmin(admin);
      console.log('adminadmin', member.isManager);
    }
  });
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log('isAdmin 117', isAdmin);

  const [value, setValue] = useState('Requests');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const isUserPathUrl = (path) => {
    return path === '/Requests/Users' ? true : false;
  };

  return (
    <>
      <div dir='rtl'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 'fit-content',
            paddingRight: 1.5,
            // border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            color: 'text.secondary',
            '& svg': {
              m: 1.5,
            },
            '& hr': {
              mx: 0.5,
            },
          }}>
          {' '}
          <Image
            height={70}
            width={200}
            src={Logo}
            alt='Picture of the author'
          />
          <Divider orientation='vertical' flexItem />
          {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 'fit-content',
              // border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              bgcolor: 'background.paper',
              color: 'text.secondary',
              '& svg': {
                m: 1.5,
              },
              '& hr': {
                mx: 0.5,
              },
            }}>
     
           <Tab
              onClick={() => {
                router.push('/dashboard');
              }}
              value='dashboard'
              label={
                <Box
                  style={{
                    display: true ? 'flex' : 'none',
                    alignItems: 'center',
                    fontSize: 24,
                  }}>
                  {t('לוח בקרה')}

                  <Box display='flex' alignItems='center' pl={0.3}>
                    <AnalyticsTwoToneIcon color='white' fontSize='small' />
                  </Box>
                </Box>
              }
         

            /> */}
          {/* <ListWrapper>
            <Tabs
              value={value}
              classes={{ root: 'MuiListItem-indicators' }}
              background={'white'}
              onChange={handleChange}
              aria-label='wrapped label tabs example'>
              <Tab
                onClick={() => {
                  router.push(
                    isAdmin ? '/Requests/Manager' : '/Requests/Users'
                  );
                }}
                value='Dashobard'
                classes={{ root: 'MuiListItem-indicators' }}
                label={
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Box style={{ fontSize: '1.5rem' }}>
                      {t('לוח בקרה alamin')}
                    </Box>
                    {value === 'Dashobard' && (
                      <span
                        style={{
                          background: theme.palette.primary.main,
                          borderRadius: '2rem',
                          width: '5rem',
                          height: '4px',
                        }}
                      />
                    )}
                  </Box>
                }
              />
              <Tab
                onClick={() => {
                  router.push(
                    isAdmin ? '/Requests/Manager' : '/Requests/Users'
                  );
                }}
                value='Reqeust'
                classes={{ root: 'MuiListItem-indicators' }}
                label={
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Box style={{ fontSize: '1.5rem' }}>{t('כלל הבקשות')}</Box>
                    {value === 'Reqeust' && (
                      <span
                        style={{
                          background: theme.palette.primary.main,
                          borderRadius: '2rem',
                          width: '5rem',
                          height: '4px',
                        }}
                      />
                    )}
                  </Box>
                }
              />
              <Tab
                onClick={() => {
                  router.push(
                    isAdmin ? '/Requests/Manager' : '/Requests/Users'
                  );
                }}
                value='Setting'
                classes={{ root: 'MuiListItem-indicators' }}
                label={
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Box style={{ fontSize: '1.5rem' }}>{t('הגדרות')}</Box>
                    {value === 'Setting' && (
                      <span
                        style={{
                          background: theme.palette.primary.main,
                          borderRadius: '2rem',
                          width: '5rem',
                          height: '4px',
                        }}
                      />
                    )}
                  </Box>
                }
              />
              <Tab
                onClick={() => {
                  router.push(
                    isAdmin ? '/Requests/Manager' : '/Requests/Users'
                  );
                }}
                value='Support'
                classes={{ root: 'MuiListItem-indicators' }}
                label={
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Box style={{ fontSize: '1.5rem' }}>{t('תמיכה טכנית')}</Box>
                    {value === 'Support' && (
                      <span
                        style={{
                          background: theme.palette.primary.main,
                          borderRadius: '2rem',
                          width: '5rem',
                          height: '4px',
                        }}
                      />
                    )}
                  </Box>
                }
              />
            </Tabs>
          </ListWrapper> */}
          <ListWrapper>
            <List component={Box} display='flex'>
              <ListItem
                classes={{ root: 'MuiListItem-indicators' }}
                button
                style={{
                  display: isUserPathUrl(router.asPath) ? 'none' : 'flex',
                }}
                onClick={() => {
                  setValue('Dashboard');
                  router.push('/dashboard');
                }}
                href='/Dashboard'>
                <ListItemText
                  primaryTypographyProps={{ noWrap: true }}
                  classes={{ root: 'MuiListItem-indicators-Font' }}
                  onClick={() => router.push('/Dashbaord')}
                />
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Box style={{ fontSize: 18 }}>
                    <Box display='flex' alignItems='center'>
                      <AccountBalanceTwoTone fontSize='medium' />
                      <span
                        style={{
                          whiteSpace: 'nowrap',
                          font: 'black',
                          fontWeight: value === 'Dashboard' && 700,
                        }}>
                        לוח בקרה
                      </span>{' '}
                    </Box>
                  </Box>
                  {value === 'Dashboard' && (
                    <span
                      style={{
                        background: theme.palette.primary.main,
                        borderRadius: '2rem',
                        width: '7rem',
                        height: '4px',
                      }}
                    />
                  )}
                </Box>
              </ListItem>

              <ListItem
                classes={{ root: 'MuiListItem-indicators' }}
                button
                onClick={() => setValue('Requests')}>
                <ListItemText
                  primaryTypographyProps={{ noWrap: true }}
                  classes={{ root: 'MuiListItem-indicators-Font' }}
                  onClick={() => {
                    router.push('/Requests/Users');
                  }}
                  // primary={t(
                  //   <span style={{ fontSize: 20 }}>'כלל הבקשות Alamin</span>
                  // )}
                />
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Box style={{ fontSize: 18 }}>
                    <Box
                      display='flex'
                      alignItems='center'
                      onClick={() => {
                        router.push('/Requests/Users');
                      }}>
                      {isUserPathUrl(router.asPath) ? (
                        <AccountBalanceTwoTone fontSize='medium' />
                      ) : (
                        <DnsTwoToneIcon fontSize='medium' />
                      )}
                      <span
                        style={{
                          whiteSpace: 'nowrap',
                          font: 'black',
                          fontWeight: value === 'Requests' && 700,
                        }}>
                        כלל הבקשות
                      </span>{' '}
                    </Box>
                  </Box>
                  {value === 'Requests' && (
                    <span
                      style={{
                        background: theme.palette.primary.main,
                        borderRadius: '2rem',
                        width: '5rem',
                        height: '4px',
                      }}
                    />
                  )}
                </Box>
              </ListItem>
              <ListItem
                classes={{ root: 'MuiListItem-indicators' }}
                style={{
                  display: isUserPathUrl(router.asPath) ? 'none' : 'flex',
                }}
                button
                onClick={() => setValue('Setting')}
                href='/Setting'>
                <ListItemText
                  classes={{ root: 'MuiListItem-indicators-Font' }}
                  primaryTypographyProps={{ noWrap: true }}
                  onClick={() => router.push('/Setting')}
                  fontSize={20}
                  style={{ fontSize: 20 }}
                />

                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Box style={{ fontSize: 18 }}>
                    <Box display='flex' alignItems='center'>
                      <SettingsTwoToneIcon fontSize='medium' />

                      <span
                        style={{
                          fontWeight: value === 'Setting' && 700,
                        }}>
                        הגדרות
                      </span>
                    </Box>
                  </Box>
                  {value === 'Setting' && (
                    <span
                      style={{
                        background: theme.palette.primary.main,
                        borderRadius: '2rem',
                        width: '5rem',
                        height: '4px',
                      }}
                    />
                  )}
                </Box>
              </ListItem>
              <ListItem
                classes={{ root: 'MuiListItem-indicators' }}
                button
                onClick={() => setValue('Support')}
                href='/Support'>
                <ListItemText
                  classes={{ root: 'MuiListItem-indicators-Font' }}
                  primaryTypographyProps={{ noWrap: true }}
                  onClick={() => router.push('/Support')}
                  style={{ fontSize: 20 }}
                />
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Box style={{ fontSize: 18 }}>
                    <Box display='flex' alignItems='center'>
                      <LiveHelpTwoToneIcon fontSize='medium' />

                      <span
                        style={{
                          whiteSpace: 'nowrap',
                          font: 'black',
                          fontWeight: value === 'Dashboard' && 700,
                        }}>
                        תמיכה
                      </span>
                    </Box>
                  </Box>
                  {value === 'Support' && (
                    <span
                      style={{
                        background: theme.palette.primary.main,
                        borderRadius: '2rem',
                        width: '5rem',
                        height: '4px',
                      }}
                    />
                  )}
                </Box>
              </ListItem>
            </List>
          </ListWrapper>
        </Box>
        {/* </Box> */}
      </div>
    </>
  );
}

export default HeaderMenu;
