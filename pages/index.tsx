import { useState, useEffect } from 'react';
import Layout from './../components/Layout';
import { BsFillTrashFill} from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import {GrClose} from 'react-icons/gr';
import {FiEdit2} from 'react-icons/fi';
import {RxDotsVertical} from 'react-icons/rx';
import { getItem } from '@/utils/sessionStorage';
import dynamic from 'next/dynamic';

const Link = dynamic(() => import('next/link'));

export default function Home() {
  const [formDataList, setFormDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getItem('positionDataList');
      setFormDataList(data);
    };
    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value.trim() === '') {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Show loading or searching condition
      setIsSearching(true);
    }}
  
  const filteredData = formDataList && formDataList.filter((positionData: any) => {
    return positionData.position.toLowerCase().includes(searchTerm.toLowerCase()) || positionData.department.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Layout>
      <section className={`bg-light_neutral_200 flex gap-[230px]   w-full py-[18px] px-[31px] border-[1px] border-mid_neutral_100`}>
          <div className={`w-[80%] flex justify-end`}>
            <form className={` flex items-center justify-between w-[676px] h-[47px] border border-dark_neutral_100  rounded`}>
              <input placeholder='Search department, position' className={`  outline-none mx-[10px] my-[12.5px] bg-light_neutral_200 w-full`} value={searchTerm} onChange={handleSearchChange}/>
              <button onKeyDown={handleKeyPress} className={`w-[46px] h-[47px]  rounded-r rounded-b bg-light_neutral_500 p-[14.12px] text-[18.5px] text-dark_neutral_200 border border-dark_neutral_100`}><AiOutlineSearch/></button>
            </form>
          </div>
        <div className={`flex gap-[18px] `}>
          <Link href='/jobs/add-new-position' className={`flex justify-center w-[181px] h-[47px] bg-primary_blue text-primary_white rounded px-[10px] py-[14px] hover:text-primary_blue hover:bg-primary_white border border-primary_blue items-center `}><p><span className={`mr-[6px] text-[19px]`}>+</span>Add New Position</p></Link>
          <button className={`w-[181px] h-[47px] bg-semantic_red_500 text-primary_white rounded flex  items-center px-[10px] py-[14px] gap-[6px] justify-center`}> <BsFillTrashFill/> Delete Position</button>
        </div>
      </section>
      <section className={`pt-[59px]`}>
        <div className={` ${isSearching? 'hidden': 'visible'} relative container mx-auto text-center  text-dark_neutral_300 w-[1147px] h-[169px] bg-semantic_blue_50 py-8 px-[107px] border border-mid_neutral_600 rounded-md`}>
          <button className={`absolute z-10 right-4 mt-[-16px]`}><GrClose className={`text-2xl`} /></button>
          <h1 className={` font-bold text-2xl`}>Welcome to automated CV screening system!</h1>
          <p className={`mt-[22px] `}>All of the features here will help you to screen your CV faster, more accurate, and find the
            perfect candidate. Start add a new position to get started. 
          </p>
        </div>
        <div className={`${isSearching? 'hidden': 'visible'} mt-[59px] `}>
          <div className={`flex items-center justify-center gap-[18px]`}>
            <p className={`text-dark_neutral_500 font-bold text-2xl `}>GET STARTED</p>
            <hr className={`w-[963px] border-dark_neutral_100 border-[1px]`}></hr>
          </div>
          <div className={` container mx-auto bg-primary_white w-[1148px] h-[185px] mt-6 flex flex-row gap-[101px] pt-[26.57px] pl-[38.5px]`}>
              <div className={`w-[824px] text-dark_neutral_300`}>
                <h2 className={`mb-[18px] text-2xl  font-bold`}>Add a new position</h2>
                <p className={`text-lg`}>To get started, create a new position and fill the position with all needed requirement. After that, 
                  upload your CV and automate your screening process.
                </p>
              </div> 
              <div>
                <Link href="/jobs/add-new-position" className={`text-primary_blue  bg-primary_white border-[1px] hover:border-[4px] border-primary_blue py-[14px] px-[10px] rounded`}>
                  Add New Position
                </Link>
              </div>
          </div>     
        </div>
        <div className={`flex items-center justify-center gap-[18px] mt-[42px]`}>
            <p className={`text-dark_neutral_500 font-bold text-2xl `}>POSITIONS</p>
            <hr className={`w-[998px] border-dark_neutral_100 border-[1px]`}></hr>
        </div>
        <div className={`container mx-auto flex justify-between w-[1148px] mt-[18px]`}>
          <div className={`flex`}>{/* variabel */} 1 out of 2 position scored</div>
          <div className={`flex gap-6 text-lg`}> 
                <div className={`flex items-center gap-[6px]`}> 
                  <p>All departments</p> 
                </div>
                <div className={`flex items-center gap-[6px]`}> 
                  <p>All positions</p> 
                </div>
               <div className={`flex items-center gap-[6px]`}> 
                  <p>No group applied </p>
               </div>
          </div>
        </div>
        <div className={`container mx-auto w-[1184px] mt-6`}>
          {isSearching? (
            <div className={`flex flex-col gap-6`}>
              {Array.isArray(filteredData) && filteredData.map((positionData: any, index: number) => (
               <div key={index}>
                <div className={`flex flex-col gap-8 bg-primary_white h-[262.27px] rounded-md py-6 px-8`}>
                  <div className={`flex justify-between`}>
                    <p className={`flex items-center gap-[18px] text-xl text-dark_neutral_100`}><span className={`text-2xl text-primary_dark font-semibold`}>{positionData.position}</span><span>-</span><span>{positionData.department}</span></p>
                    <div className={`flex items-center gap-[18px]`}>
                      <button className={`flex items-center w-[108px] h-[47px] border border-primary_blue text-primary_blue rounded py-[14px] px-[10px] justify-between`}><FiEdit2/>Edit Job</button>
                      <button className={`bg-primary_blue text-primary_white rounded py-[14px] px-[10px] text-center`}>+ Add New Candidates</button>
                      <RxDotsVertical className={`w-[20px] h-6`}/>
                    </div>
                  </div>
                  <div className={`flex gap-[65px] justify-center items-center`}>
                      <div className={`text-center`}>
                        <span className={`font-semibold text-2xl`}>0</span>
                        <p>Uploaded CV</p>
                      </div>
                      <div className={`border border-dark_neutral_100 h-[79.27px]`}/>
                      <button className={`w-[117px] h-[47px] rounded py-[14px] px-[10px] bg-light_neutral_500`}>Score All CV</button>
                      <div className={`border border-dark_neutral_100  h-[79.27px]`}/>
                      <div className={`text-center`}>
                        <span className={`font-semibold text-2xl`}>0</span>
                        <p>Shortlisted Candidates</p>
                      </div>
                      <div className={`border border-dark_neutral_100  h-[79.27px]`}/>
                      <div className={`text-center`}>
                        <span className={`font-semibold text-2xl`}>0</span>
                        <p>Qualified Candidates</p>
                      </div>                   
                    </div>
                    <div className={`flex justify-between` }>
                      <div className={`flex items-center gap-[6px] `}>
                        <GrClose className={` text-xl`} />
                        <p>This Position has not been resolved</p>
                      </div>
                      <p>
                        Last candidates addes: 
                        <span className={`font-semibold`}>-</span>
                      </p>
                      
                    </div>
              </div>
             </div> ))}
            </div>
          ) : (
            <div className={`flex flex-col gap-6`}>
                {Array.isArray(formDataList) && formDataList.map((positionData: any, index: number) => (
                  <div key={index}>
                    <div className={`flex flex-col gap-8 bg-primary_white h-[262.27px] rounded-md py-6 px-8`}>
                      <div className={`flex justify-between`}>
                        <p className={`flex items-center gap-[18px] text-xl text-dark_neutral_100`}><span className={`text-2xl text-primary_dark font-semibold`}>{positionData.position}</span><span>-</span><span>{positionData.department}</span></p>
                        <div className={`flex items-center gap-[18px]`}>
                          <button className={`flex items-center w-[108px] h-[47px] border border-primary_blue text-primary_blue rounded py-[14px] px-[10px] justify-between`}><FiEdit2/>Edit Job</button>
                          <button className={`bg-primary_blue text-primary_white rounded py-[14px] px-[10px] text-center`}>+ Add New Candidates</button>
                          <RxDotsVertical className={`w-[20px] h-6`}/>
                        </div>
                      </div>
                      <div className={`flex gap-[65px] justify-center items-center`}>
                          <div className={`text-center`}>
                            <span className={`font-semibold text-2xl`}>0</span>
                            <p>Uploaded CV</p>
                          </div>
                          <div className={`border border-dark_neutral_100 h-[79.27px]`}/>
                          <button className={`w-[117px] h-[47px] rounded py-[14px] px-[10px] bg-light_neutral_500`}>Score All CV</button>
                          <div className={`border border-dark_neutral_100  h-[79.27px]`}/>
                          <div className={`text-center`}>
                            <span className={`font-semibold text-2xl`}>0</span>
                            <p>Shortlisted Candidates</p>
                          </div>
                          <div className={`border border-dark_neutral_100  h-[79.27px]`}/>
                          <div className={`text-center`}>
                            <span className={`font-semibold text-2xl`}>0</span>
                            <p>Qualified Candidates</p>
                          </div>
                          
                        </div>
                        <div className={`flex justify-between` }>
                          <div className={`flex items-center gap-[6px] `}>
                            <GrClose className={` text-xl`} />
                            <p>This Position has not been resolved</p>
                          </div>
                          <p>
                            Last candidates addes: 
                            <span className={`font-semibold`}>-</span>
                          </p>
                          
                        </div>
                    </div>
                  </div>
                ))}
               </div>
          )}              
          </div>
      </section>

    </Layout>
  )
}
