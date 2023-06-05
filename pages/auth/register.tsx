import AuthLayout from '@/components/AuthLayout';
import SelectItems from '@/components/SelectItems';
import User from '@/interfaces/User';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../api/http-common';

export default function Register() {
  const router = useRouter();
  const [userData, setUserData] = useState<User>({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyId: '6430e5a14dd8b71d95db8352',
  });
  const [nextForm, setNextForm] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [companyOptions, setCompanyOptions] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${baseURL}api/company/get-all-company`);
        console.log(response.data);
        const companies = response.data; // Assuming the API response contains an array of objects with properties 'value' and 'label'

        // Transform the received data into the desired format
        // const formattedCompanies = companies.map((company: any) => ({
        //   value: company.name,
        //   label: company.name,
        // }));

        // setCompanyOptions(formattedCompanies);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanies();
  }, []);

  const handleNameInputChange = (e: any) => {
    const { value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      name: value,
    }));
  };

  const handleCompanyInputChange = (selectedOption: any) => {
    if (selectedOption) {
      setUserData((prevState) => ({
        ...prevState,
        company: selectedOption.value,
      }));
    }
  };

  const handlePhoneInputChange = (e: any) => {
    const { value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      phone: value,
    }));
  };

  const handleEmailInputChange = (e: any) => {
    const { value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      email: value,
    }));
  };

  const handlePasswordInputChange = (e: any) => {
    const { value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      password: value,
    }));
  };

  const handleFormChange = () => {
    setNextForm(!nextForm);
  };

  const handleNavigateLogin = () => {
    router.push('/auth/login');
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseURL}api/user/create-user`, userData);
      console.log(response.data);
      // Handle success or redirect to another page
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <AuthLayout>
      <div className={`flex justify-center items-center h-screen`}>
        <div
          className={`container mx-auto bg-light_neutral_200 w-[676px] rounded-md border border-dark_neutral_100 py-[60px] px-[48px]`}
        >
          <h1 className={`text-[32px] font-bold mb-[12px] text-primary_blue text-center`}>Daftar Sekarang</h1>
          <p className={`text-center text-dark_neutral_300 text-[20px]`}>
            Daftar sekarang untuk mulai mengakses sistem ini
          </p>
          <div className={`flex justify-center gap-[12px] items-center my-[56px]`}>
            <div
              className={`${
                nextForm ? 'border  text-primary_dark border-primary_dark' : 'bg-primary_blue text-primary_white'
              } flex rounded-full w-[42px] h-[42px]  items-center justify-center`}
            >
              1
            </div>
            <hr className={` w-[72px] border-2 border-primary_blue`} />
            <div
              className={`${
                nextForm ? 'bg-primary_blue text-primary_white' : 'border  text-primary_dark border-primary_dark'
              } flex rounded-full w-[42px] h-[42px]  items-center justify-center`}
            >
              2
            </div>
          </div>
          <form id="regis-form" onSubmit={handleFormSubmit}>
            {nextForm ? (
              <>
                <div className={`mb-[16px]`}>
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
                <div className={`mb-[16px]`}>
                  <label htmlFor="password" className={`block text-[18px] text-primary_dark mb-[12px] font-medium`}>
                    Password
                  </label>
                  <div
                    className={`flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
                  >
                    <input
                      type="text"
                      name="password"
                      id="password"
                      placeholder="Password"
                      className={`w-full bg-transparent  outline-none `}
                      onChange={handlePasswordInputChange}
                    />
                  </div>
                </div>
                <div className={`mb-[56px]`}>
                  <label
                    htmlFor="confirm-password"
                    className={`block text-[18px] text-primary_dark mb-[12px] font-medium`}
                  >
                    Ketik Ulang Password
                  </label>
                  <div
                    className={`flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
                  >
                    <input
                      type="text"
                      name="confirm-password"
                      id="confirm-password"
                      placeholder="Password"
                      className={`w-full bg-transparent  outline-none `}
                      onChange={(e) => {
                        if (e.target.value !== userData.password) {
                          setError('Password tidak sama');
                        } else {
                          setError('');
                        }
                      }}
                    />
                  </div>
                  <p className={` ${error ? 'visible' : 'invisible'} text-red-500 text-xs italic mb-4 h-3`}>{error}</p>
                </div>
              </>
            ) : (
              <>
                <div className={`mb-[16px]`}>
                  <label htmlFor="full-name" className={`block text-[18px] text-primary_dark mb-[12px] font-medium`}>
                    Nama Lengkap
                  </label>
                  <div
                    className={`flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
                  >
                    <input
                      type="text"
                      name="full-name"
                      id="full-name"
                      placeholder="Tuliskan nama lengkap, contoh: Andreas Borjous"
                      className={`w-full bg-transparent  outline-none `}
                      onChange={handleNameInputChange}
                    />
                  </div>
                </div>
                <div className={`mb-[16px]`}>
                  <label htmlFor="company-name" className={`block text-[18px] text-primary_dark mb-[12px] font-medium`}>
                    Nama Perusahaan Anda
                  </label>
                  <div>
                    <SelectItems
                      options={companyOptions}
                      id="company-name"
                      inputName="company-name"
                      placeholder="Pilih perusahaan anda"
                      width="580px"
                      handleChange={handleCompanyInputChange}
                      searchable={false}
                    />
                  </div>
                </div>
                <div className={`mb-[56px]`}>
                  <label htmlFor="phone-number" className={`block text-[18px] text-primary_dark mb-[12px] font-medium`}>
                    Nomor Handphone
                  </label>
                  <div
                    className={`flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
                  >
                    <input
                      type="text"
                      name="phone-number"
                      id="phone-number"
                      placeholder="+62xxxxxxxx"
                      className={`w-full bg-transparent  outline-none `}
                      onChange={handlePhoneInputChange}
                    />
                  </div>
                </div>
              </>
            )}
          </form>
          {nextForm ? (
            <>
              <button
                type="submit"
                form="regis-form"
                className={`w-full px-3 py-4 mb-[18px] text-primary_white bg-primary_blue rounded-md border hover:bg-primary_white hover:border-primary_blue hover:text-primary_blue focus:outline-none hover:transition`}
              >
                Daftar
              </button>
              <button
                onClick={handleFormChange}
                className={`w-full px-3 py-4 text-primary_blue bg-primary_white rounded-md border  border-primary_blue hover:border-2 focus:outline-none hover:transition`}
              >
                Kembali ke Langkah Sebelumnya
              </button>
            </>
          ) : (
            <>
              <button
                className={`w-full px-3 py-4 text-primary_white bg-primary_blue rounded-md border hover:bg-primary_white hover:border-primary_blue hover:text-primary_blue focus:outline-none hover:transition`}
                onClick={handleFormChange}
              >
                Langkah Berikutnya
              </button>
              <p className={`my-[18px] text-center text-dark_neutral_200 font-light`}>atau</p>
              <button
                onClick={handleNavigateLogin}
                className={`w-full px-3 py-4 text-primary_blue bg-primary_white rounded-md border  border-primary_blue hover:border-2 focus:outline-none hover:transition`}
              >
                Masuk Sekarang
              </button>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
