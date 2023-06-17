import { HiLocationMarker } from 'react-icons/hi';
import { IoSettingsOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CompanyDataService from '../pages/api/services/company.service';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/redux/store/reducers/loginReducer';
import { clearToken } from '@/redux/store/reducers/authReducer';
import { FaUser } from 'react-icons/fa';

export default function Navbar(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userName, email, companyId } = useSelector((state: any) => state.login);
  const [companyData, setCompanyData] = useState({
    name: '',
    address: '',
  });
  const [isShow, setIsShow] = useState(false);
  const handleHoverUser = () => {
    setIsShow(!isShow);
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await CompanyDataService.get(companyId);
        const { name, address } = response.data;
        setCompanyData({ name, address });
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearToken());
    router.push('/auth/login');
  };

  return (
    <nav className={`bg-primary_blue`}>
      <div className={` max-w-full  px-8 py-[14px] flex justify-between items-center text-primary_white`}>
        <div className={`flex items-center justify-between gap-[359px]`}>
          <div className={`flex items-center gap-3`}>
            <div className={` bg-primary_white w-9 h-9 rounded-full`}>
              <div className={` bg-primary_blue rotate-45 transform origin-bottom-left`}></div>
            </div>
            <div>
              <div>{companyData.name}</div>
              <div>
                <HiLocationMarker className={`inline-block mr-[2px]`} />
                <small>{companyData.address}</small>
              </div>
            </div>
          </div>
          <div className={`flex gap-16   text-sm`}>
            <Link href="/">
              {router.pathname === '/' ? (
                <p
                  className={`flex font-bold uppercase w-[100px]  h-[37px] items-center justify-center  rounded-[32px] bg-primary_white text-primary_blue`}
                >
                  BERANDA
                </p>
              ) : (
                <p className={`font-bold uppercase w-[100px] h-[37px] py-[10px] text-center rounded-[32px] `}>
                  BERANDA
                </p>
              )}
            </Link>
            <Link href="/talent-pool">
              {router.pathname === '/talent-pool' || router.pathname === '/talent-pool/upload-cv' ? (
                <p
                  className={`font-bold uppercase w-[129px] h-[37px] py-[10px] text-center rounded-[32px] bg-primary_white text-primary_blue`}
                >
                  Talent Pool
                </p>
              ) : (
                <p className={`font-bold uppercase w-[129px] h-[37px] py-[10px] text-center rounded-[32px] `}>
                  Talent Pool
                </p>
              )}
            </Link>
            <Link href="/jobs">
              {router.pathname === '/jobs' || router.pathname === '/jobs/add-new-position' ? (
                <p
                  className={` font-bold w-[70px] h-[37px] py-[10px] text-center rounded-[32px] bg-primary_white text-primary_blue`}
                >
                  POSISI
                </p>
              ) : (
                <p className={`font-bold w-[70px] h-[37px] py-[10px] text-center rounded-[32px]`}>POSISI</p>
              )}
            </Link>
            <Link href="/resolved">
              {router.pathname === '/resolved' ? (
                <p
                  className={`font-bold w-[106px] h-[37px] py-[10px] text-center rounded-[32px] bg-primary_white text-primary_blue`}
                >
                  ARSIP
                </p>
              ) : (
                <p className={`font-bold w-[106px] h-[37px] py-[10px] text-center rounded-[32px]`}>ARSIP</p>
              )}
            </Link>
            <Link href="/trash">
              {router.pathname === '/trash' ? (
                <p
                  className={`font-bold w-[81px] h-[37px] py-[10px] text-center rounded-[32px] bg-primary_white text-primary_blue`}
                >
                  SAMPAH
                </p>
              ) : (
                <p className={`font-bold w-[81px] h-[37px] py-[10px] text-center rounded-[32px]`}>SAMPAH</p>
              )}
            </Link>
          </div>
        </div>
        <div className={`flex items-center gap-[18px]`}>
          <IoSettingsOutline className={`text-[32px]`} />
          <button className={` bg-primary_white w-8 h-8 rounded-full`} onClick={handleHoverUser}>
            <FaUser className={` text-dark_neutral_100`} />
          </button>
          {isShow && (
            <div
              className={`flex flex-col gap-[20px] absolute top-[60px] right-[20px] bg-primary_white w-auto h-auto p-3 z-50 rounded drop-shadow-lg`}
            >
              <div className={`flex gap-[20px] text-dark_neutral_300`}>
                <div>
                  <p className={`font-semibold`}>Username</p>
                  <p className={`font-semibold`}>Email</p>
                </div>
                <div>
                  <p>{userName}</p>
                  <p>{email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`w-full h-[40px] bg-primary_blue border hover:bg-primary_white hover:border-primary_blue text-primary_white hover:text-primary_blue rounded-[32px]`}
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
