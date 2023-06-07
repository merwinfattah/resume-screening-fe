import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineSearch } from 'react-icons/ai';
import { GrFormAdd } from 'react-icons/gr';
import { MdOutlineDriveFolderUpload } from 'react-icons/md';
import { TfiUpload } from 'react-icons/tfi';
import { useDropzone } from 'react-dropzone';
import { BiArrowBack } from 'react-icons/bi';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { IoStarOutline, IoStarSharp } from 'react-icons/io5';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { HiOutlineMail } from 'react-icons/hi';
import PositionData from './../interfaces/PositionData';
import Candidate from './../interfaces/Candidate';
import Department from './../interfaces/Department';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Modal } from '@/components/Modal';
import { BiCheckDouble } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import PositionDataService from './api/services/position.service';
import CandidateDataService from './api/services/candidate.service';
import DepartmentDataService from './api/services/department.service';

type SortingOption = {
  label: string;
  value: string;
};

const sortingOptions: SortingOption[] = [
  { label: 'Asc', value: 'asc' },
  { label: 'Desc', value: 'desc' },
];

const sortItems = (applicants: Candidate[], option: SortingOption, direction: 'asc' | 'desc'): Candidate[] => {
  const sortedItems = [...applicants];

  switch (option.value) {
    case 'asc':
      sortedItems.sort((a, b) => (a.name > b.name ? 1 : -1));
      break;
    case 'desc':
      sortedItems.sort((a, b) => (a.name < b.name ? 1 : -1));
      break;
    default:
      break;
  }

  if (direction === 'desc') {
    sortedItems.reverse();
  }

  return sortedItems;
};

export default function TalentPool() {
  const companyId = useSelector((state: any) => state.login.companyId);
  const token = useSelector((state: any) => state.auth.token);
  const [positionDataList, setPositionDataList] = useState<PositionData[]>([]);
  const [candidateDataList, setCandidateDataList] = useState<Candidate[]>([]);
  const [departmenDataList, setDepartmentDataList] = useState<Department[]>([]);
  const [departmentParam, setDepartmentParam] = useState<string>('');
  const [educationParam, setEducationParam] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [candidateChecked, setCandidateChecked] = useState(0);
  const [idCandidateChecked, setIdCandidateChecked] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentDataListResponse = await DepartmentDataService.getAll(companyId, token.token);
        const positionDataListResponse = await PositionDataService.getAll(companyId, token.token);
        const candidateDataListResponse = await CandidateDataService.getAll(companyId, token.token);
        setDepartmentDataList(departmentDataListResponse.data);
        setPositionDataList(positionDataListResponse.data);
        setCandidateDataList(candidateDataListResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [companyId, token]);

  const filteredPositionDataList = positionDataList.filter(
    (positionData) => !positionData.isTrash.isInTrash && !positionData.isResolved
  );

  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [activeCandidateIndex, setActiveCandidateIndex] = useState<string | null>(null);
  const newPlugin = defaultLayoutPlugin();
  useEffect(() => {
    if (filteredPositionDataList.length > 0 && activeIndex === null) {
      const firstItemId = filteredPositionDataList[0]._id;
      setActiveIndex(firstItemId);
      setDepartmentParam(
        departmenDataList.find(
          (departmentData) =>
            departmentData._id ===
            filteredPositionDataList.find((positionData) => positionData._id === firstItemId)?.department
        )?.name || ''
      );
      setEducationParam(
        filteredPositionDataList.find((positionData) => positionData._id === firstItemId)?.education || ''
      );
    }
  }, [filteredPositionDataList, activeIndex, departmenDataList]);

  useEffect(() => {
    if (
      candidateDataList.filter((candidate) => candidate.position === activeIndex).length > 0 &&
      activeCandidateIndex === null
    ) {
      const firstItemId = candidateDataList.find((candidate) => candidate.position === activeIndex)?._id || '';
      setActiveCandidateIndex(firstItemId);
    }
  }, [candidateDataList, activeCandidateIndex, activeIndex]);
  const [sortingOption, setSortingOption] = useState<SortingOption>(sortingOptions[0]);
  const [sortingDirection] = useState<'asc' | 'desc'>('asc');
  const onDrop = async (acceptedFiles: File[]) => {
    const fileList = acceptedFiles.filter((file) => {
      const fileExtension = file.name.split('.').pop();
      return fileExtension === 'pdf' || fileExtension === 'docx';
    });

    if (fileList.length > 0) {
      // Handle valid files
      // let candidateData = await getItem('candidateDataList');
      // let newPositionDataList = await getItem('positionDataList');
      const newCandidateUploadList = new FormData();

      fileList.forEach((file, index) => {
        const name = file.name.split('_')[0];
        const email = file.name.split('_')[1];
        const domicile = file.name.split('_')[2].split('.')[0];
        newCandidateUploadList.append(`candidates[${index}][name]`, name);
        newCandidateUploadList.append(`candidates[${index}][email]`, email);
        newCandidateUploadList.append(`candidates[${index}][domicile]`, domicile);
        newCandidateUploadList.append(`candidates[${index}][positionId]`, activeIndex || '');
        newCandidateUploadList.append('cvFiles', file);
      });

      const entriesIterator = newCandidateUploadList.entries();
      let currentEntry = entriesIterator.next();

      while (!currentEntry.done) {
        const [key, value] = currentEntry.value;
        console.log(key, value);
        currentEntry = entriesIterator.next();
      }

      try {
        const responseCandidate = await CandidateDataService.upload(newCandidateUploadList, token.token);
        console.log(responseCandidate.data);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
      // candidateData = [...candidateData, ...newCandidateUploadList];
      // for (let i = 0; i < newPositionDataList.length; i++) {
      //   if (newPositionDataList[i].id === activeIndex) {
      //     newPositionDataList[i].uploadedCV = newPositionDataList[i].uploadedCV + newCandidateUploadList.length;
      //     break;
      //   }
      // }
      // setItem('positionDataList', newPositionDataList);
      // setItem('candidateDataList', candidateData)
    } else {
      // Handle no valid files
      console.log('No valid files found.');
    }
  };

  const { open, getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const sortedItems = sortItems(
    candidateDataList.filter((candidate) => candidate.position === activeIndex),
    sortingOption,
    sortingDirection
  );

  const handleTabClick = (id: string) => {
    setActiveIndex(id);
    setActiveCandidateIndex(candidateDataList.find((candidateData) => candidateData.position === id)?._id || '');
    setDepartmentParam(
      departmenDataList.find(
        (departmentData) =>
          departmentData._id === filteredPositionDataList.find((positionData) => positionData._id === id)?.department
      )?.name || ''
    );
    setEducationParam(filteredPositionDataList.find((positionData) => positionData._id === id)?.education || '');
  };

  const handleCandidateClick = (id: string) => {
    const candidate = candidateDataList.find((candidateData) => candidateData._id === id);
    if (candidate) {
      setActiveCandidateIndex(id);
      console.log(candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.cvFile ?? '');
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleResolvePosition = async () => {
    const positionData = positionDataList.find((positionData) => positionData._id === activeIndex);
    if (positionData) {
      const newPositionDataList = positionDataList.map((positionData) => {
        if (positionData._id === activeIndex) {
          positionData.isResolved = true;
        }
        return positionData;
      });
      setPositionDataList(newPositionDataList);
      const data = {
        id: activeIndex,
      };
      try {
        const responsePosition = await PositionDataService.resolve(data, token.token);
        console.log(responsePosition);
        setActiveIndex(null);
        setActiveCandidateIndex(null);
        setIsModalOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formattedDate = (date: Date | undefined) => {
    if (date) {
      const createdDate = new Date(date);
      const formattedDate = createdDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      return formattedDate;
    }
  };

  const handleShortlist = async (id: string) => {
    const candidateData = {
      id: id,
    };
    const newPositionData = {
      id: activeIndex,
      uploadedCV: positionDataList.find((position) => position._id === activeIndex)?.uploadedCV,
      filteredCV: positionDataList.find((position) => position._id === activeIndex)?.filteredCV,
      potentialCandidates: positionDataList.find((position) => position._id === activeIndex)?.potentialCandidates,
      qualifiedCandidates: positionDataList.find((position) => position._id === activeIndex)?.qualifiedCandidates,
    };
    const newCandidateDataList = candidateDataList.map((candidateData) => {
      if (candidateData._id === id) {
        return {
          ...candidateData,
          isShortlist: !candidateData.isShortlist,
        };
      }
      return candidateData;
    });
    setCandidateDataList(newCandidateDataList);
    const newPositionDataList = positionDataList.map((positionData) => {
      if (positionData._id === activeIndex) {
        if (newCandidateDataList.find((candidateData) => candidateData._id === id)?.isShortlist) {
          positionData.potentialCandidates = positionData.potentialCandidates + 1;
          newPositionData.potentialCandidates = (newPositionData.potentialCandidates ?? 0) + 1;
        } else {
          positionData.potentialCandidates = positionData.potentialCandidates - 1;
          newPositionData.potentialCandidates = (newPositionData.potentialCandidates ?? 0) - 1;
        }
      }
      return positionData;
    });
    setPositionDataList(newPositionDataList);
    try {
      const responseCandidate = await CandidateDataService.shortlist(candidateData, token.token);
      const responsePosition = await PositionDataService.editNumber(newPositionData, token.token);
      console.log(responseCandidate);
      console.log(responsePosition);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQualified = async (id: string) => {
    const candidateData = {
      id: id,
    };
    const newPositionData = {
      id: activeIndex,
      uploadedCV: positionDataList.find((position) => position._id === activeIndex)?.uploadedCV,
      filteredCV: positionDataList.find((position) => position._id === activeIndex)?.filteredCV,
      potentialCandidates: positionDataList.find((position) => position._id === activeIndex)?.potentialCandidates,
      qualifiedCandidates: positionDataList.find((position) => position._id === activeIndex)?.qualifiedCandidates,
    };
    const newCandidateDataList = candidateDataList.map((candidateData) => {
      if (candidateData._id === id) {
        candidateData.isQualified = !candidateData.isQualified;
      }
      return candidateData;
    });
    setCandidateDataList(newCandidateDataList);
    const newPositionDataList = positionDataList.map((positionData) => {
      if (positionData._id === activeIndex) {
        if (newCandidateDataList.find((candidateData) => candidateData._id === id)?.isQualified) {
          positionData.qualifiedCandidates = positionData.qualifiedCandidates + 1;
          newPositionData.qualifiedCandidates = (newPositionData.qualifiedCandidates ?? 0) + 1;
        } else {
          positionData.qualifiedCandidates = positionData.qualifiedCandidates - 1;
          newPositionData.qualifiedCandidates = (newPositionData.qualifiedCandidates ?? 0) - 1;
        }
      }
      return positionData;
    });
    setPositionDataList(newPositionDataList);
    try {
      const responseCandidate = await CandidateDataService.qualify(candidateData, token.token);
      const responsePosition = await PositionDataService.editNumber(newPositionData, token.token);
      console.log(responseCandidate);
      console.log(responsePosition);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckedCandidate = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      setIdCandidateChecked((prev) => [...prev, id]);
      setCandidateChecked((prev) => prev + 1);
    } else {
      const newIdCandidateChecked = idCandidateChecked.filter((idCandidate: string) => idCandidate !== id);
      setIdCandidateChecked(newIdCandidateChecked);
      setCandidateChecked((prev) => prev - 1);
    }
  };

  return (
    <Layout>
      <article className={`flex h-full`}>
        <section className={`w-[236px] h-screen  bg-light_neutral_200  border-r-2 border-semantic_blue_100`}>
          <aside>
            <div className={`flex items-center py-4 pr-4 pl-[33px] justify-between border-b border-mid_neutral_400`}>
              <div className={`flex items-center gap-[6px]`}>
                <AiOutlineSearch className={`text-dark_neutral_200`} />
                <h2 className={`text-primary_dark`}>Daftar Posisi</h2>
              </div>
              <button className={`w-[19px] h-[19px] text-dark_neutral_200`}>
                <GrFormAdd />
              </button>
            </div>
            <ul>
              {positionDataList
                .filter((position: PositionData) => !position.isTrash.isInTrash && !position.isResolved)
                .map((positionData: PositionData) => (
                  <li
                    key={`position-${positionData._id}`}
                    className={` hover: cursor-pointer flex items-center gap-[6px] py-4 pr-4 pl-[33px] border-b-2 border-semantic_blue_100 ${
                      activeIndex === positionData._id ? 'bg-primary_blue' : ''
                    } `}
                    onClick={() => handleTabClick(positionData._id)}
                  >
                    <p
                      className={`w-[154px] text-left  ${
                        activeIndex === positionData._id ? 'text-primary_white' : 'text-dark_neutral_400'
                      }`}
                    >
                      {positionData.name}
                      <span> - </span>
                      {departmenDataList.find((department) => department._id === positionData.department)?.name}
                    </p>
                  </li>
                ))}
            </ul>
          </aside>
        </section>
        <section
          className={` flex flex-col gap-[18px] w-[1648px] ${
            positionDataList.filter((position: PositionData) => !position.isTrash.isInTrash && !position.isResolved)
              .length > 0
              ? 'h-fit'
              : ''
          } p-[18px]`}
        >
          {positionDataList.filter((position: PositionData) => !position.isTrash.isInTrash && !position.isResolved)
            .length > 0 ? (
            <>
              <div className={`flex gap-[18px] `}>
                <div
                  className={` z-10 drop-shadow-md py-3 px-[19px] w-[611px] h-[78px] bg-light_neutral_200 rounded-md flex gap-[10px] items-center justify-between`}
                >
                  <Link
                    href={`/jobs/edit/edit-position?positionId=${encodeURIComponent(
                      activeIndex || ''
                    )}&selectedDepartment=${encodeURIComponent(departmentParam)}&selectedEducation=${encodeURIComponent(
                      educationParam
                    )}`}
                    className={`flex items-center justify-center text-primary_blue w-[108px] h-[47px] rounded gap-[6px] border border-primary_blue hover:border-2`}
                  >
                    Edit Posisi
                  </Link>
                  <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                  <div
                    className={`w-[197px] h-[54px] flex flex-col bg-semantic_blue_100 justify-center items-center rounded-[68px] text-center font-bold text-dark_neutral_400`}
                  >
                    {positionDataList
                      .filter((position: PositionData) => position._id === activeIndex)
                      .map((position: PositionData) => position.uploadedCV)}
                    <p className={`font-medium`}>Cv yang Terunggah</p>
                  </div>
                  <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                  <div
                    className={` w-[161px] h-[47px] flex justify-center items-center rounded bg-primary_white border border-primary_blue text-primary_blue hover:border-2`}
                  >
                    Nilai Semua CV
                  </div>
                </div>
                <div
                  className={`z-10 drop-shadow-md flex justify-between w-[1019px] h-[78px] rounded-lg bg-light_neutral_200 py-3 px-4 items-center`}
                >
                  <div
                    className={`w-[236px] h-[54px] py-[6px] px-12 rounded-[68px] text-center text-sm font-bold text-dark_neutral_400`}
                  >
                    {positionDataList
                      .filter((position) => position._id === activeIndex)
                      .map((position) => position.potentialCandidates)}
                    <p className={`font-medium`}>Kandidat Terpilih</p>
                  </div>
                  <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                  <div
                    className={`w-[236px] h-[54px] py-[6px] px-12 rounded-[68px] text-center text-sm font-bold text-dark_neutral_400`}
                  >
                    {positionDataList
                      .filter((position) => position._id === activeIndex)
                      .map((position) => position.qualifiedCandidates)}
                    <p className={`font-medium`}>Kandidat Terkualifikasi</p>
                  </div>
                  <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                  <button
                    className={`flex justify-center  w-[207px] h-[47px] bg-primary_blue text-primary_white rounded  hover:text-primary_blue hover:bg-primary_white border border-primary_blue items-center `}
                  >
                    <p>
                      <span className={`mr-[6px] text-[19px]`}>+</span>
                      Tambah Kandidat Baru
                    </p>
                  </button>
                  <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                  <button
                    onClick={showModal}
                    className={`flex justify-center items-center w-[146px] h-[47px]  rounded border hover:border-semantic_green_600 bg-semantic_green_600 hover:bg-primary_white text-center text-primary_white hover:text-semantic_green_600`}
                  >
                    Tutup Posisi
                  </button>
                </div>
              </div>
              {candidateDataList.filter((candidate) => candidate.position === activeIndex).length > 0 ? (
                <div className={`flex gap-[18px] `}>
                  <div className={`flex flex-col w-[381px] h-[831px] bg-light_neutral_200 rounded-md bg-scroll`}>
                    <div
                      className={`container mx-auto mt-[18px] flex w-[345px] h-[35px] rounded gap-[10px] py-2 px-[10px] border border-dark_neutral_100 text-dark_neutral_100`}
                    >
                      <AiOutlineSearch />
                      <input
                        placeholder="Saring berdasarkan nama"
                        className={` w-full italic outline-none bg-transparent`}
                      />
                    </div>
                    <div className={`mt-[25px] mx-[18px] flex justify-between`}>
                      <div className={`flex items-center`}>
                        <label htmlFor="sorting" className={`text-base font-bold`}>
                          Urutkan :
                        </label>
                        <select
                          id="sorting"
                          className={`bg-transparent outline-none`}
                          value={sortingOption.value}
                          onChange={(e) =>
                            setSortingOption(sortingOptions.find((option) => option.value === e.target.value)!)
                          }
                        >
                          {sortingOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={`w-full `}>
                      {sortedItems.map((item: Candidate, index: number) =>
                        item.score > 0 ? (
                          <div
                            key={item._id}
                            className={`${
                              activeCandidateIndex === item._id ? 'bg-semantic_blue_100' : ''
                            } group px-[18px]   hover:border-b-2 h-[48px] border-b border-mid_neutral_100 flex items-center justify-between gap-[18px]`}
                            onClick={() => handleCandidateClick(item._id)}
                          >
                            <div
                              className={`flex items-center gap-2 invisible group-hover:visible group-active:visible`}
                            >
                              <RxDragHandleDots2 />
                              <input type="checkbox" onChange={(e) => handleCheckedCandidate(e, item._id)} />
                              <p className={`visible text-dark_neutral_300 text-lg font-semibold`}>{item.name}</p>
                            </div>
                            <div className={`flex items-center gap-2`}>
                              <div
                                className={`w-[47px] h-[25px] rounded-3xl  text-center font-semibold bg-semantic_yellow_300 text-secondary_red border border-secondary_red`}
                              >
                                New
                              </div>
                              <button onClick={() => handleShortlist(item._id)}>
                                {item.isShortlist ? (
                                  <IoStarSharp
                                    className={`text-semantic_yellow_600 outline-semantic_orange_600
                                text-2xl `}
                                  />
                                ) : (
                                  <IoStarOutline className={`text-mid_neutral_600 text-2xl`} />
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={item._id}
                            className={`${
                              activeCandidateIndex === item._id ? 'bg-semantic_blue_100' : ''
                            } group py-[18px] pl-[27px] pr-[10.78px] flex justify-between  items-start hover:border-b-2 border-b border-mid_neutral_100 `}
                            onClick={() => handleCandidateClick(item._id)}
                          >
                            <div className={`flex items-start`}>
                              <RxDragHandleDots2 className={`invisible group-hover:visible mt-[4px]`} />
                              <p>{index + 1}</p>
                              <input
                                type="checkbox"
                                className={` group-hover:visible ${
                                  idCandidateChecked.includes(item._id) ? 'visible' : 'invisible'
                                } ml-[19px] mr-[11.69px] w-[13px] h-[13px] mt-[6px]`}
                                onChange={(e) => handleCheckedCandidate(e, item._id)}
                              />
                              <div className={`flex flex-col gap-[7px] ml-[11.69px]`}>
                                <p className={`text-dark_neutral_300 text-lg font-semibold`}>{item.name}</p>
                                <div className={`flex flex-col gap-[4px]`}>
                                  <p className={`text-semantic_blue_500 font-semibold text-base`}>
                                    Skor: {item.score} /100
                                  </p>
                                  <p className={`text-dark_neutral_300 font-normal text-base`}>{item.domicile}</p>
                                </div>
                              </div>
                            </div>

                            <div className={`flex flex-col items-center gap-2`}>
                              <button onClick={() => handleShortlist(item._id)}>
                                {item.isShortlist ? (
                                  <IoStarSharp
                                    className={`text-semantic_yellow_600 outline-semantic_orange_600
                                text-2xl `}
                                  />
                                ) : (
                                  <IoStarOutline className={`text-mid_neutral_600 text-2xl`} />
                                )}
                              </button>
                              {item.isQualified ? (
                                <BiCheckDouble className={`text-semantic_green_600`} />
                              ) : (
                                <BiCheckDouble />
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div
                    className={` w-[1249px]  bg-light_neutral_200 border border-mid_neutral_200 rounded-t-md overflow-hidden`}
                  >
                    <div className={`bg-light_neutral_300 h-[206px] `}>
                      <div
                        className={`h-[76px] flex items-center justify-between bg-light_neutral_200 border-b border-mid_neutral_200 pl-[32px] pr-[14px]`}
                      >
                        <h2 className={` text-[28px] text-primary_blue font-semibold`}>
                          {candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.name}
                        </h2>
                        <div className={`flex gap-[16px]`}>
                          <button
                            onClick={() => handleShortlist(activeCandidateIndex || '')}
                            className={`w-[198px] h-[44px] items-center border border-mid_neutral_100 rounded justify-center flex gap-[6px] ${
                              candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.isShortlist
                                ? 'bg-primary_blue text-primary_white'
                                : 'bg-primary_white text-primary_blue'
                            } `}
                          >
                            <IoStarOutline />
                            <p>Pilih Kandidat</p>
                          </button>

                          <button
                            onClick={() => handleQualified(activeCandidateIndex || '')}
                            className={`flex  h-[44px] px-[10px] items-center border border-mid_neutral_100 rounded justify-center  gap-[6px]  ${
                              candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.isQualified
                                ? 'bg-primary_blue text-primary_white'
                                : 'bg-primary_white text-primary_blue'
                            }  `}
                          >
                            <div className={` rounded-full border border-primary_blue`}>
                              <MdPersonAddAlt1 />
                            </div>
                            <p>
                              Tambahkan sebagai <span className={`font-bold`}>Kandidat Terkualifikasi</span>
                            </p>
                          </button>
                          <div
                            className={`w-[135px] h-[44px] items-center border border-mid_neutral_100 rounded justify-center flex gap-[6px] bg-primary_white text-primary_blue`}
                          >
                            <HiOutlineMail />
                            <p>Kirim Email</p>
                          </div>
                        </div>
                      </div>
                      <div className={`flex justify-between py-[18px] px-[32px]`}>
                        <div className={`flex gap-[24px]`}>
                          <div>
                            <p className={`text-[18px] text-dark_neutral_400 font-semibold`}>Email</p>
                            <p className={`text-[18px] text-dark_neutral_400 font-semibold`}>Domisili</p>
                          </div>
                          <div>
                            <p className={`text-dark_neutral_400 text-lg font-normal`}>
                              {candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.email}
                            </p>
                            <p className={`text-dark_neutral_400 text-lg font-normal`}>
                              {candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.domicile}
                            </p>
                          </div>
                        </div>
                        {candidateDataList.find(
                          (candidate) => candidate._id === activeCandidateIndex && candidate.score > 0
                        ) !== undefined ? (
                          <div
                            className={`w-[142px] h-[82px] text-[16px] flex flex-col justify-center items-center  text-primary_blue font-medium rounded bg-semantic_blue_50 border-2 border-secondary_blue`}
                          >
                            Peringkat: 1/10
                            <p className={`font-bold text-semantic_blue_600 text-[32px]`}>
                              {candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.score}
                            </p>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className={`flex justify-between pl-[18px] pr-[32px] pt-6`}>
                        <p className={`text-center font-bold border-b-[7px] border-primary_blue w-[56px] `}>CV</p>
                        <p className={`text-lg`}>
                          <span className={`font-semibold`}>Diunggah pada</span>{' '}
                          {formattedDate(
                            candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.createdDate
                          )}
                        </p>
                      </div>
                      <hr className={`mx-[18px] bg-mid_neutral_100 mb-[22px]`} />
                      <div>
                        <Viewer
                          fileUrl={
                            candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.cvFile ?? ''
                          }
                          plugins={[newPlugin]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={` bg-light_neutral_200 h-[813px] w-full rounded-md pt-[184px] px-[638px]`}>
                  <p className={`text-center font-bold mb-[30px] pl-[32px]`}>
                    Start upload your CV to start automate your screening process!
                  </p>
                  <div
                    {...getRootProps({
                      className:
                        'dropzone flex flex-col gap-[18px] py-[60.5px] px-[58.5px] w-[372px] h-[288px] text-center rounded-md border-[3px] border-dashed border-semantic_blue_600 bg-semantic_blue_50',
                    })}
                  >
                    <input {...getInputProps()} />
                    <div className={`flex flex-col gap-[18px]`}>
                      <MdOutlineDriveFolderUpload className={`container mx-auto text-3xl `} />
                      <p>
                        Drag and drop <span className={`font-bold`}>.pdf</span> files to upload
                      </p>
                    </div>
                    <p className={`font-bold`}>or</p>
                    <button
                      type="button"
                      onClick={open}
                      className={`container mx-auto flex gap-[6px] items-center w-[139px] h-[47px] py-[14px] px-[10px] rounded bg-primary_blue text-primary_white`}
                    >
                      <TfiUpload />
                      Upload Files
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              className={`w-full h-full gap-[36px] bg-light_neutral_200 rounded-[6px] drop-shadow-md flex flex-col items-center justify-center`}
            >
              <p className={`text-center w-[865px] font-bold text-dark_neutral_300`}>
                Untuk memulai, buatlah posisi baru dan isi posisi tersebut dengan semua requirement. Setelah itu, unggah
                CV Anda dan otomatiskan proses penyaringan Anda.
              </p>
              <div className={`flex items-center justify-center w-[372px] bg-semantic_blue_50 rounded-[6px] h-[138px]`}>
                <Link
                  href="/jobs/add-new-position"
                  className={`flex items-center justify-center bg-primary_blue w-[195px] h-[47px]  rounded text-primary_white border hover:border-primary_blue hover:bg-primary_white hover:text-primary_blue hover:transition`}
                >
                  + Tambah Posisi Baru
                </Link>
              </div>
            </div>
          )}
        </section>
      </article>
      {isModalOpen && (
        <Modal
          type="resolve-position"
          isOpen={isModalOpen}
          onOk={handleResolvePosition}
          onClose={closeModal}
          headline="Tutup Posisi"
          content="Posisi yang ditutup dapat dibuka kembali di halaman Arsip"
        />
      )}
    </Layout>
  );
}
