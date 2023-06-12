import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import Login from '@/pages/auth/login';

const withAuth = (WrappedComponent: any) => {
  const Auth = (props: AppProps) => {
    const authStatus = useSelector((state: any) => state.auth.isAuthenticated);
    const router = useRouter();

    if (authStatus) {
      return <WrappedComponent {...props} />;
    } else {
      return <Login />;
    }
  };

  return Auth;
};

export default withAuth;
