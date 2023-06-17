import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export { RouteGuard };

function RouteGuard({ children }: any) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const { token, isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    // router.events.on('routeChangeStart', hideContent);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      //   router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/auth/login'];
    const path = url.split('?')[0];
    console.log('auth', isAuthenticated);
    console.log('token', token);
    if (!token && !publicPaths.includes(path)) {
      console.log('masuk false');
      setAuthorized(false);
      router.push({
        pathname: '/auth/login',
        query: { returnUrl: router.asPath },
      });
    } else {
      console.log('masuk true');
      setAuthorized(true);
    }
  }

  return authorized && children;
}
