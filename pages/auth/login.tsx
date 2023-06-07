import AuthLayout from '@/components/AuthLayout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setToken } from '@/redux/store/reducers/authReducer';
import { setUser } from '@/redux/store/reducers/loginReducer';
import AuthDataService from '../api/services/auth.service';
import UserDataService from '../api/services/user.service';

export default function Login() {
  const router = useRouter();
  const dis = useDispatch();
  const [userDataLogin, setUserDataLogin] = useState({
    email: '',
    password: '',
  });

  const handleEmailInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDataLogin((prevState) => ({
      ...prevState,
      email: event.target.value,
    }));
  };

  const handlePasswordInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDataLogin((prevState) => ({
      ...prevState,
      password: event.target.value,
    }));
  };

  const handleNavigateRegister = async () => {
    router.push('/auth/register');
  };

  const handleSubmitLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await AuthDataService.login(userDataLogin);
      const { token, user } = response.data;
      const userData = await UserDataService.get(user);
      const auth = {
        token,
        isAuthenticated: true,
      };
      const userLogin = {
        userId: userData.data._id,
        companyId: userData.data.company,
        userName: userData.data.name,
        email: userData.data.email,
      };
      dis(setUser(userLogin));
      dis(setToken(auth));
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthLayout>
      <div className={`flex justify-center items-center h-screen`}>
        <div
          className={`container mx-auto bg-light_neutral_200 w-[676px] rounded-md border border-dark_neutral_100 py-[60px] px-[48px]`}
        >
          <h1 className={`text-[32px] font-bold mb-[12px] text-primary_blue text-center`}>Selamat Datang!</h1>
          <p className={`text-center text-dark_neutral_300 text-[20px]`}>
            Masukkan email Anda yang telah terdaftar sebelumnya untuk mengakses sistem ini
          </p>
          <hr className={`w-full border-2 border-primary_blue my-[56px]`} />
          <form onSubmit={handleSubmitLogin}>
            <div className="mb-5">
              <label htmlFor="email" className={`block text-[18px] text-primary_dark mb-[12px] font-medium`}>
                Email
              </label>
              <div
                className={`flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
              >
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="username@email.com"
                  className={`w-full bg-transparent  outline-none `}
                  onChange={handleEmailInputChange}
                />
              </div>
            </div>
            <div className={`mb-[56px]`}>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className={`block text-[18px] text-primary_dark mb-[12px] font-medium`}>
                  Password
                </label>
                <a href="#" className="text-xs text-gray-500 dark:text-gray-300 hover:underline">
                  Lupa Password?
                </a>
              </div>
              <div
                className={`flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
              >
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className={`w-full bg-transparent  outline-none `}
                  onChange={handlePasswordInputChange}
                />
              </div>
            </div>

            <div className="mb-5">
              <button
                type="submit"
                className={`w-full px-3 py-4 text-primary_white bg-primary_blue rounded-md border hover:bg-primary_white hover:border-primary_blue hover:text-primary_blue focus:outline-none hover:transition`}
              >
                Masuk
              </button>
              <p className={`my-[18px] text-center text-dark_neutral_200 font-light`}>atau</p>
            </div>
          </form>
          <button
            onClick={handleNavigateRegister}
            className={`w-full px-3 py-4 text-primary_blue bg-primary_white rounded-md border  border-primary_blue hover:border-2 focus:outline-none hover:transition`}
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
