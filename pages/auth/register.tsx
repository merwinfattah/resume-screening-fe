import dynamic from 'next/dynamic';
import SelectItems from '@/components/SelectItems';
import User from '@/interfaces/User';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import CompanyDataService from '../api/services/company.service';
import UserDataService from '../api/services/user.service';

const AuthLayout = dynamic(() => import('@/components/AuthLayout'), { ssr: false });

export default function Register() {
  const router = useRouter();
  const [inputNameActive, setInputNameActive] = useState(false);
  const [inputPhoneActive, setInputPhoneActive] = useState(false);
  const [inputEmailActive, setInputEmailActive] = useState(false);
  const [inputPswdActive, setInputPswdActive] = useState(false);
  const [inputConfirmPswdActive, setInputConfirmPswdActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState<User>({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyId: '',
  });
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [nextForm, setNextForm] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [company, setCompany] = useState([
    {
      _id: '',
      name: '',
      address: '',
      _v: 0,
      createdDate: '',
    },
  ]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await CompanyDataService.getAll();
        const companies = response.data; // Assuming the API response contains an array of objects with properties 'value' and 'label'
        setCompany(companies);
        // Transform the received data into the desired format
        const formattedCompanies = companies.map((company: any) => ({
          value: company.name,
          label: company.name,
        }));

        setCompanyOptions(formattedCompanies);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanies();
  }, []);

  const handleNameInputChange = async (e: any) => {
    const { value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      name: value,
    }));
  };

  const handleCompanyInputChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedOption(selectedOption.value);
      console.log('ini option', company);
      setUserData((prevState) => ({
        ...prevState,
        companyId: company.find((item) => item.name === selectedOption.value)?._id || '',
      }));
    }
  };

  const handlePhoneInputChange = async (e: any) => {
    const { value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      phone: value,
    }));
  };

  const handleEmailInputChange = async (e: any) => {
    const { value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      email: value,
    }));
  };

  const handlePasswordInputChange = async (e: any) => {
    const { value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      password: value,
    }));
  };

  const handleConfirmPasswordInputChange = async (e: any) => {
    const { value } = e.target;
    setConfirmPassword(value);
    if (userData.password !== value) {
      setError('Password tidak sama');
    } else {
      setError('');
    }
  };

  const handleFormChange = async (e: any) => {
    e.preventDefault();
    setNextForm(!nextForm);
  };

  const handleNavigateLogin = async () => {
    router.push('/auth/login');
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    console.log(userData);

    try {
      const response = await UserDataService.create(userData);
      console.log(response.data);
      router.push('/auth/login');
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
                    className={`${
                      inputEmailActive ? 'outline outline-primary_blue drop-shadow-sm' : 'outline-none'
                    } flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
                  >
                    <input
                      type="email"
                      name="email"
                      id="email"
                      onFocus={() => setInputEmailActive(true)}
                      onBlur={() => setInputEmailActive(false)}
                      placeholder="username@email.com"
                      className={`w-full bg-transparent  outline-none `}
                      value={userData.email}
                      onChange={handleEmailInputChange}
                    />
                  </div>
                </div>
                <div className={`mb-[16px]`}>
                  <label htmlFor="password" className={`block text-[18px] text-primary_dark mb-[12px] font-medium`}>
                    Password
                  </label>
                  <div
                    className={`${
                      inputPswdActive ? 'outline outline-primary_blue drop-shadow-sm' : 'outline-none'
                    } flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      id="password"
                      onFocus={() => setInputPswdActive(true)}
                      onBlur={() => setInputPswdActive(false)}
                      placeholder="Password"
                      className={`w-full bg-transparent  outline-none `}
                      value={userData.password}
                      onChange={handlePasswordInputChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={``}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
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
                    className={`${
                      inputConfirmPswdActive ? 'outline outline-primary_blue drop-shadow-sm' : 'outline-none'
                    } flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
                  >
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm-password"
                      id="confirm-password"
                      onFocus={() => setInputConfirmPswdActive(true)}
                      onBlur={() => setInputConfirmPswdActive(false)}
                      placeholder="Password"
                      className={`w-full bg-transparent  outline-none `}
                      onChange={handleConfirmPasswordInputChange}
                      value={confirmPassword}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={``}>
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
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
                    className={`${
                      inputNameActive ? 'outline outline-primary_blue drop-shadow-sm' : 'outline-none'
                    } flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
                  >
                    <input
                      type="text"
                      name="full-name"
                      id="full-name"
                      onFocus={() => setInputNameActive(true)}
                      onBlur={() => setInputNameActive(false)}
                      placeholder="Tuliskan nama lengkap, contoh: Andreas Borjous"
                      className={`w-full bg-transparent  outline-none `}
                      value={userData.name}
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
                      value={selectedOption}
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
                    className={`${
                      inputPhoneActive ? 'outline outline-primary_blue drop-shadow-sm' : 'outline-none'
                    } flex  w-full h-[44px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
                  >
                    <input
                      type="text"
                      name="phone-number"
                      id="phone-number"
                      onFocus={() => setInputPhoneActive(true)}
                      onBlur={() => setInputPhoneActive(false)}
                      placeholder="+62xxxxxxxx"
                      className={`w-full bg-transparent  outline-none `}
                      value={userData.phone}
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
                onClick={(e) => handleFormChange(e)}
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
