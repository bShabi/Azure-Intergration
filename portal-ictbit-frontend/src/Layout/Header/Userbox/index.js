import { useContext, useRef, useState } from 'react';
// import useAuth from 'src/hooks/useAuth';
import NavLink from 'src/utils/Link';
import { useRouter } from 'next/router';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import InboxTwoToneIcon from '@material-ui/icons/InboxTwoTone';
import { experimentalStyled } from '@material-ui/core/styles';
import ExpandMoreTwoToneIcon from '@material-ui/icons/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@material-ui/icons/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@material-ui/icons/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@material-ui/icons/AccountTreeTwoTone';
import AssignmentIndTwoToneIcon from '@material-ui/icons/AssignmentIndTwoTone';
import AuthContext from '../../../../context/AuthContext';

const UserBoxButton = experimentalStyled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = experimentalStyled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = experimentalStyled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = experimentalStyled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = experimentalStyled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const { t } = useTranslation();

  const router = useRouter();

  // const { user, logout } = useAuth();

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const { member } = useContext(AuthContext);
  console.log('memberv2', member?.id);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      // await logout();
      await router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <UserBoxButton color='secondary' ref={ref} onClick={handleOpen}>
        {/*<Avatar variant="rounded" alt={user.name} src={user.avatar} />*/}
        {/* <Avatar variant="rounded" alt={'User'} src={''} /> */}
        <AssignmentIndTwoToneIcon fontSize={'large'} />
        <Hidden mdDown>
          <UserBoxText>
            {/*<UserBoxLabel variant="body1">{user.name}</UserBoxLabel>*/}
            <UserBoxLabel variant='body1'>{member?.azureUsername}</UserBoxLabel>
            <UserBoxDescription variant='body2'>
              {/*{user.jobtitle}*/}
              {member?.isManager && <b>שלום מנהל</b>}
              {!member?.isManager && <b>שלום משתמש</b>}
              <br></br>
              {member?.azureEmail}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <MenuUserBox sx={{ minWidth: 210 }} display='flex'>
          {/*<Avatar variant="rounded" alt={user.name} src={user.avatar} />*/}
          <AssignmentIndTwoToneIcon />
          <UserBoxText>
            {/*<UserBoxLabel variant="body1">{user.name}</UserBoxLabel>*/}
            <UserBoxLabel variant='body1'>{member?.azureUsername}</UserBoxLabel>
            <UserBoxDescription variant='body2'>
              {/*{user.jobtitle}*/}
              {member?.azureEmail}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color='primary' fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            {t('Sign out')}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
