import { useContext } from 'react';

import {
  Box,
  Container,
  Hidden,
  IconButton,
  Paper,
  Tooltip,
} from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import MenuTwoToneIcon from '@material-ui/icons/MenuTwoTone';
import { SidebarContext } from 'src/contexts/SidebarContext';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import Sidebar from '../Sidebar';

import HeaderMenu from './Menu';
import HeaderButtons from './Buttons';
import HeaderUserbox from './Userbox';
import Logo from 'src/components/Logo';
import AuthContext from '@/context/AuthContext';

const HeaderWrapper = experimentalStyled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
         padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 5;
        background-color: ${theme.header.background};
        box-shadow: ${theme.header.boxShadow};
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            // right: ${theme.sidebar.width};
            width: 100%;
        }
`
);
// const HeaderWrapper = experimentalStyled(Box)(
//   ({ theme }) => `
//         height: ${theme.header.height};
//         color: ${theme.header.textColor};
//          padding: ${theme.spacing(0, 2)};
//         right: 0;
//         z-index: 5;
//          background-color: ${theme.header.background};
//         box-shadow: ${theme.header.boxShadow};
//         justify-content: space-between;
//         width: 100%;
//         @media (min-width: ${theme.breakpoints.values.lg}px) {
//             // right: ${theme.sidebar.width};
//             width: 100%;
//         }
// `
// );

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const { member } = useContext(AuthContext);
  const openSidebar = () => {
    toggleSidebar();
    setTimeout(() => {
      let mw = document.getElementById('MainWrapper');
      let sd = document.getElementById('drwer');
      console.log(sd, 'sd');
      if (sd) {
        mw.style.marginRight = '200px';
      }
    }, 200);
  };
  return (
    <div>
      <Paper>
        <HeaderWrapper display={'flex'} alignItems='center'>
          <Box>
            <Hidden mdDown>
              <HeaderUserbox />
            </Hidden>
          </Box>
          <Box display='flex' alignItems='center'>
            <HeaderButtons />
          </Box>
          <Box display='flex' alignItems='center'>
            <HeaderMenu />
            <Hidden lgUp>
              <Tooltip arrow title='Search'>
                <IconButton color='primary' style={{ position: 'absulute' }}>
                  {/* <IconButton color="primary" onClick={toggleSidebar}> */}
                  {!sidebarToggle ? (
                    <span onClick={(e) => openSidebar()}>
                      <MenuTwoToneIcon />
                    </span>
                  ) : (
                    <CloseTwoToneIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Hidden>
          </Box>
        </HeaderWrapper>
        {/* <Sidebar /> */}
      </Paper>
    </div>
  );
}

export default Header;
