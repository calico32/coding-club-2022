import { Toaster } from '@blueprintjs/core';
import type { AppProps } from 'next/app';
import React, { createRef } from 'react';
import { ToasterContext } from '../lib/toaster';
import '../styles/globals.scss';

function App({ Component, pageProps }: AppProps) {
  const toaster = createRef<Toaster>();
  return (
    <>
      <Toaster ref={toaster} />
      <ToasterContext.Provider value={toaster}>
        <Component {...pageProps} />
      </ToasterContext.Provider>
    </>
  );
}

export default App;
