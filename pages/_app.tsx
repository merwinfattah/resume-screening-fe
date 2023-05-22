import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { registerSessionKeys, registerTotalPositionKeys } from '@/utils/sessionStorage';
import { Provider } from 'react-redux';
import  store  from '../redux/store/store';
import { Worker } from '@react-pdf-viewer/core';



export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    registerSessionKeys();
    registerTotalPositionKeys();
  }, []);
  return (
  <Provider store={store}>
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <Component {...pageProps} />
    </Worker>
  </Provider>
  )
}

