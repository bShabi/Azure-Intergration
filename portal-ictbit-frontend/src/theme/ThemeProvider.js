import React, { useState } from 'react';
import { createTheme } from '@material-ui/core';
import { themeCreator } from './base';
import { StylesProvider } from '@material-ui/core/styles/';
// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import rtlPlugin from 'stylis-plugin-rtl';

// const cacheRtl = createCache({
//   key: 'bloom-ui'
//   // @ts-ignore
//   stylisPlugins: [rtlPlugin]
// });

export const ThemeContext = React.createContext((themeName) => {});

const ThemeProvider = function (props) {
  const curThemeName = localStorage.getItem('appTheme') || 'PureLightTheme';
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName) => {
    localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <>
      {/* <CacheProvider value={cacheRtl}> */}
      <ThemeContext.Provider value={setThemeName}>
        <createTheme theme={theme}>{props.children}</createTheme>
      </ThemeContext.Provider>
      {/* </CacheProvider> */}
    </>
  );
};

export default ThemeProvider;
