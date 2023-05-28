import Layout from "@/components/Layout";
import SelectItems from "@/components/SelectItems";
import { useState, useEffect, use } from 'react';
import {useRouter} from 'next/router';
import { useSelector } from "react-redux";
import {BiArrowBack} from 'react-icons/bi';
import { useDispatch } from "react-redux";
import { clearUpload }  from "../../redux/store/actions/uploadActions";
import {TfiUpload} from 'react-icons/tfi';
import {BiSort} from 'react-icons/bi';
import {GrClose} from 'react-icons/gr';
import { domicileOptions } from "@/components/SelectOptions";
import Candidate from "@/interfaces/Candidate";
import  {Viewer}  from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { getItem, setItem } from "@/utils/sessionStorage";
import PositionData from "@/interfaces/PositionData";


export default function UploadCV() {
  const acceptedFiles = useSelector((state: any) => state.upload.acceptedFiles);
  const router = useRouter();
  const { id, position, department } = router.query;
  const newPlugin = defaultLayoutPlugin();
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [viewPdf, setViewPdf] = useState("");
  const [candidateData, setCandidateData] = useState<Candidate[]>( new Array(acceptedFiles.length).fill({
    id: Math.floor(Math.random() * 1000),
    name: '',
    cv: acceptedFiles[0].type === 'application/pdf'? URL.createObjectURL(new Blob([acceptedFiles[0]], { type: 'application/pdf' })) :
    URL.createObjectURL(new Blob([acceptedFiles[0]], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })),
    email: '',
    phone: '',
    domicile: '',
    competency: '',
    notes: '',
    score: 0,
    isQualified: false,
    isFavorite: false,
    idPosition: Number(id),
    createdDate: new Date()
    }));
  const [positionDataList, setPositionDataList] = useState<PositionData[]>([]);
  const [listSelectedDomicile, setListSelectedDomicile] = useState<any>([]);
  const dispatch = useDispatch(); 
  useEffect(() => {
    let selectedFile = acceptedFiles[activeFileIndex];
    let blobSelectedFile = new Blob([selectedFile], { type: 'application/pdf' });
    if (blobSelectedFile) {
       let url = URL.createObjectURL(blobSelectedFile);
       console.log('ini string bukan sih',typeof(url))
       setViewPdf(url);
    }
  }, [acceptedFiles, activeFileIndex, candidateData]);
  
  const handleBackButtonClick = () => {
    dispatch({ type: 'CLEAR_UPLOAD'});
    router.push('/talent-pool');
  };

  const handleFileTabClick = (index: number) => {
    setActiveFileIndex(index);
    const newCandidateData = [...candidateData];
    newCandidateData[index] = {
      ...newCandidateData[index],
      id: Math.floor(Math.random() * 1000),
      cv: acceptedFiles[index].type === 'application/pdf'? URL.createObjectURL(new Blob([acceptedFiles[index]], { type: 'application/pdf' })) :
      URL.createObjectURL(new Blob([acceptedFiles[index]], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })),
    };
    setCandidateData(newCandidateData);
    console.log('ini kandidat', candidateData)
  }

  const handleCandidateNameInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCandidateData = [...candidateData];
    newCandidateData[index] = {
      ...newCandidateData[index],
      name: e.target.value
    };
    setCandidateData(newCandidateData);
  };

  const handleCandidateEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCandidateData = [...candidateData];
    newCandidateData[index] = {
      ...newCandidateData[index],
      email: e.target.value
    };
    setCandidateData(newCandidateData);
  };

  const handleCandidateDomicileInputChange = (domicileSelected: any, index: number) => {
    const newCandidateData = [...candidateData];
    newCandidateData[index] = {
      ...newCandidateData[index],
      domicile: domicileSelected.value
    };
    setCandidateData(newCandidateData);
    
    const newSelectedDomicile = [...listSelectedDomicile];
    newSelectedDomicile[index] = domicileSelected;
    setListSelectedDomicile(newSelectedDomicile);
  }

  const handleCandidatePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCandidateData = [...candidateData];
    newCandidateData[index] = {
      ...newCandidateData[index],
      phone: e.target.value
    };
    setCandidateData(newCandidateData);
  };

  const handleCandidatesSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newCandidateList = await getItem('candidateDataList');
    newCandidateList = [...newCandidateList, ...candidateData];
    await setItem('candidateDataList', newCandidateList);
    router.push('/talent-pool');
  }





  return (
    <Layout>
      <section className={`flex justify-center pt-[22px]`}>
        <div className={`w-[1646px] h-[75px] flex rounded-md drop-shadow bg-light_neutral_200 justify-between py-[14px] px-[18px]`}>
            <div className={`flex gap-[18px] items-center`}>
                <button  className={` text-[32px]`} onClick={handleBackButtonClick}><BiArrowBack/></button>
                <p className={`text-lg text-primary_dark font-normal`}><span className={`font-semibold`}>UPLOADING {acceptedFiles.length} CV</span> to &quot;<span className={`text-primary_blue font-semibold`}>{position} - {department}</span>&quot;</p>
            </div>
            <button className={`flex items-center gap-[6px] w-[206px] h-[47px] rounded bg-primary_blue text-primary_white justify-center`} form="candidates-information">
              <TfiUpload />
              <p>Upload and Continue</p>
            </button>
        </div>
      </section>
      <section className={`flex gap-[19px] mt-[17px] justify-center`}>
        <div className={`w-[429px] h-fit bg-light_neutral_200 rounded-t-[6px]`}>
          <div className={`flex items-center h-[72px] justify-between pl-[33px] pr-[23px] border-b-[1px] border-mid_neutral_100`}>
            <div className={`flex items-center gap-[16px]`}>
              <select></select>
              <p>Total CV Uploaded: <span>{acceptedFiles.length}</span></p>
            </div>
            <button>
              <BiSort />
            </button>
          </div>
          <ul className={`max-h-[640px] overflow-y-scroll overflow-x-hidden`}>
            {acceptedFiles.map((file: File, index: number) => (
            <li key={index} className={`h-[64px] py-[16px] pl-[65px] pr-[16px] border-b-[1px] border-mid_neutral_100 ${activeFileIndex === index? 'bg-semantic_blue_50': ''}`} onClick={()=>handleFileTabClick(index)}>
              <p className={`w-[348px] truncate`}>{file.name}</p>
            </li>
          ))}
          </ul>
        </div>
        <div className={`w-[1198px] bg-light_neutral_200 rounded-md `}>
          <div className={`h-[72px] border-b-[1px] border-mid_neutral_600 rounded-md bg-light_neutral_300 py-[21.5px] pl-[24px] text-left`}>
            <h2 className={`font-semibold text-primary_dark text-2xl`}>Candidate Information</h2>
          </div>
          <div className={` py-[32px] px-[40px]`}>
            <form id="candidates-information" className={ `flex flex-col gap-[24px]`} onSubmit={handleCandidatesSubmit}>
              <div className={` h-auto flex justify-between py-[10px] px-[12px] rounded text-semantic_purple_600  bg-semantic_purple_100 border border-semantic_purple_600`}>
                  <p>Make sure to fill all the columns below with the <span className={`font-bold`}>candidate informations</span> from the related CV</p>
                  <div className={`flex gap-3 `}>
                      <p className={`underline`}>don’t show again</p>
                      <button><GrClose /></button>
                  </div>
              </div>
              <div className={` flex gap-[18px]`}>
                <div className={` w-1/2 h-[113px]`}>
                    <label htmlFor={`candidate-name_${activeFileIndex}`} className={`text-xl font-medium text-primary_dark`}> Candidate Name </label>
                    <div className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-full h-[44px] border border-dark_neutral_200`}>
                        <input id={`candidate-name_${activeFileIndex}`} name="candidate-name" value={candidateData[activeFileIndex]?.name || ''} placeholder="Candidate Full Name" className={`bg-transparent w-full outline-none`} onChange={(e) => handleCandidateNameInputChange(e,activeFileIndex)}/>
                    </div>
                    <p className={`text-dark_neutral_300`}>80 characters left. No special characters.</p>
                </div>
                <div className={` w-1/2 h-[113px]`}>
                    <label htmlFor={`email-address_${activeFileIndex}`} className={`text-xl font-medium text-primary_dark`}> Email Address </label>
                    <div className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-full h-[44px] border border-dark_neutral_200`}>
                        <input id={`email-address_${activeFileIndex}`} name="email-address" value={candidateData[activeFileIndex]?.email || ''} placeholder="Candidate Email Address" className={`bg-transparent w-full outline-none`} onChange={(e) => handleCandidateEmailInputChange(e,activeFileIndex)}/>
                    </div>
                    <p className={`text-dark_neutral_300`}>80 characters left. No special characters.</p>
                </div>
              </div>
              <div className={` h-auto flex justify-between py-[10px] px-[12px] rounded text-semantic_purple_600  bg-semantic_purple_100 border border-semantic_purple_600`}>
                  <p>It’s recommended to fill the<span className={`font-bold`}>candidate domicile</span> if location is one of your recruitment factor</p>
                  <div className={`flex gap-3 `}>
                      <p className={`underline`}>don’t show again</p>
                      <button><GrClose /></button>
                  </div>
              </div>
              <div className={` flex gap-[18px]`}>
                <div className={` w-1/2 h-[113px]`}>
                    <label htmlFor={`domicile_${activeFileIndex}`} className={`text-xl font-medium text-primary_dark`}> Domicile </label>
                    <div className={`flex wjustify-between items-center mt-[18px] mb-2 `}>
                        <SelectItems options={domicileOptions} id={`domicile_${activeFileIndex}`} inputName="domicile" value={listSelectedDomicile[activeFileIndex]} placeholder="Select Domicile" width="550px"  handleChange={(selectedOption)=>handleCandidateDomicileInputChange(selectedOption,activeFileIndex)}/>
                    </div>
                    <p className={`text-dark_neutral_300`}>80 characters left. No special characters.</p>
                </div>
                <div className={` w-1/2 h-[113px]`}>
                    <label htmlFor={`phone-number_${activeFileIndex}`} className={`text-xl font-medium text-primary_dark`}> Phone Number </label>
                    <div className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-full h-[44px] border border-dark_neutral_200`}>
                        <input id={`phone-number_${activeFileIndex}`} name="phone-number" value={candidateData[activeFileIndex]?.phone || ''} placeholder="+62xxxxxxxxx" className={`bg-transparent w-full outline-none`} onChange={(e) => handleCandidatePhoneInputChange(e,activeFileIndex)}/>
                    </div>
                </div>
              </div>
          </form>
          </div>
          <div>
            <div className={`bg-light_neutral_300 h-[72px] py-[21.5px] border-b-[1px] border-mid_neutral_600`}>
              <h2 className={`font-semibold text-primary_dark text-2xl pl-[24px]`}>Candidate CV Preview</h2>
            </div>
            <div>
              <Viewer fileUrl={viewPdf} plugins={[newPlugin]}/>
            </div>
          </div>
        </div>
      </section> 
    </Layout>
  );
}
