import Layout from "@/components/Layout";
import Link from "next/link";
import { useState, useEffect} from "react";
import {IoMdArrowDropdown} from 'react-icons/io';
import {IoAddCircleOutline} from 'react-icons/io5';
import {GrAdd} from 'react-icons/gr';
import { Disclosure, Transition } from '@headlessui/react';
import EditorInput from "@/components/EditorInput";
import { BsFillTrashFill} from 'react-icons/bs';

export default function Jobs () {
    const [departmentList, setDepartmentList] = useState<any[]>([]);

    useEffect(() => {
        const departmentListInStorage = sessionStorage.getItem("department list");
        if (departmentListInStorage) {
          const parsedList = JSON.parse(departmentListInStorage);
          setDepartmentList(parsedList);
        }
      }, []);

    const addItemToList = () => {
        const newItem = {
            name: "",
            positions: [],
        };
        setDepartmentList(prevList => [...prevList, newItem]);
        
        // Check if department list exists in sessionStorage
        const departmentListInStorage = sessionStorage.getItem("department list");
        if (departmentListInStorage) {
            const existingList = JSON.parse(departmentListInStorage);
            // Append the new item to the existing list
            const newList = [...existingList, newItem];
            sessionStorage.setItem("department list", JSON.stringify(newList));
        } else {
            // If no department list exists, initialize with the new item
            const newList = [newItem];
            sessionStorage.setItem("department list", JSON.stringify(newList));
        }


      };

    const handleNameChange = (newName: string, index: number) => {
        const newDepartmentList = [...departmentList]; // Create a new copy of departmentList
        newDepartmentList[index] = {...newDepartmentList[index], name: newName}; // Update the name of the department at the specified index
        setDepartmentList(newDepartmentList); // Update the state with the new departmentList

        sessionStorage.setItem("department list", JSON.stringify(newDepartmentList));
    };

    return (
        <Layout>
            <section className={`container mx-auto mt-[40px] w-[1148px] h-[204px]`}>
                <h2 className={`font-bold`}>DEPARTMENT</h2>
                <div className={`flex flex-row  bg-light_neutral_200 rounded-md py-[30px] pl-[38.5px] pr-[35px] mt-6`}>
                    <div className={` w-5/6 text-dark_neutral_300`}>
                        <h3 className={` text-2xl font-semibold`}>Add more department</h3>
                        <p className={`mt-[18px] w-[837px]`}>
                            Here is the list of all your created department. You can add more department 
                           as much as you like and add more positions to automate your CV screening process.
                        </p>
                    </div>
                    <button className={`w-[162px] h-[42px] rounded p-[10px] border border-dark_neutral_400 text-dark_neutral_400`} onClick={addItemToList}>Add department</button>
                </div>
                <div>
                   
                </div>
            </section>
            <section className={`container mx-auto mt-[40px] w-[1148px] `}>
                <h2 className={`font-bold`} >DEPARTMENT LIST</h2>
                <div className={` mt-6 flex flex-col gap-[18px]`}>
                    {departmentList.map((department, index) => (
                         <Disclosure key={index}>
                         {({open}) => (
                             <>
                                <div>
                                    <div  className={`flex justify-between px-8 pb-[21px] pt-[22px] w-[1148px] h-[72px] z-10 mb-1 rounded-md ${open? ' rounded-b-none  drop-shadow-lg': ''} bg-light_neutral_200`}>
                                        <EditorInput initialValue={department.name} onValueChange={(newName) => handleNameChange(newName, index)} />
                                        <div className={'flex gap-[18px] items-center'}>
                                            {department.positions.length > 0? 
                                            (
                                            <>
                                                <Link href="/jobs/add-new-position"className={`text-[31px] font-thin`}><IoAddCircleOutline /></Link>
                                                <div className={`w-[181px] h-[31px] rounded-[68px] py-[6px] px-[48px] bg-semantic_blue_100`}>{department.positions.length} positions</div>
                                            </>
                                            )
                                            :(<Link href="/jobs/add-new-position" className={`flex w-[198.4px] h-[31px] py-[6px] justify-center rounded-[68px] font-bold items-center gap-[10px] border border-dark_neutral_400 text-dark_neutral_400`}><GrAdd /> Add Position</Link>)}
                                            <Disclosure.Button className={` text-[30px] `} ><IoMdArrowDropdown className={`${open? 'rotate-180 transform': ''}`}/></Disclosure.Button>
                                        </div>
                                    </div>
                                    <Transition
                                        enter="transition ease-out duration-100 transform"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="transition ease-in duration-75 transform"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95">
                                        <Disclosure.Panel className={`w-[1148px] flex flex-col gap-[18px] justify-center pt-[32px] pb-[29px] z-0 bg-light_neutral_200 rounded-b-lg rounded-l-md ${open? 'rounded-t-none': ''}`} >
                                                {department.positions.map((position: any, index: number) => (
                                                    <div key={index} className={`flex justify-center gap-4`}>
                                                        <button className={` text-2xl text-semantic_red_500`}><BsFillTrashFill /></button>
                                                        <div className={`flex items-center justify-between py-3 px-3 rounded-md text-dark_neutral_300 bg-light_neutral_400 w-[1037px] h-[53px]`}>
                                                            <div className={`font-semibold`}>{position}</div>
                                                            <div className={`flex items-center gap-[18px]`}>
                                                                <p><span className={`font-semibold`}>0</span> qualified candidates</p>
                                                                <div  className={` text-mid_neutral_400  font-semibold`}>|</div>
                                                                <p><span className={`font-semibold`}>0</span> potential candidates</p>
                                                                <button className={`w-[87px] h-[29px] rounded-[68px]  text-center border border-primary_blue text-primary_blue`}>Edit Job</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </Disclosure.Panel>
                                    </Transition>
                                 </div>
                             </>
                         )}
                     </Disclosure>
                    ))}
                </div>

            </section>
        </Layout>
    )
}