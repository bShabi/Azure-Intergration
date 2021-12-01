import * as React from 'react';
import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { PureLightTheme } from '../src/theme/schemes/PureLightTheme';
import createEmotionCache from '../src/utils/createEmotionCache';
import Layout from '../src/Layout/index';
import { SidebarProvider } from '../src/contexts/SidebarContext';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/styles';
import AuthContext, { AuthProvider } from '../context/AuthContext';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { toast, ToastContainer } from 'react-toastify';

import Footer from '../src/Layout/Footer';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import { socket } from '../components/util/web-socket';
import { useRouter } from 'next/router';
import { getStaticProps } from '../src/components/Dialogs/Subscripition/Request';
// Configure JSS
const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  useEffect(() => {
    let strapiUserName = window.localStorage.getItem('strapiUserName');
    socket.emit('join', { username: strapiUserName, room: 'room' }, (data) => {
      toast(data.message);
    });

    socket.on('notification', (data) => {
      console.log('hii', router.asPath);
      toast.success('notification received');
      getStaticProps();

      setTimeout(() => {
        router.reload();
      }, 1500);
      //router.push(router.asPath);
    });
  }, []);

  function pushUpdateNotification() {
    socket.emit('updateApiCall');
  }

  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SidebarProvider>
          <CacheProvider value={emotionCache}>
            <Head>
              <title>אלדין</title>
              <meta
                name='viewport'
                content='initial-scale=1, width=device-width'
              />
              <script
                src='https://kit.fontawesome.com/2a7fe4f268.js'
                crossorigin='anonymous'></script>
            </Head>
            <ThemeProvider theme={PureLightTheme}>
              <StylesProvider jss={jss}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {/* <Layout> */}
                <ToastContainer />

                <Component {...pageProps} />
                {/* </Layout> */}
              </StylesProvider>
            </ThemeProvider>
          </CacheProvider>
        </SidebarProvider>
      </LocalizationProvider>
      <Footer />
    </AuthProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
