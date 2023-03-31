import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { registerSessionKeys } from '@/utils/sessionStorage';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    registerSessionKeys();
  }, []);
  return <Component {...pageProps} />
}

