import Layout from '../components/Layout'
import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineSearch } from 'react-icons/ai';
import {GrFormAdd} from 'react-icons/gr';
import {FiEdit2} from 'react-icons/fi';
import {MdOutlineDriveFolderUpload} from 'react-icons/md';
import {TfiUpload} from 'react-icons/tfi';
import { useDropzone } from "react-dropzone";
import { getItem } from '@/utils/sessionStorage';





export default function TalentPool () {
    const { open, acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {image: ['image/jpeg', 'image/png', 'image/pdf']},
        onDrop: (acceptedFiles) => console.log(acceptedFiles),
        noClick: true,
        noKeyboard: true
      });

    const formDataList = JSON.parse(sessionStorage.getItem("formDataList") || "[]");

    return (
        <Layout>
            <article className={`flex h-full`}>
                <section className={`w-[236px] bg-light_neutral_200  border-r-2 border-semantic_blue_100`}>
                    <aside>
                        <div className={`flex items-center py-4 pr-4 pl-[33px] justify-between`}>
                            <div className={`flex items-center gap-[6px]`}>
                                <AiOutlineSearch className={`text-dark_neutral_200`} />
                                <h2 className={`text-primary_dark`}>Job List</h2>
                            </div>
                            <button className={`w-[19px] h-[19px] text-dark_neutral_200`}><GrFormAdd /></button>
                        </div>
                        <ul>
                            {Array.isArray(formDataList) && formDataList.map((formData: any, index: number) => (
                                <li key={index} className={`flex items-center gap-[6px] py-4 pr-4 pl-[33px] border-b-2 border-semantic_blue_100`}>
                                    <p className={`text-dark_neutral_400`}>{formData.position}<span> - </span>{formData.department}</p>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </section>
                <section className={` flex flex-col gap-[18px] w-[1648px] p-[18px]`}>
                    <div className={`flex gap-[18px] `}>
                        <div className={` z-10 drop-shadow-md py-3 px-[19px] w-[611px] h-[78px] bg-light_neutral_200 rounded-md flex gap-[10px] items-center justify-between`}>
                            <button className={`flex items-center text-primary_blue w-[108px] h-[47px] rounded gap-[6px] border border-primary_blue px-[10px] py-[14px]`}>
                                <FiEdit2 className={`text-dark_neutral_400`}/>
                                Edit Job
                            </button>
                            <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                            <div className={`w-[196px] h-[54px] py-[6px] px-12 rounded-[68px] text-center font-medium text-dark_neutral_400`}>
                                0 {/*diganti variabel*/}
                                <p>Upload Files</p>
                            </div>
                            <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                            <div className={` w-[161px] h-[47px] py-[14px] px-[10px] rounded bg-light_neutral_500 text-dark_neutral_200 font-semibold text-center`}>
                                Score CV
                            </div>
                        </div>
                        <div className={`z-10 drop-shadow-md flex justify-between w-[1019px] h-[78px] rounded-lg bg-light_neutral_200 py-3 px-4 items-center`}>
                            <div className={`w-[236px] h-[54px] py-[6px] px-12 rounded-[68px] text-center text-sm font-bold text-dark_neutral_400`}>
                                0 {/*diganti variabel*/}
                                <p className={`font-medium`}>Potential Candidates</p>
                            </div>
                            <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                            <div className={`w-[236px] h-[54px] py-[6px] px-12 rounded-[68px] text-center text-sm font-bold text-dark_neutral_400`}>
                                0 {/*diganti variabel*/}
                                <p className={`font-medium`}>Qualified Candidates</p>
                            </div>
                            <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                            <button className={`flex justify-center w-[207px] h-[47px] bg-primary_blue text-primary_white rounded px-[10px] py-[14px] hover:text-primary_blue hover:bg-primary_white border border-primary_blue items-center `}>
                                <p><span className={`mr-[6px] text-[19px]`}>+</span>Add New Candidates</p>
                            </button>
                            <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                            <Link href="/resolved" className={`w-[146px] h-[47px] py-[14px] px-[10px] rounded bg-semantic_green_600 text-center text-primary_white`}>
                                Resolve Position
                            </Link>
                        </div>
                    </div>
                    <div className={` bg-light_neutral_200 h-[813px] w-full rounded-md pt-[184px] px-[638px]`}>
                        <p className={`text-center font-bold mb-[30px] pl-[32px]`}>
                           Start upload your CV to start automate your
                           screening process!
                        </p>
                        <div {...getRootProps({className: 'dropzone flex flex-col gap-[18px] py-[60.5px] px-[58.5px] w-[372px] h-[288px] text-center rounded-md border-[3px] border-dashed border-semantic_blue_600 bg-semantic_blue_50'})} >
                            <input {...getInputProps()} />
                            <div className={`flex flex-col gap-[18px]`}>
                                <MdOutlineDriveFolderUpload className={`container mx-auto text-3xl `}/>
                                <p>Drag and drop <span className={`font-bold`}>.pdf</span> files to upload</p>
                            </div>
                            <p className={`font-bold`}>or</p>
                            <button type="button" onClick={open} className={`container mx-auto flex gap-[6px] items-center w-[139px] h-[47px] py-[14px] px-[10px] rounded bg-primary_blue text-primary_white`}>
                                <TfiUpload/>
                                Upload Files
                            </button>     
                        </div>
                    </div>
                </section>
            </article>
           
        </Layout>
    )
}