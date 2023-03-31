import Layout from "@/components/Layout"
import SelectItems from "@/components/SelectItems"
import Link from "next/link"
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect} from "react";
import {BiArrowBack} from 'react-icons/bi';
import {GrClose} from 'react-icons/gr';
import 'react-quill/dist/quill.snow.css';
import { getItem, setItem } from '@/utils/sessionStorage';



const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });


interface FormData {
    department: string;
    position: string;
    education: string;
    location: string;
    description: string;
  }

const departmentOptions = [
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
    { value: 'IT', label: 'IT' },
    { value: 'Marketing', label: 'Marketing' },
]

const educationOptions = [
    { value: 'SMA', label: 'SMA' },
    { value: 'S1', label: 'S1' },
    { value: 'S2', label: 'S2' },
    { value: 'S3', label: 'S3' },
]


export default function AddNewPosition () {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        department: '',
        position: '',
        education: '',
        location: '',
        description: '',
      });

    const [formDataList, setFormDataList] = useState<FormData[]>([]);
   
    const handlePositionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
        ...prevState,
        position: event.target.value,
    }));
    };
    
    const handleLocationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
        ...prevState,
        location: event.target.value,
    }));
    };

    const handleDepartmentInputChange = (selectedOption: any) => {
    setFormData((prevState) => ({
        ...prevState,
        department: selectedOption.value,
    }));
    };

    const handleEducationInputChange = (selectedOption: any) => {
        setFormData((prevState) => ({
            ...prevState,
            education: selectedOption.value,
        }));
        };

    const handleRichTextInputChange = (value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            description: value.replace(/<\/?p>/g, ""),
        }));
        };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const existingFormDataList = JSON.parse(sessionStorage.getItem("formDataList") || "[]");
        const newFormDataList = [...existingFormDataList, formData];
        setFormDataList(newFormDataList);
        setItem("formDataList", JSON.stringify(newFormDataList))
        {/*const existingFormDataList = JSON.parse(getItem("formDataList")) || []
        if (existingFormDataList) {       
            const updatedFormDataList = [...existingFormDataList, formData];
            sessionStorage.setItem("formDataList", JSON.stringify(updatedFormDataList));
        } else {
            const initialFormDataList = [formData];
            sessionStorage.setItem("formDataList", JSON.stringify(initialFormDataList));
        }*/}
        setFormData({
            department: '',
            position: '',
            education: '',
            location: '',
            description: '',
        });
        router.push('/talent-pool');
        };
      

    
    return (
        <Layout>
            <section className={` pt-[19px]`}>
                <div className={`mx-[190px] items-center flex  justify-between w-[1646px] h-[75px] py-[14px] px-4 rounded-md bg-light_neutral_200 drop-shadow z-10`}>
                    <div>
                        <button className={`flex gap-[18px] items-center`}>
                            <Link href="/jobs" className={` text-[32px]`}><BiArrowBack/></Link>
                            <p>CREATE NEW POSITION</p>
                        </button>
                    </div>
                    <div className={`flex gap-[18px] text-dark_neutral_200`}>
                        <button className={`bg-primary_white py-[14px] px-[10px] text-primary_blue border border-primary_blue rounded`}>Save Draft</button>
                        <button className={`bg-light_neutral_500 py-[14px] px-[10px] active:text-primary_white active:bg-primary_blue rounded`} form="job-detail" type="submit" >Save and Continue</button>
                    </div>
                </div>  
            </section>
            <section className={`container mx-auto flex flex-row mt-[17px] gap-[18px]`}>
                <div className={` w-[339px] h-[378px] bg-light_neutral_200 py-6 px-[18px] z-10`}>
                    <div className={`p-[18px] bg-semantic_blue_50 rounded`}>
                        <h2 className={`font-semibold`}>Job Details</h2>
                        <p className={`mt-[13px]`}>
                        Fill this part with positions information including department, 
                        position, education, 
                        and job location
                        </p>
                    </div>
                    <hr className={`  border border-dark_neutral_300 my-[25px]`}/>
                    <div className={`p-[18px]`}>
                        <h2 className={`font-semibold`}>Job Description</h2>
                        <p className={`mt-[13px] w-[261.1px] h-[48px]`}>
                        Fill this part with job requirements that’s 
                        match with your job details
                        </p>
                    </div>
                </div>
                <div className={`w-[1289px] h-[1080px] rounded-md pb-[40px] bg-light_neutral_200 `}>
                    <div className={`bg-light_neutral_300 border border-b-mid_neutral_600 py-[21px] pl-6`}>
                        <h2 className={`text-2xl font-semibold`}>Job Detail</h2>
                    </div>
                    <div className={`px-[40px] pt-8`}>
                    <form className={`flex flex-col gap-6`} id="job-detail" onSubmit={handleFormSubmit}>
                            <div className={` h-auto flex justify-between py-[10px] px-[12px] rounded text-semantic_purple_600  bg-semantic_purple_100 border border-semantic_purple_600`}>
                                <p>Notes: It will be seen as Job Position - Department on talent pool</p>
                                <div className={`flex gap-3 `}>
                                    <p className={`underline`}>don’t show again</p>
                                    <button><GrClose /></button>
                                </div>
                            </div>
                            <div className={`flex gap-[49px]`}>
                                <div className={` w-1/2 h-[113px]`}>
                                    <label htmlFor="department" className={`text-xl font-medium`}><span className={`text-secondary_red`}>*</span>Department</label>
                                    <div className={`flex justify-between items-center mt-[18px] mb-2 `}>
                                        {/*<input list="options" onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption} className={`w-full h-full bg-transparent outline-none`} type="text" name="department" id="department" placeholder="Select Department" />
                                        <datalist id="options">
                                            {options.map((op) => <option key={op.label}>{op.value}</option>)}
                                        </datalist>*/}
                                        <SelectItems options={departmentOptions} inputName="department" placeholder="Select Department, ex : Human Resource"  handleChange={handleDepartmentInputChange}/>
                                       
                                    </div>
                                    <p className={`text-dark_neutral_300`}>80 characters left. No special characters.</p>
                                </div>
                                <div className={` w-1/2 h-[113px]`}>
                                    <label htmlFor="job-position" className={`text-xl font-medium`}> Job Position </label>
                                    <div className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-[580px] h-[44px] border border-dark_neutral_200`}>
                                        <input id="job-position" name="job-position" placeholder="Example : Associate Manager" className={`bg-transparent w-full outline-none`} onChange={handlePositionInputChange}/>
                                    </div>
                                    <p className={`text-dark_neutral_300`}>80 characters left. No special characters.</p>
                                </div>
                            </div>
                            <div className={` h-auto flex justify-between py-[10px] px-[12px] rounded text-semantic_purple_600  bg-semantic_purple_100 border border-semantic_purple_600`}>
                                <p className={`w-[749px]`}>
                                   Education and job location is optional and you can choose to not fill it.
                                   If you fill it, the system will sort out the candidates with the required education and / or job location
                                </p>
                                <div className={`flex gap-3 items-center`}>
                                    <p className={`underline`}>don’t show again</p>
                                    <button><GrClose /></button>
                                </div>
                            </div>
                            <div className={`flex gap-[49px]`}>
                                <div className={` w-1/2 h-[113px]`}>
                                    <label htmlFor="education" className={`text-xl font-medium`}>Education</label>
                                    <div className={`flex justify-between items-center mt-[18px] mb-2 `}>
                                        {/*<input list="options" onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption} className={`w-full h-full bg-transparent outline-none`} type="text" name="department" id="department" placeholder="Select Department" />
                                        <datalist id="options">
                                            {options.map((op) => <option key={op.label}>{op.value}</option>)}
                                        </datalist>*/}
                                        <SelectItems options={educationOptions} inputName="education" placeholder="Select Education"  handleChange={handleEducationInputChange}/>

                                    </div>
                                    <p className={`text-dark_neutral_300`}>Minimum education for the position</p>
                                </div>
                                <div className={` w-1/2 h-[113px]`}>
                                    <label htmlFor="job-position" className={`text-xl font-medium`}> Job Location </label>
                                    <div className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-[580px] h-[44px] border border-dark_neutral_200`}>
                                        <input id="location" name="location" placeholder="Example : Jakarta, Bogor, atau Bandung" className={`bg-transparent w-full outline-none`} onChange={handleLocationInputChange}/>
                                    </div>
                                    <p className={`text-dark_neutral_300`}>Include the location for the job</p>
                                </div>
                            </div>
                        </form>          
                    </div>
                    <div className={`bg-light_neutral_300 border border-b-mid_neutral_600 py-[21px] pl-6 mt-8`}>
                        <h2 className={`text-2xl font-semibold`}>Job Description</h2>
                    </div>
                    <div className={`flex flex-col gap-6 px-10 pt-[32px]`}>
                        <div className={` h-auto flex justify-between py-[10px] px-[12px] rounded text-semantic_purple_600  bg-semantic_purple_100 border border-semantic_purple_600`}>
                            <p>The system will filter your candidate based on the level of suitability of candidates CV with this job requirements.</p>
                            <div className={`flex gap-3 `}>
                                <p className={`underline`}>don’t show again</p>
                                <button><GrClose /></button>
                            </div>
                        </div>
                        <div className={`flex flex-col gap-[18px]`}>
                            <label htmlFor="job-description" className={`text-xl font-medium`} ><span>*</span>Job Requirement</label>
                            <div>
                              {/* Rich Text Editor */}
                              <ReactQuill  onChange={handleRichTextInputChange} className={` h-[225px] w-[1209px] `} />
                            </div>         
                        </div>
                    </div>  
                </div>       
            </section>
        </Layout>
    )
}