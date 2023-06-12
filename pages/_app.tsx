import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store/store';
import { Worker } from '@react-pdf-viewer/core';
import withAuth from '@/utils/withAuth';
import dotenv from 'dotenv';
dotenv.config();

export default function App({ Component, pageProps }: AppProps) {
  // const WrappedComponent = withAuth(Component);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Component {...pageProps} />
        </Worker>
      </PersistGate>
    </Provider>
  );
}
