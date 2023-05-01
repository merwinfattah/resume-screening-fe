import { useState, useEffect} from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import { BsFillTrashFill } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { GrClose } from "react-icons/gr";

export default function Trash() {
    const [departmentList, setDepartmentList] = useState<any[]>([]);
    

    useEffect(() => {
        const departmentListInStorage = sessionStorage.getItem("department list");
        if (departmentListInStorage) {
          const parsedList = JSON.parse(departmentListInStorage);
          setDepartmentList(parsedList);
        }
      }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        if (event.target.value.trim() === '') {
        setIsSearching(false);
        } else {
        setIsSearching(true);
        }
    };
    return (
        <Layout>
            <section className={`bg-light_neutral_200 flex gap-[230px]   w-full py-[18px] px-[31px] border-[1px] border-mid_neutral_100`}>
                <div className={`w-[80%] flex justify-end`}>
                    <form className={` flex items-center justify-between w-[676px] h-[47px] border border-dark_neutral_100  rounded`}>
                        <input placeholder='Search department, position' className={`  outline-none mx-[10px] my-[12.5px] bg-light_neutral_200 w-full`} value={searchTerm} onChange={handleSearchChange}/>
                        <button className={`w-[46px] h-[47px]  rounded-r rounded-b bg-light_neutral_500 p-[14.12px] text-[18.5px] text-dark_neutral_200 border border-dark_neutral_100`}><AiOutlineSearch/></button>
                    </form>
                </div>
                <div className={`flex gap-[18px] `}>
                    <button className={`w-[161px] h-[47px] bg-semantic_red_500 text-primary_white rounded flex  items-center px-[10px] py-[14px] gap-[6px] justify-center`}> <BsFillTrashFill/> Delete Position</button>
                    <button className={`w-[145px] h-[47px] rounded py-[12px] text-center  text-semantic_green_600 border border-semantic_green_600`}>Restore Position</button>
                </div>
            </section>
            <section className={`pt-8`}>
                <div className={`container mx-auto flex justify-between w-[1856px] h-[44px] rounded bg-semantic_purple_100 border border-semantic_purple_600 text-semantic_purple_600 py-[10px] px-[12px]`}>
                    <p>Notes: Any items you delete will stay in Trash for 30 days before they are deleted permanently  </p>
                    <div className={`flex gap-3 `}>
                        <p className={`underline`}>don’t show again</p>
                        <button><GrClose /></button>
                    </div>
                </div>
                <div className={` mx-[32px] mt-8 flex flex-col gap-6`}>
                    {departmentList.map((department, index) => {
                        return (
                            <div key={index}  >
                                <div className={`flex gap-[18px] items-center`}>
                                    <p className={`min-w-fit text-2xl font-bold text-dark_neutral_500`}>{department.name} Department</p>
                                    <hr className={`w-full h-[2px]  bg-dark_neutral_100`} />
                                </div>
                                <div className={`flex flex-wrap gap-8 mt-6`}>
                                    <div className={`flex flex-col gap-6  w-[440px] h-[308px]  bg-light_neutral_200 rounded p-6 `}>
                                        <div>
                                            <h2 className={`font-semibold text-2xl text-primary_dark`}>Head</h2>
                                            <p className={`font-normal text-dark_neutral_100 mt-3 `}>Added to trash on: <span className={`font-semibold text-dark_neutral_400`}>02 June 2022</span></p>
                                        </div>
                                        <div className={` grid  gap-3`}>
                                            <div className={`w-[392px] h-[35px] flex justify-between bg-light_neutral_300 border border-light_neutral_600 p-2 rounded-sm`}>
                                                <p className={`text-dark_neutral_300`}>Uploaded CV</p>
                                                <p className={`text-primary_dark font-semibold`}>100</p>
                                            </div>
                                            <div className={`w-[392px] h-[35px] flex justify-between bg-light_neutral_300 border border-light_neutral_600 p-2 rounded-sm`}>
                                                <p className={`text-dark_neutral_300`}>Filtered CV</p>
                                                <p className={`text-primary_dark font-semibold`}>100</p>
                                            </div>
                                            <div className={`w-[392px] h-[35px] flex justify-between bg-light_neutral_300 border border-light_neutral_600 p-2 rounded-sm`}>
                                                <p className={`text-dark_neutral_300`}>Potential Candidates</p>
                                                <p className={`text-primary_dark font-semibold`}>100</p>
                                            </div>
                                            <div className={`w-[392px] h-[35px] flex justify-between bg-light_neutral_300 border border-light_neutral_600 p-2 rounded-sm`}>
                                                <p className={`text-dark_neutral_300`}>Qualified Candidates</p>
                                                <p className={`text-primary_dark font-semibold`}>100</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        )
                    })
                    }
                </div>

            </section>

        </Layout>
    )
}

