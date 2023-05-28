import {HiLocationMarker} from 'react-icons/hi';
import {IoSettingsOutline} from 'react-icons/io5';
import Link from 'next/link';
import { useRouter } from 'next/router';


export default function Navbar(): JSX.Element {
    const router = useRouter();
    return (
        <nav className={`bg-primary_blue`}>
            <div className={` max-w-full  px-8 py-[14px] flex justify-between items-center text-primary_white`}>
                <div className={`flex items-center justify-between gap-[359px]`}>
                    <div className={`flex items-center gap-3`}>
                        <div className={` bg-primary_white w-9 h-9 rounded-full`}>
                        {/*Logo*/}
                        </div>
                        <div>
                            <div>
                                COMPANY NAME
                            </div>
                            <div>
                            <HiLocationMarker className={`inline-block mr-[2px]`}/>
                            <small>Based Location (Jakarta / Anywhere)</small> 
                            </div>
                        </div>
                    </div>
                    <div className={`flex gap-16   text-sm`}>
                        <Link href="/" >
                            {router.pathname === '/' ? (<p className={`flex font-bold uppercase w-[100px]  h-[37px] items-center justify-center  rounded-[32px] bg-primary_white text-primary_blue`}>BERANDA</p>): (<p className={`font-bold uppercase w-[75px] h-[37px] py-[10px] text-center rounded-[32px] `}>BERANDA</p>)}
                        </Link>
                        <Link href="/talent-pool" >
                            {router.pathname === '/talent-pool' || router.pathname === '/talent-pool/upload-cv' ? (<p className={`font-bold uppercase w-[129px] h-[37px] py-[10px] text-center rounded-[32px] bg-primary_white text-primary_blue`}>Talent Pool</p>): (<p className={`font-bold uppercase w-[129px] h-[37px] py-[10px] text-center rounded-[32px] `}>Talent Pool</p>)}
                        </Link>
                        <Link href="/jobs" >
                            {router.pathname === '/jobs' || router.pathname === '/jobs/add-new-position' ? (<p className={` font-bold w-[70px] h-[37px] py-[10px] text-center rounded-[32px] bg-primary_white text-primary_blue`}>POSISI</p>): (<p className={`font-bold w-[70px] h-[37px] py-[10px] text-center rounded-[32px]`}>POSISI</p>)}
                        </Link>
                        <Link href="/resolved" >
                            {router.pathname === '/resolved' ? (<p className={`font-bold w-[106px] h-[37px] py-[10px] text-center rounded-[32px] bg-primary_white text-primary_blue`}>ARSIP</p>): (<p className={`font-bold w-[106px] h-[37px] py-[10px] text-center rounded-[32px]`}>ARSIP</p>)}
                        </Link>
                        <Link href="/trash" >
                            {router.pathname === '/trash' ? (<p className={`font-bold w-[81px] h-[37px] py-[10px] text-center rounded-[32px] bg-primary_white text-primary_blue`}>SAMPAH</p>): (<p className={`font-bold w-[81px] h-[37px] py-[10px] text-center rounded-[32px]`}>SAMPAH</p>)}
                        </Link>
                    </div>
                </div>
                <div className={`flex items-center gap-[18px]`}>
                    <IoSettingsOutline className={`text-[32px]`}/>
                    <div className={` bg-primary_white w-8 h-8 rounded-full`}>
                    {/*User*/}
                    </div>
                </div>
            </div>
        </nav>

    );
}
