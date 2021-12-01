import PropTypes from 'prop-types';
import { experimentalStyled } from '@material-ui/core/styles';
import { Box, Container } from '@material-ui/core';
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const MainWrapper = experimentalStyled(Box)(
  ({ theme }) => `
        flex: 1 1 auto;
        display: flex;
        height: 100%;
        
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            // padding-right: ${theme.sidebar.width};
        }
`
);

const MainContent = experimentalStyled(Box)(
  ({ theme }) => `
 
        flex: 1 1 auto;
        overflow: auto;

`
);

const SidebarLayout = ({ children }) => {
  useEffect(() => {
    let mw = document.getElementById('MainWrapper');
    let sd = document.getElementById('drwer');
    console.log(sd, 'sd');
    if (sd) {
      mw.style.marginRight = '200px';
    }
    if (window.innerWidth > 1279) {
      mw.style.marginRight = '120px';
    }
    setTimeout(() => {
      let x = document.querySelector('.css-327y6d');
      if (x) document.querySelector('.css-327y6d').style.width = '235px';
    }, 200);
  }, []);
  return (
    <>
      <div>
        {/* <Sidebar /> */}
        <Header />
      </div>
      <MainContent>{children}</MainContent>
      {/* <footer style={{}}>
        <Footer />
      </footer> */}
      {/* <footer
        style={{
          textAlign: 'center',
          background: ' white',
          padding: ' 10px 0',
          marginTop: ' 30px',
        }}>
        <p>© 2015 - 2021 BenShabi® Global Inc. </p>
      </footer> */}
      <MainWrapper id='MainWrapper' className='MainWrapper'>
        {' '}
      </MainWrapper>
    </>
  );
};

SidebarLayout.propTypes = {
  children: PropTypes.node,
};

export default SidebarLayout;
