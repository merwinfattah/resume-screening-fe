// import Layout from "@/components/Layout";
// import { AiOutlineSearch } from "react-icons/ai";
// import { GrFormAdd } from "react-icons/gr";
// import { FiEdit2 } from "react-icons/fi";
// import { RxDragHandleDots2 } from 'react-icons/rx';
// import Link from "next/link";
// import { getItem } from "@/utils/sessionStorage";
// import { useState } from "react";
// import { IoStarOutline } from "react-icons/io5";
// import { MdPersonAddAlt1 } from "react-icons/md";
// import { HiOutlineMail } from "react-icons/hi";

// type ApplicantData = {
//     id: number;
//     name: string;
//     age: number;
//     location: string;
//     email: string;
//     scored: boolean;
//     shortlisted: boolean;
//     isNew: boolean;
//     checked: boolean;
//   }

// const applicants: ApplicantData[] = [
// { id: 1, name: "Alice", age: 25, location: "San Francisco", email: "alice@gamil.com", scored: true, shortlisted: true, isNew: true, checked: false },
// { id: 2, name: "Bob", age: 30, location: "San Francisco", email: "bob@gmail.com", scored: true, shortlisted: false, isNew: true, checked: false },
// { id: 3, name: "Eve", age: 20, location: "San Francisco", email: "eve@gmail.com", scored: false, shortlisted: true, isNew: true, checked: false }, ]

// type SortingOption = {
//     label: string;
//     value: string;
//   };

// const sortingOptions: SortingOption[] = [
//     { label: 'Asc', value: 'asc' },
//     { label: 'Desc', value: 'desc' },
// ];

// const sortItems = (applicants: ApplicantData[], option: SortingOption, direction: 'asc' | 'desc'): ApplicantData[] => {
//     const sortedItems = [...applicants];

//     switch (option.value) {
//         case 'asc':
//         sortedItems.sort((a, b) => (a.name> b.name? 1 : -1));
//         break;
//         case 'desc':
//         sortedItems.sort((a, b) => (a.name < b.name ? 1 : -1));
//         break;
//         default:
//         break;
//     }

//     if (direction === 'desc') {
//         sortedItems.reverse();
//     }

//     return sortedItems;
// };

// export default function Resolved() {
// const positionDataList = [...getItem('positionDataList')];
// const [activeIndex, setActiveIndex] = useState(0);
// const [sortingOption, setSortingOption] = useState<SortingOption>(sortingOptions[0]);
// const [sortingDirection] = useState<'asc' | 'desc'>('asc');
// const sortedItems = sortItems(applicants, sortingOption, sortingDirection);
// const handleTabClick = (index: number) => {
//     setActiveIndex(index);
//   }

//   return (
//     <Layout>
//         <article className={`flex h-full`}>
//                         <section className={`w-[236px] bg-light_neutral_200  border-r-2 border-semantic_blue_100`}>
//                             <aside>
//                                 <div className={`flex items-center py-4 pr-4 pl-[33px] justify-between border-b border-mid_neutral_400`}>
//                                     <div className={`flex items-center gap-[6px]`}>
//                                         <AiOutlineSearch className={`text-dark_neutral_200`} />
//                                         <h2 className={`text-primary_dark`}>Job List</h2>
//                                     </div>
//                                     <button className={`w-[19px] h-[19px] text-dark_neutral_200`}><GrFormAdd /></button>
//                                 </div>
//                                 <ul>
//                                     {Array.isArray(positionDataList) && positionDataList.map((formData: any, index: number) => (
//                                         <li key={`position-${index}`} className={` hover: cursor-pointer flex items-center gap-[6px] py-4 pr-4 pl-[33px] border-b-2 border-semantic_blue_100 ${activeIndex === index? 'bg-primary_blue': ''} `} onClick={()=> handleTabClick(index)}>
//                                             <p className={`w-[154px] text-center  ${activeIndex === index? 'text-primary_white': 'text-dark_neutral_400'}`}>{formData.position}<span> - </span>{formData.department}</p>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </aside>
//                         </section>
//                         <section className={` flex flex-col gap-[18px] w-[1648px] p-[18px]`}>
//                             <div className={`flex gap-[18px] `}>
//                                 <div className={` z-10 drop-shadow-md py-3 px-[19px] w-[611px] h-[78px] bg-light_neutral_200 rounded-md flex gap-[10px] items-center justify-between`}>
//                                     <button className={`flex items-center text-primary_blue w-[108px] h-[47px] rounded gap-[6px] border border-primary_blue px-[10px] py-[14px]`}>
//                                         <FiEdit2 className={`text-dark_neutral_400`}/>
//                                         Edit Job
//                                     </button>
//                                     <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
//                                     <div className={`w-[196px] h-[54px] py-[6px] px-12 rounded-[68px] text-center font-medium text-dark_neutral_400`}>
//                                         0 {/*diganti variabel*/}
//                                         <p>Upload Files</p>
//                                     </div>
//                                     <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
//                                     <div className={` w-[161px] h-[47px] py-[14px] px-[10px] rounded bg-light_neutral_500 text-dark_neutral_200 font-semibold text-center`}>
//                                         Score CV
//                                     </div>
//                                 </div>
//                                 <div className={`z-10 drop-shadow-md flex justify-between w-[1019px] h-[78px] rounded-lg bg-light_neutral_200 py-3 px-4 items-center`}>
//                                     <div className={`w-[236px] h-[54px] py-[6px] px-12 rounded-[68px] text-center text-sm font-bold text-dark_neutral_400`}>
//                                         0 {/*diganti variabel*/}
//                                         <p className={`font-medium`}>Potential Candidates</p>
//                                     </div>
//                                     <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
//                                     <div className={`w-[236px] h-[54px] py-[6px] px-12 rounded-[68px] text-center text-sm font-bold text-dark_neutral_400`}>
//                                         0 {/*diganti variabel*/}
//                                         <p className={`font-medium`}>Qualified Candidates</p>
//                                     </div>
//                                     <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
//                                     <button className={`flex justify-center w-[207px] h-[47px] bg-primary_blue text-primary_white rounded px-[10px] py-[14px] hover:text-primary_blue hover:bg-primary_white border border-primary_blue items-center `}>
//                                         <p><span className={`mr-[6px] text-[19px]`}>+</span>Add New Candidates</p>
//                                     </button>
//                                     <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
//                                     <Link href="/resolved" className={`w-[146px] h-[47px] py-[14px] px-[10px] rounded bg-semantic_green_600 text-center text-primary_white`}>
//                                         Resolve Position
//                                     </Link>
//                                 </div>
//                             </div>
//                             <div className={`flex gap-[18px] `}>
//                                 <div className={`flex flex-col w-[381px] h-[831px] bg-light_neutral_200 rounded-md bg-scroll`}>
//                                     <div className={`container mx-auto mt-[18px] flex w-[345px] h-[35px] rounded gap-[10px] py-2 px-[10px] border border-dark_neutral_100 text-dark_neutral_100`}>
//                                         <AiOutlineSearch />
//                                         <input placeholder="Filter by name, and competencies" className={` w-full italic outline-none bg-transparent`}/>
//                                     </div>
//                                     <div className={`mt-[25px] mx-[18px] flex justify-between`}>
//                                         <div className={`flex items-center`}>
//                                             <label htmlFor='sorting' className={`text-base font-bold`}>Sort order:</label>
//                                             <select
//                                                 id="sorting"
//                                                 className={`bg-transparent outline-none`}
//                                                 value={sortingOption.value}
//                                                 onChange={(e) =>
//                                                 setSortingOption(sortingOptions.find((option) => option.value === e.target.value)!)
//                                                 }
//                                             >
//                                                 {sortingOptions.map((option) => (
//                                                 <option key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>
//                                     <div className={`w-full `}>
//                                         {sortedItems.map((item) => (
//                                             <div key={item.id} className={`group px-[18px] active:bg-semantic_blue_100 hover:border-b-2 h-[48px] border-b border-mid_neutral_100 flex items-center justify-between gap-[18px]`}>
//                                                 <div className={`flex items-center gap-2 invisible group-hover:visible group-active:visible`}>
//                                                     <RxDragHandleDots2 />
//                                                     <input type='checkbox' />
//                                                     <p className={`visible text-dark_neutral_300 text-lg font-semibold`}>{item.name}</p>
//                                                 </div>
//                                                 <div className={`flex items-center gap-2`}>
//                                                     {item.isNew && (<div className={`w-[47px] h-[25px] rounded-3xl  text-center font-semibold bg-semantic_yellow_300 text-secondary_red border border-secondary_red`}>New</div>)}
//                                                     <IoStarOutline className={`text-2xl text-mid_neutral_600`}/>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                                 <div className={` w-[1249px] h-[831px] bg-light_neutral_200 border border-mid_neutral_200 rounded-t-md overflow-hidden`}>
//                                     <div className={`bg-light_neutral_300 h-[206px] `}>
//                                         <div className={`h-[76px] flex items-center justify-between bg-light_neutral_200 border-b border-mid_neutral_200 pl-[32px] pr-[14px]`}>
//                                             <h2 className={` text-[28px] text-primary_blue font-semibold`}>Cayadi Narsir</h2>
//                                             <div className={`flex gap-[16px]`}>
//                                                 <div className={`w-[198px] h-[44px] items-center border border-mid_neutral_100 rounded justify-center flex gap-[6px] bg-primary_white text-primary_blue`}>
//                                                     <IoStarOutline />
//                                                     <p>Shortlist Candidate</p>
//                                                 </div>
//                                                 <div className={`w-[270.13px] h-[44px] items-center border border-mid_neutral_100 rounded justify-center flex gap-[6px] bg-primary_white text-primary_blue`}>
//                                                     <div className={` rounded-full border border-primary_blue`}>
//                                                         <MdPersonAddAlt1 />
//                                                     </div>
//                                                     <p>Add to <span className={`font-bold`}>Qualified</span> Candidates</p>
//                                                 </div>
//                                                 <div className={`w-[135px] h-[44px] items-center border border-mid_neutral_100 rounded justify-center flex gap-[6px] bg-primary_white text-primary_blue`}>
//                                                     <HiOutlineMail />
//                                                     <p>Send Email</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div>
//                                         {/*
//                                         <EditorInput initialValue="Cayadi Narsir" onValueChange={(newName) => handleNameChange(newName, 1)} />
//                                         */}
//                                         </div>
//                                     </div>
//                                     <div className={``}>
//                                         <div className={`flex justify-between pl-[18px] pr-[32px] pt-6`}>
//                                             <p className={`text-center font-bold border-b-[7px] border-primary_blue w-[56px] `}>CV</p>
//                                             <p className={`text-lg`}><span className={`font-semibold`}>Uploaded on</span> 23 Januari 2023</p>
//                                         </div>
//                                         <hr className={`mx-[18px] bg-mid_neutral_100`} />
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>
//                     </article>
//     </Layout>
//   );
// }
