import { Toaster } from '@blueprintjs/core';
import type { AppProps } from 'next/app';
import React, { useRef } from 'react';
import { ToasterContext } from '../lib/toaster';
import '../styles/globals.scss';

function App({ Component, pageProps }: AppProps) {
  const toaster = useRef<Toaster>(null);
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
