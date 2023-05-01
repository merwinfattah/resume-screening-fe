import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { registerSessionKeys } from '@/utils/sessionStorage';
import { Provider } from 'react-redux';
import  store  from '../redux/store/store';



export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    registerSessionKeys();
  }, []);
  return (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
  )
}

