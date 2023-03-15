import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import {FiEdit2} from 'react-icons/fi';
import {IoMdAddCircleOutline, IoMdArrowDropdown} from 'react-icons/io';

export default function Jobs () {
    const [departmentList, setDepartmentList] = useState<any[]>([]);

    const addItemToList = () => {
        const newItem = {
            name: "Human Resource",
            numberOfPosition: 0,
        };
        setDepartmentList(prevList => [...prevList, newItem]);
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
            </section>
            <section className={`container mx-auto mt-[40px] w-[1148px] `}>
                <h2 className={`font-bold`} >DEPARTMENT LIST</h2>
                <div className={` mt-6 flex flex-col gap-[18px]`}>
                    {departmentList.map((department, index) => (
                        <div key={index} className={`flex justify-between px-8 pb-[21px] pt-[22px] w-[1148px] h-[72px] rounded-md bg-light_neutral_200`}>
                            <div className={`flex gap-[16.77px]`}>
                                <p className={` text-2xl`}>{department.name}</p>
                                <button className={`text-primary_blue`}><FiEdit2/></button>
                            </div>
                            <div className={'flex gap-[18px] items-center'}>
                                <button><IoMdAddCircleOutline /></button>
                                <div className={`w-[181px] h-[31px] rounded-[68px] py-[6px] px-[48px] bg-semantic_blue_100`}>{department.numberOfPosition} positions</div>
                                <button><IoMdArrowDropdown /></button>
                            </div>
                        </div>
                    ))}
                    {/*<div className={`flex justify-between px-8 pb-[21px] w-[1148px] h-[72px] rounded-md bg-light_neutral_200`}>
                            <div>Human Resource</div>
                            <div></div>
                    </div>*/}
                </div>

            </section>
        </Layout>
    )
}