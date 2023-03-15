import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import Layout from './../components/Layout';
import { BsFillTrashFill} from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import {IoMdArrowDropdown} from 'react-icons/io';
import {GrClose} from 'react-icons/gr';



export default function Home() {
  return (
    <Layout>
      <section className={`bg-light_neutral_200 flex gap-[230px]   w-full py-[18px] px-[31px] border-[1px] border-mid_neutral_100`}>
          <div className={`w-[80%] flex justify-end`}>
            <form className={` flex items-center justify-between w-[676px] h-[47px] border border-dark_neutral_100  rounded`}>
              <input placeholder='Search department, position' className={` mx-[10px] my-[12.5px] italic bg-light_neutral_200 w-full`}/>
              <button className={`w-[46px] h-[47px] rounded-r rounded-b bg-light_neutral_500 p-[14.12px] text-[18.5px] text-dark_neutral_200 border border-dark_neutral_100`}><AiOutlineSearch/></button>
            </form>
          </div>
        <div className={`flex gap-[18px] `}>
          <Link href='/jobs/add-new-position' className={`flex justify-center w-[181px] h-[47px] bg-primary_blue text-primary_white rounded px-[10px] py-[14px] hover:text-primary_blue hover:bg-primary_white border border-primary_blue items-center `}><p><span className={`mr-[6px] text-[19px]`}>+</span>Add New Position</p></Link>
          <button className={`w-[181px] h-[47px] bg-light_neutral_500 rounded flex  items-center px-[10px] py-[14px] gap-[6px] justify-center`}> <BsFillTrashFill/> Delete Position</button>
        </div>
      </section>
      <section className={`pt-[59px]`}>
        <div className={` relative container mx-auto text-center  text-dark_neutral_300 w-[1147px] h-[169px] bg-semantic_blue_50 py-8 px-[107px] border border-mid_neutral_600 rounded-md`}>
          <button className={`absolute z-10 right-4 mt-[-16px]`}><GrClose className={`text-2xl`} /></button>
          <h1 className={` font-bold text-2xl`}>Welcome to automated CV screening system!</h1>
          <p className={`mt-[22px] `}>All of the features here will help you to screen your CV faster, more accurate, and find the
            perfect candidate. Start add a new position to get started. 
          </p>
        </div>
        <div className={`mt-[59px] `}>
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
                  <select></select>
                </div>
                <div className={`flex items-center gap-[6px]`}> 
                  <p>All positions</p> 
                  <select></select>
                </div>
               <div className={`flex items-center gap-[6px]`}> 
                  <p>No group applied </p>
                  <select></select>
               </div>
          </div>
        </div>
      </section>

    </Layout>
  )
}
