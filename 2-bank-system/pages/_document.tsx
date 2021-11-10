import { Classes } from '@blueprintjs/core';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import theme from '../lib/theme';

class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className={(theme.dark ? `${Classes.DARK} bg-darkgray-3` : '') + 'font-sans'}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
