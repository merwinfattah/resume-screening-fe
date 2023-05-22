import Layout from "@/components/Layout"
import SelectItems from "@/components/SelectItems"
import Link from "next/link"
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState} from "react";
import {BiArrowBack} from 'react-icons/bi';
import {GrClose} from 'react-icons/gr';
import {MdArrowDropUp, MdArrowDropDown} from 'react-icons/md';
import { getItem, setItem } from '@/utils/sessionStorage';
import { educationOptions }  from '@/components/SelectOptions';
import PositionData from "@/interfaces/PositionData";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function EditPosition () {
    const router = useRouter();
    const {positionId, selectedDepartment, selectedEducation} = router.query;
    const pssId = parseInt(Array.isArray(positionId) ? '' : positionId ?? '');
    const slcDepartment = Array.isArray(selectedDepartment) ? '' : selectedDepartment ?? '';
    const slcEdu = Array.isArray(selectedEducation) ? '' : selectedEducation ?? ''
    const [positionData, setPositionData] = useState<PositionData>({
        id : 0,
        department: '',
        position: '',
        education: '',
        location: '',
        description: '',
        minimumExperience: '',
        uploadedCV: [],
        filteredCV: [],
        potentialCandidates: [],
        qualifiedCandidates: [],
        lastCandidatesUpdated: new Date(),
        isResolved: false,
        isTrash: {
            isInTrash: false,
            removedDate: undefined,
        },
      });
    
    useEffect(() => {
        const fethInitialData = async () => {
            const existingPositionDataList = await getItem("positionDataList")
            for (let i = 0; i < existingPositionDataList.length; i++) {
                if (existingPositionDataList[i].id === pssId) {
                    setPositionData(existingPositionDataList[i]);
                    break
                }
            }
        }
        fethInitialData();
    }, [pssId]);

    // Retrieve department list data from session storage
    const departmentListInStorage = sessionStorage.getItem("department list");
    const existingList = departmentListInStorage ? JSON.parse(departmentListInStorage) : [];
    // Create a new list of objects with name and label properties
    const departmentOptions = existingList.map((department: any) => {
    return {
        value: department.name,
        label: department.name,
    };
    });

    const handlePositionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPositionData((prevState) => ({
        ...prevState,
        position: event.target.value,
    }));
    };
    
    const handleLocationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPositionData((prevState) => ({
        ...prevState,
        location: event.target.value,
    }));
    };

    const handleDepartmentInputChange = (selectedOption: any) => {
        if (selectedOption) {
        setPositionData((prevState) => ({
            ...prevState,
            department: selectedOption.value,
        }));}
    };

    const handleEducationInputChange = (selectedOption: any) => {
        if (selectedOption) {
            setPositionData((prevState) => ({
                ...prevState,
                education: selectedOption.value,
            }));
        }
    };

    const handleExperienceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPositionData((prevState) => ({
            ...prevState,
            minimumExperience: event.target.value,
        }));
        };

    const handleRichTextInputChange = (value: string) => {
        setPositionData((prevState) => ({
            ...prevState,
            description: value.replace(/<\/?p>/g, ""),
        }));
        };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const existingPositionDataList = await getItem("positionDataList")
        let newPositionDataList = [...existingPositionDataList];
        for (let i=0; i<newPositionDataList.length; i++) {
            if (newPositionDataList[i].id === pssId) {
                newPositionDataList[i] = positionData;
                break
            }

        }
        setItem("positionDataList", newPositionDataList)
        setPositionData({
            id : 0,
            department: '',
            position: '',
            education: '',
            location: '',
            description: '',
            minimumExperience: '',
            uploadedCV: [],
            filteredCV: [],
            potentialCandidates: [],
            qualifiedCandidates: [],
            lastCandidatesUpdated: new Date(),
            isResolved: false,
            isTrash: {
                isInTrash: false,
                removedDate: undefined,
            },
        });
        router.push('/talent-pool');
        };

    const addExperince = () => {
        if (positionData.minimumExperience) {
            setPositionData(prevState => ({
                ...prevState,
                minimumExperience: (parseInt(prevState.minimumExperience) + 1).toString()
              }));
        }
        else {
            setPositionData(prevState => ({
                ...prevState,
                minimumExperience: '0'
              }));
        }
        
    }    

    const minusExperince = () => {
        if (positionData.minimumExperience) {
            setPositionData(prevState => ({
                ...prevState,
                minimumExperience: (parseInt(prevState.minimumExperience) - 1).toString()
              }));
        }
        else {
            setPositionData(prevState => ({
                ...prevState,
                minimumExperience: '0'
              }));
        }
        
    }     
    return (
        <Layout>
            <section className={`flex justify-center pt-[19px]`}>
                <div className={` items-center flex  justify-between w-[1646px] h-[75px] py-[14px] px-4 rounded-md bg-light_neutral_200 drop-shadow z-10`}>
                    <div>
                        <div className={`flex gap-[18px] items-center`}>
                            <Link href="/jobs" className={` text-[32px]`}><BiArrowBack/></Link>
                            <p>CREATE NEW POSITION</p>
                        </div>
                    </div>
                    <div className={`flex gap-[18px] text-dark_neutral_200`}>
                        <button className={`bg-primary_white py-[14px] px-[10px] text-primary_blue border border-primary_blue rounded hover:border-2`}>Save Draft</button>
                        <button className={`rounded bg-primary_blue text-primary_white py-[14px] px-[10px] border  hover:bg-primary_white hover:text-primary_blue hover:border-primary_blue`} form="job-detail" type="submit" >Save and Continue</button>
                    </div>
                </div>  
            </section>
            <section className={`flex flex-row mt-[17px] gap-[18px] justify-center`}>
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
                <div className={`w-[1289px]  rounded-md  bg-light_neutral_200 `}>
                    <div className={`pb-[40px]`}>
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
                                        <label htmlFor="department" className={`text-xl font-medium text-primary_dark`}><span className={`text-secondary_red`}>*</span>Department</label>
                                        <div className={`flex justify-between items-center mt-[18px] mb-2 `}>
                                            <SelectItems options={departmentOptions} id="department" inputName="department" placeholder="Select Department, ex : Human Resource" width="580px" handleChange={handleDepartmentInputChange} value={slcDepartment} />
                                        </div>
                                        <p className={`text-dark_neutral_300`}>80 characters left. No special characters.</p>
                                    </div>
                                    <div className={` w-1/2 h-[113px]`}>
                                        <label htmlFor="job-position" className={`text-xl font-medium text-primary_dark`}> Job Position </label>
                                        <div className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-[580px] h-[44px] border border-dark_neutral_200`}>
                                            <input id="job-position" name="job-position" placeholder="Example : Associate Manager" className={`bg-transparent w-full outline-none `} onChange={handlePositionInputChange} value={positionData.position}/>
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
                                        <label htmlFor="education" className={`text-xl font-medium text-primary_dark`}>Education</label>
                                        <div className={`flex justify-between items-center mt-[18px] mb-2 `}>
                                            <SelectItems options={educationOptions} id="education" inputName="education" placeholder="Select Education" width="580px" handleChange={handleEducationInputChange} value={slcEdu} />
                                        </div>
                                        <p className={`text-dark_neutral_300`}>Minimum education for the position</p>
                                    </div>
                                    <div className={` w-1/2 h-[113px]`}>
                                        <label htmlFor="job-position" className={`text-xl font-medium text-primary_dark`}> Job Location </label>
                                        <div className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-[580px] h-[44px] border border-dark_neutral_200`}>
                                            <input id="location" name="location" placeholder="Example : Jakarta, Bogor, atau Bandung" className={`bg-transparent w-full outline-none`} onChange={handleLocationInputChange} value={positionData.location}/>
                                        </div>
                                        <p className={`text-dark_neutral_300`}>Include the location for the job</p>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="minimum-experience" className={`text-xl font-medium text-primary_dark`}>Minimum Works Experience</label>
                                    <div className={`flex items-center gap-[12px] mt-[18px]`}>
                                        <div className={`flex  w-[90px] h-[52px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}>
                                            <input type="text" value={positionData.minimumExperience} onChange={handleExperienceInputChange} placeholder="Fill.." className={`w-[44px] bg-transparent  outline-none `} />
                                            <div className={``}>
                                                <div onClick={addExperince} className={`   hover: cursor-pointer text-dark_neutral_400 text-lg `}><MdArrowDropUp /></div>
                                                <div onClick={minusExperince} className={` hover: cursor-pointer text-dark_neutral_400 text-lg `}><MdArrowDropDown/></div>
                                            </div>
                                        </div>
                                        <p className={` text-dark_neutral_500`}>Year(s)</p>
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
                                <div className={` h-[400px] w-[1209px] pb-[40px] `}>
                                    <ReactQuill  onChange={handleRichTextInputChange} className={`h-full rounded`} />
                                </div>         
                            </div>
                        </div>  
                    </div>
                </div>                   
            </section>
        </Layout>
    )
}