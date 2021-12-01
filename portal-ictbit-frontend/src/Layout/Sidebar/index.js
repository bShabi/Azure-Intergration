import { useContext } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { SidebarContext } from 'src/contexts/SidebarContext';
import { useTranslation } from 'react-i18next';

import { Box, Button, Divider, Drawer, Hidden } from '@material-ui/core';

import { experimentalStyled } from '@material-ui/core/styles';
import SidebarMenu from './SidebarMenu';

const SidebarWrapper = experimentalStyled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        color: ${theme.sidebar.textColor};
        background: ${theme.sidebar.background};
        box-shadow: ${theme.sidebar.boxShadow};
        height: 100%;
        
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            position: fixed;
            z-index: 10;
            border-top-right-radius: ${theme.general.borderRadius};
            border-bottom-right-radius: ${theme.general.borderRadius};
            right: 0;
        }
`
);

const TopSection = experimentalStyled(Box)(
  ({ theme }) => `
        margin: ${theme.spacing(3, 4)};
`
);

const SidebarDivider = experimentalStyled(Divider)(
  ({ theme }) => `
        background: ${theme.sidebar.dividerBg};
`
);

function Sidebar() {
  const { t } = useTranslation();
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();

  return (
    <div dir={'rtl'} id='sidebar' style={{ width: '200px' }}>
      <Hidden lgDown>
        <SidebarWrapper>
          <Scrollbars autoHide>
            <SidebarDivider sx={{ my: 2, mx: 2 }} />
            <SidebarMenu />
          </Scrollbars>
        </SidebarWrapper>
      </Hidden>
      <Hidden lgUp>
        <Drawer
          id='drwer'
          anchor='right'
          open={sidebarToggle}
          onClose={closeSidebar}
          variant='temporary'
          elevation={9}>
          <SidebarWrapper>
            <Scrollbars autoHide>
              <SidebarDivider sx={{ my: 2, mx: 2 }} />
              <SidebarMenu />
            </Scrollbars>
          </SidebarWrapper>
        </Drawer>
      </Hidden>
    </div>
  );
}

export default Sidebar;
