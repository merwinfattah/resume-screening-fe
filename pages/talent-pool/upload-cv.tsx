import Layout from '@/components/Layout';
// import SelectItems from "@/components/SelectItems";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { clearUpload } from '../../redux/store/actions/uploadActions';
import { TfiUpload } from 'react-icons/tfi';
import { BiSort } from 'react-icons/bi';
import { GrClose } from 'react-icons/gr';
// import { domicileOptions } from "@/components/SelectOptions";
import Candidate from '@/interfaces/Candidate';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { getItem, setItem } from '@/utils/sessionStorage';
import PositionData from '@/interfaces/PositionData';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

export default function UploadCV() {
    const acceptedFiles = useSelector((state: any) => state.upload.acceptedFiles);
    console.log('ini accepted files', acceptedFiles);
    const router = useRouter();
    const { id, position, department } = router.query;
    const newPlugin = defaultLayoutPlugin();
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [viewPdf, setViewPdf] = useState([{ uri: '', fileType: '' }]);
    const initiateCandidateValue = () => {
        const tempCandidateData: Candidate[] = [];
        for (let i = 0; i < acceptedFiles.length; i++) {
            tempCandidateData.push({
                id: Math.floor(Math.random() * 1000),
                name: acceptedFiles[i].name.split('_')[0],
                cv: acceptedFiles[i],
                email: acceptedFiles[i].name.split('_')[1],
                domicile: acceptedFiles[i].name.split('_')[2].split('.')[0],
                competency: '',
                notes: '',
                score: 0,
                isQualified: false,
                isFavorite: false,
                idPosition: Number(id),
                createdDate: new Date(),
            });
        }
        return tempCandidateData;
    };
    const candidateData = initiateCandidateValue();

    const [positionDataList, setPositionDataList] = useState<PositionData[]>([]);
    useEffect(() => {
        const getPositionDataList = async () => {
            const tempPositionDataList = await getItem('positionDataList');

            setPositionDataList(tempPositionDataList);
        };
        getPositionDataList();
    }, []);

    // const [listSelectedDomicile, setListSelectedDomicile] = useState<any>([]);
    const dispatch = useDispatch();
    useEffect(() => {
        let selectedFile = acceptedFiles[activeFileIndex];
        let blobSelectedFile = new Blob([selectedFile], { type: 'application/pdf' });
        if (blobSelectedFile) {
            let url = URL.createObjectURL(blobSelectedFile);
            console.log('ini string bukan sih', typeof url);
            setViewPdf([{ uri: require(url), fileType: acceptedFiles[activeFileIndex].type }]);
        }
    }, [acceptedFiles, activeFileIndex]);

    const handleBackButtonClick = () => {
        dispatch({ type: 'CLEAR_UPLOAD' });
        router.push('/talent-pool');
    };

    const handleFileTabClick = (index: number) => {
        setActiveFileIndex(index);
    };

    const handleCandidatesSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let newCandidateList = await getItem('candidateDataList');
        let newPositionDataList = [...positionDataList];
        newCandidateList = [...newCandidateList, ...candidateData];
        for (let i = 0; i < newPositionDataList.length; i++) {
            if (positionDataList[i].id === Number(id)) {
                positionDataList[i].uploadedCV = positionDataList[i].uploadedCV + candidateData.length;
                break;
            }
        }
        setPositionDataList(newPositionDataList);
        await setItem('positionDataList', positionDataList);
        await setItem('candidateDataList', newCandidateList);
        router.push('/talent-pool');
    };

    return (
        <Layout>
            <section className={`flex justify-center pt-[22px]`}>
                <div
                    className={`w-[1646px] h-[75px] flex rounded-md drop-shadow bg-light_neutral_200 justify-between py-[14px] px-[18px]`}
                >
                    <div className={`flex gap-[18px] items-center`}>
                        <button className={` text-[32px]`} onClick={handleBackButtonClick}>
                            <BiArrowBack />
                        </button>
                        <p className={`text-lg text-primary_dark font-normal`}>
                            <span className={`font-semibold`}>MENGUNGGAH {acceptedFiles.length} CV</span> to &quot;
                            <span className={`text-primary_blue font-semibold`}>
                                {position} - {department}
                            </span>
                            &quot;
                        </p>
                    </div>
                    <button
                        className={`flex items-center gap-[6px] w-[206px] h-[47px] rounded bg-primary_blue text-primary_white justify-center`}
                        form="candidates-information"
                    >
                        <TfiUpload />
                        <p>Unggah dan Lanjutkan</p>
                    </button>
                </div>
            </section>
            <section className={`flex gap-[19px] mt-[17px] justify-center`}>
                <div className={`w-[429px] h-fit bg-light_neutral_200 rounded-t-[6px]`}>
                    <div
                        className={`flex items-center h-[72px] justify-between pl-[33px] pr-[23px] border-b-[1px] border-mid_neutral_100`}
                    >
                        <div className={`flex items-center gap-[16px]`}>
                            <select></select>
                            <p>
                                Total CV Uploaded: <span>{acceptedFiles.length}</span>
                            </p>
                        </div>
                        <button>
                            <BiSort />
                        </button>
                    </div>
                    <ul className={`max-h-[640px] overflow-y-scroll overflow-x-hidden`}>
                        {acceptedFiles.map((file: File, index: number) => (
                            <li
                                key={index}
                                className={`h-[64px] py-[16px] pl-[65px] pr-[16px] border-b-[1px] border-mid_neutral_100 ${
                                    activeFileIndex === index ? 'bg-semantic_blue_50' : ''
                                }`}
                                onClick={() => handleFileTabClick(index)}
                            >
                                <p className={`w-[348px] truncate`}>{file.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`w-[1198px] bg-light_neutral_200 rounded-md `}>
                    <div
                        className={`h-[72px] border-b-[1px] border-mid_neutral_600 rounded-md bg-light_neutral_300 py-[21.5px] pl-[24px] text-left`}
                    >
                        <h2 className={`font-semibold text-primary_dark text-2xl`}>Informasi Kandidat</h2>
                    </div>
                    <div className={` py-[32px] px-[40px]`}>
                        <form
                            id="candidates-information"
                            className={`flex flex-col gap-[24px]`}
                            onSubmit={handleCandidatesSubmit}
                        >
                            <div
                                className={` h-auto flex justify-between py-[10px] px-[12px] rounded text-semantic_purple_600  bg-semantic_purple_100 border border-semantic_purple_600`}
                            >
                                <p>
                                    Pastikan untuk mengisi semua kolom di bawah ini dengan informasi kandidat dari CV
                                    terkait{' '}
                                </p>
                                <div className={`flex gap-3 `}>
                                    <p className={`underline`}>jangan tampilkan lagi</p>
                                    <button>
                                        <GrClose />
                                    </button>
                                </div>
                            </div>
                            <div className={` flex gap-[18px]`}>
                                <div className={` w-1/2 h-[113px]`}>
                                    <label
                                        htmlFor={`candidate-name_${activeFileIndex}`}
                                        className={`text-xl font-medium text-primary_dark`}
                                    >
                                        {' '}
                                        Nama Kandidat{' '}
                                    </label>
                                    <div
                                        className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-full h-[44px] border border-dark_neutral_200`}
                                    >
                                        <p>{candidateData[activeFileIndex]?.name}</p>
                                    </div>
                                </div>
                                <div className={` w-1/2 h-[113px]`}>
                                    <label
                                        htmlFor={`email-address_${activeFileIndex}`}
                                        className={`text-xl font-medium text-primary_dark`}
                                    >
                                        {' '}
                                        Email{' '}
                                    </label>
                                    <div
                                        className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-full h-[44px] border border-dark_neutral_200`}
                                    >
                                        <p>{candidateData[activeFileIndex]?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={` h-auto flex justify-between py-[10px] px-[12px] rounded text-semantic_purple_600  bg-semantic_purple_100 border border-semantic_purple_600`}
                            >
                                <p>
                                    Disarankan untuk mengisi domisili kandidat jika lokasi merupakan salah satu faktor
                                    rekrutmen Anda
                                </p>
                                <div className={`flex gap-3 `}>
                                    <p className={`underline`}>jangan tampilkan lagi</p>
                                    <button>
                                        <GrClose />
                                    </button>
                                </div>
                            </div>
                            <div className={` flex gap-[18px]`}>
                                <div className={` w-1/2 h-[113px]`}>
                                    <label
                                        htmlFor={`domicile_${activeFileIndex}`}
                                        className={`text-xl font-medium text-primary_dark`}
                                    >
                                        {' '}
                                        Domisili{' '}
                                    </label>
                                    <div
                                        className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-full h-[44px] border border-dark_neutral_200`}
                                    >
                                        <p>{candidateData[activeFileIndex]?.domicile}</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div>
                        <div
                            className={`bg-light_neutral_300 h-[72px] py-[21.5px] border-b-[1px] border-mid_neutral_600`}
                        >
                            <h2 className={`font-semibold text-primary_dark text-2xl pl-[24px]`}>
                                Pratinjau CV Kandidat
                            </h2>
                        </div>
                        <div>
                            <DocViewer documents={viewPdf} pluginRenderers={DocViewerRenderers} />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
