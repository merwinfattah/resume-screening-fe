import {HiLocationMarker} from 'react-icons/hi';
import {IoSettingsOutline} from 'react-icons/io5';
import Link from 'next/link';

export default function Navbar(): JSX.Element {
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
                    <div className={`flex gap-16  text-sm`}>
                        <Link href="/">
                            <p>HOME</p>
                        </Link>
                        <Link href="/talent-pool">
                            <p>TALENT POOL</p>
                        </Link>
                        <Link href="/jobs">
                            <p>JOBS</p>
                        </Link>
                        <Link href="/resolved">
                            <p>RESOLVED</p>
                        </Link>
                        <Link href="/trash">
                            <p>TRASH</p>
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
