import { useState, useEffect, useCallback, useMemo, use } from 'react';
import Layout from './../components/Layout';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscChromeClose } from 'react-icons/vsc';
import { AiOutlineCheck } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import { RxDotsVertical } from 'react-icons/rx';
import { Popover } from '@headlessui/react';
import dynamic from 'next/dynamic';
import PositionData from '@/interfaces/PositionData';
import PositionDataService from './api/services/position.service';
import DepartmentDataService from './api/services/department.service';
import { useSelector } from 'react-redux';
import Department from '@/interfaces/Department';
import CandidateDataService from './api/services/candidate.service';
const Link = dynamic(() => import('next/link'));

export default function Home() {
  const token = useSelector((state: any) => state.auth.token);
  const [positionDataList, setpositionDataList] = useState<PositionData[]>([]);
  const [departmentDataList, setdepartmentDataList] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [positionChecked, setPositionChecked] = useState<number>(0);
  const [idPositionChecked, setIdPositionChecked] = useState<string[]>([]);
  const [isLoadingPosition, setIsLoadingPosition] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [idSelectedDepartment, setIdSelectedDepartment] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadingId, setUploadingId] = useState<string>('');

  useEffect(() => {
    const fetchDataPosition = async () => {
      setIsLoadingPosition(true);
      try {
        const responsePosition = await PositionDataService.getAll(token.token);
        const responseDepartment = await DepartmentDataService.getAll(token.token);
        setpositionDataList(responsePosition.data);
        setdepartmentDataList(responseDepartment.data);
        setIsLoadingPosition(false);
      } catch (error) {
        console.log(error);
        setIsLoadingPosition(false);
      }
    };
    fetchDataPosition();
  }, [token]);

  const departmentOptions = departmentDataList.map((department: Department) => {
    return {
      value: department.name,
      label: department.name,
    };
  });
  const departmentOptionsJson = JSON.stringify(departmentOptions);

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim() === '') {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  const handleNavigateDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDelete((isDelete) => !isDelete);
  };

  const handleCheckedPosition = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      setIdPositionChecked((idPositionChecked) => [...idPositionChecked, id]);
      setPositionChecked((positionChecked) => positionChecked + 1);
    } else {
      const newIdPositionChecked = idPositionChecked.filter((idPosition: string) => idPosition !== id);
      setIdPositionChecked(newIdPositionChecked);
      setPositionChecked((positionChecked) => positionChecked - 1);
    }
  };

  const handleCheckedDelete = async () => {
    setpositionDataList((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        if (idPositionChecked.includes(newState[i]._id)) {
          newState[i].isTrash.isInTrash = true;
          newState[i].isTrash.removedDate = new Date();
        }
      }

      return newState;
    });
    const data = {
      ids: [...idPositionChecked],
    };
    try {
      const response = await PositionDataService.remove(data, token.token);
      console.log(response);
      setIsDelete(false);
      setPositionChecked(0);
      setIdPositionChecked([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePosition = async (id: string) => {
    setpositionDataList((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        if (newState[i]._id === id) {
          newState[i].isTrash.isInTrash = true;
          newState[i].isTrash.removedDate = new Date();
          break;
        }
      }
      return newState;
    });
    const data = {
      ids: [id],
    };
    try {
      const response = await PositionDataService.remove(data, token.token);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResolvePosition = async (id: string) => {
    setpositionDataList((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        if (newState[i]._id === id) {
          newState[i].isResolved = true;
          break;
        }
      }
      return newState;
    });
    const data = {
      id: id,
    };
    try {
      const response = await PositionDataService.resolve(data, token.token);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = useMemo(() => {
    const departmentSearch = departmentDataList.find((department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase())
    )?._id;
    if (!positionDataList) return [];
    return positionDataList.filter((positionData: any) => {
      return (
        positionData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        positionData.department === departmentSearch
      );
    });
  }, [positionDataList, departmentDataList, searchTerm]);

  const handleSelectDepartment = async (selectedDepartment: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(selectedDepartment.target.value);
    if (selectedDepartment.target.value === 'all') {
      setIdSelectedDepartment('');
    } else {
      const id =
        departmentDataList.find((departmentData: Department) => departmentData.name === selectedDepartment.target.value)
          ?._id ?? '';
      setIdSelectedDepartment(id);
    }
  };

  const handleFileUpload = async (event: any, id: string) => {
    const files = event.target.files;
    setIsUploading(true);
    setUploadingId(id);
    const fileList = Array.from(files).filter((file: any) => {
      const fileExtension = file.name.split('.').pop();
      return fileExtension === 'pdf' || fileExtension === 'docx';
    });

    if (fileList.length > 0) {
      // Handle valid files
      const newCandidateUploadList = new FormData();

      fileList.forEach((file: any, index: number) => {
        const name = file.name.split('_')[0];
        const email = file.name.split('_')[1];
        const domicile = file.name.split('_')[2].split('.')[0];
        newCandidateUploadList.append(`candidates[${index}][name]`, name);
        newCandidateUploadList.append(`candidates[${index}][email]`, email);
        newCandidateUploadList.append(`candidates[${index}][domicile]`, domicile);
        newCandidateUploadList.append(`candidates[${index}][positionId]`, id || '');
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
        const data = {
          id: id,
          qualifiedCV:
            positionDataList.find((positionData: PositionData) => positionData._id === id)?.qualifiedCandidates || 0,
        };
        const uploadCandidate = await CandidateDataService.upload(newCandidateUploadList, token.token);
        const updatedNumber = await PositionDataService.editNumber(data, token.token);
        console.log(uploadCandidate);
        console.log(updatedNumber);
        setIsUploading(false);
        setUploadingId('');
        window.location.reload();
      } catch (error) {
        console.log(error);
        setIsUploading(false);
        setUploadingId('');
      }
    } else {
      // Handle no valid files
      console.log('No valid files found.');
    }
  };

  return (
    <Layout>
      {isDelete ? (
        <>
          <section
            className={`bg-light_neutral_200 flex items-center justify-between pl-[320px] w-full py-[18px] px-[31px] border-[1px] border-mid_neutral_100`}
          >
            <p className={`text-dark_neutral_400 text-[24px]`}>
              <span className={`font-bold`}>{positionChecked}</span> Dipilih
            </p>
            {positionChecked > 0 ? (
              <button
                onClick={handleCheckedDelete}
                className={`w-[181px] h-[47px] bg-semantic_red_500 text-primary_white rounded flex  items-center px-[10px] py-[14px] gap-[6px] justify-center hover:text-semantic_red_500 hover:bg-primary_white border border-semantic_red_500`}
              >
                <BsFillTrashFill /> Delete Position
              </button>
            ) : (
              <button
                onClick={handleNavigateDelete}
                className={`hover:border-2 w-[98px] h-[47px] rounded text-semantic_red_500 border border-semantic_red_500`}
              >
                X Batal
              </button>
            )}
          </section>
          <section>
            <div className={`flex items-center justify-center gap-[18px] mt-[42px]`}>
              <p className={`text-dark_neutral_500 font-bold text-2xl `}>POSISI</p>
              <hr className={`w-[998px] border-dark_neutral_100 border-[1px]`}></hr>
            </div>
            <div className={`container mx-auto flex justify-end w-[1148px] mt-[18px]`}>
              <div className={`flex gap-6 text-lg`}>
                <div className={`flex items-center gap-[6px]`}>
                  <select
                    id="department-filter"
                    className={`bg-transparent outline-none`}
                    value={selectedDepartment}
                    onChange={handleSelectDepartment}
                  >
                    <option value="all">All Departments</option>
                    {departmentDataList.map((departmentData) => (
                      <option key={departmentData._id} value={departmentData.name}>
                        {departmentData.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className={`container mx-auto w-[1184px] mt-6`}>
              <div className={`flex flex-col gap-6`}>
                {isLoadingPosition ? (
                  <div className={`flex justify-center items-center w-full h-[200px]`}>
                    <div className={`w-[50px] h-[50px] border-t-2 border-primary_blue rounded-full animate-spin`} />
                  </div>
                ) : (
                  positionDataList
                    .filter(
                      (position) =>
                        !position.isTrash.isInTrash &&
                        (idSelectedDepartment ? position.department === idSelectedDepartment : true)
                    )
                    .map((positionData: PositionData) => (
                      <div key={positionData._id} className={`flex gap-[32px] items-center `}>
                        <input
                          type="checkbox"
                          className={`hover:cursor-pointer w-[34px] h-[34px] bg-light_neutral_300 border border-mid_neutral_600`}
                          onChange={(e) => handleCheckedPosition(e, positionData._id)}
                        />
                        <div
                          className={`flex flex-col gap-8 bg-primary_white w-[1148px] h-[262.27px] rounded-md py-6 px-8`}
                        >
                          <div className={`flex justify-between`}>
                            <p className={`flex items-center gap-[18px] text-xl text-dark_neutral_100`}>
                              <span className={`text-2xl text-primary_dark font-semibold`}>{positionData.name}</span>
                              <span>-</span>
                              <span>
                                {
                                  departmentDataList.find((department) => department._id === positionData.department)
                                    ?.name
                                }
                              </span>
                            </p>
                            <div className={`flex items-center gap-[18px]`}>
                              <Link
                                href={`/jobs/edit/edit-position?positionId=${encodeURIComponent(
                                  positionData._id
                                )}&selectedDepartment=${encodeURIComponent(
                                  departmentDataList.find((department) => department._id === positionData.department)
                                    ?.name ?? ''
                                )}&selectedEducation=${encodeURIComponent(
                                  positionData.education
                                )}&departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                                className={`flex items-center w-[124px] h-[47px] border hover:border-[2px] border-primary_blue text-primary_blue rounded gap-[6px]  justify-center`}
                              >
                                <FiEdit2 />
                                Edit Posisi
                              </Link>
                              <button
                                className={`${
                                  isUploading && uploadingId === positionData._id
                                    ? 'bg-primary_white text-primary_blue border-primary_blue'
                                    : 'bg-primary_blue text-primary_white'
                                } rounded py-[14px] px-[10px] text-center hover:bg-primary_white hover:border-primary_blue hover:text-primary_blue border`}
                              >
                                {isUploading ? (
                                  <div className={`flex items-center gap-[6px]`}>
                                    <div
                                      className={`w-[20px] h-6 border-t-2 border-primary_blue rounded-full animate-spin`}
                                    />
                                    <p>Uploading</p>
                                  </div>
                                ) : (
                                  <label htmlFor="file-upload" className="cursor-pointer">
                                    <p>
                                      <span className="mr-[6px] text-[19px]">+</span> Tambah Kandidat Baru
                                    </p>
                                    <input
                                      id="file-upload"
                                      type="file"
                                      multiple
                                      className="hidden"
                                      onChange={(e) => handleFileUpload(e, positionData._id)}
                                    />
                                  </label>
                                )}
                              </button>
                              <Popover className={`relative`}>
                                <Popover.Button className={`focus:bg-light_neutral_500 h-[44px] rounded-xl `}>
                                  <RxDotsVertical className={`w-[20px] h-6`} />
                                </Popover.Button>
                                <Popover.Panel className={`absolute z-10`}>
                                  <div
                                    className={`grid grid-rows-2 pl-[16px] bg-light_neutral_200 w-[239px] h-[102px] rounded-md text-dark_neutral_500 border border-dark_neutral_500 drop-shadow`}
                                  >
                                    <button
                                      className={`text-left`}
                                      onClick={() => handleDeletePosition(positionData._id)}
                                    >
                                      Hapus Posisi
                                    </button>
                                    <button
                                      onClick={() => handleResolvePosition(positionData._id)}
                                      className={`text-left`}
                                    >
                                      Selesaikan Posisi
                                    </button>
                                  </div>
                                </Popover.Panel>
                              </Popover>
                            </div>
                          </div>
                          <div className={`flex gap-[65px] justify-center items-center`}>
                            <div className={`text-center`}>
                              <span className={`font-semibold text-2xl`}>{positionData.uploadedCV}</span>
                              <p>CV yang terunggah</p>
                            </div>
                            <div className={`border border-dark_neutral_100 h-[79.27px]`} />
                            <button
                              className={`flex items-center justify-center w-[139px] h-[47px] rounded  bg-light_neutral_500`}
                            >
                              Nilai Semua CV
                            </button>
                            <div className={`border border-dark_neutral_100  h-[79.27px]`} />
                            <div className={`text-center`}>
                              <span className={`font-semibold text-2xl`}>{positionData.filteredCV}</span>
                              <p>Kandidat Terpilih</p>
                            </div>
                            <div className={`border border-dark_neutral_100  h-[79.27px]`} />
                            <div className={`text-center`}>
                              <span className={`font-semibold text-2xl`}>{positionData.qualifiedCandidates}</span>
                              <p>Kandidat Terkualifikasi</p>
                            </div>
                          </div>
                          <div className={`flex justify-between`}>
                            <div className={`flex items-center gap-[6px] `}>
                              {positionData.isResolved ? (
                                <>
                                  <AiOutlineCheck className={` text-xl text-semantic_green_500`} />
                                  <p>Posisi ini sudah selesai</p>
                                </>
                              ) : (
                                <>
                                  <VscChromeClose className={` text-xl text-semantic_red_500`} />
                                  <p>Posisi ini belum selesai</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section
            className={` bg-light_neutral_200 flex gap-[230px]   w-full py-[18px] px-[31px] border-[1px] border-mid_neutral_100`}
          >
            <div className={`w-[80%] flex justify-end`}>
              <form
                onSubmit={handleSearchSubmit}
                className={` flex items-center justify-between w-[676px] h-[47px] border border-dark_neutral_100  rounded`}
              >
                <input
                  placeholder="Cari department, posisi"
                  className={`  outline-none mx-[10px] my-[12.5px] bg-light_neutral_200 w-full`}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button
                  type="submit"
                  className={`w-[46px] h-[47px]  rounded-r rounded-b bg-light_neutral_500 p-[14.12px] text-[18.5px] text-dark_neutral_200 border border-dark_neutral_100`}
                >
                  <AiOutlineSearch />
                </button>
              </form>
            </div>
            <div className={`flex gap-[18px] `}>
              <Link
                href="/jobs/add-new-position"
                className={`flex justify-center w-[181px] h-[47px] bg-primary_blue text-primary_white rounded  hover:text-primary_blue hover:bg-primary_white border border-primary_blue items-center `}
              >
                <p>
                  <span className={`mr-[6px] text-[19px]`}>+</span>Tambah Posisi Baru
                </p>
              </Link>
              <button
                onClick={handleNavigateDelete}
                className={`w-[181px] h-[47px] bg-semantic_red_500 text-primary_white rounded flex  items-center  gap-[6px] justify-center hover:text-semantic_red_500 hover:bg-primary_white border border-semantic_red_500`}
              >
                <BsFillTrashFill />
                Hapus Posisi
              </button>
            </div>
          </section>
          <section className={`pt-[50px]`}>
            <div
              className={` ${
                isSearching ? 'hidden' : 'visible'
              } relative container mx-auto text-center  text-dark_neutral_300 w-[1147px] h-[169px] bg-semantic_blue_50 py-8 px-[107px] border border-mid_neutral_600 rounded-md`}
            >
              <button className={`absolute z-10 right-4 mt-[-16px]`}>
                <VscChromeClose className={`text-2xl`} />
              </button>
              <h1 className={` font-bold text-2xl`}>Selamat datang di sistem Screening CV otomatis!</h1>
              <p className={`mt-[22px] `}>
                Seluruh fitur di dalam sistem ini akan membantu Anda menyaring CV lebih cepat, lebih akurat, dan
                menemukan kandidat yang sempurna. Mulai tambahkan posisi baru untuk memulai.
              </p>
            </div>
            <div className={`${isSearching ? 'hidden' : 'visible'} mt-[59px] `}>
              <div className={`flex items-center justify-center gap-[18px]`}>
                <p className={`text-dark_neutral_500 font-bold text-2xl `}>MULAI DARI SINI</p>
                <hr className={`w-[963px] border-dark_neutral_100 border-[1px]`}></hr>
              </div>
              <div
                className={` container mx-auto bg-primary_white w-[1148px] h-[185px] mt-6 flex flex-row gap-[101px] pt-[26.57px] pl-[38.5px]`}
              >
                <div className={`w-[824px] text-dark_neutral_300`}>
                  <h2 className={`mb-[18px] text-2xl  font-bold`}>Tambah Posisi Baru</h2>
                  <p className={`text-lg`}>
                    Untuk memulai, buatlah posisi baru dan isi posisi tersebut dengan semua requirement. Setelah itu,
                    unggah CV Anda dan otomatiskan proses penyaringan Anda.
                  </p>
                </div>
                <div>
                  <Link
                    href="/jobs/add-new-position"
                    className={`text-primary_blue  bg-primary_white border hover:border-[2px] border-primary_blue py-[14px] px-[10px] rounded`}
                  >
                    Tambah Posisi Baru
                  </Link>
                </div>
              </div>
            </div>
            <div className={`flex items-center justify-center gap-[18px] mt-[42px]`}>
              <p className={`text-dark_neutral_500 font-bold text-2xl `}>POSISI</p>
              <hr className={`w-[998px] border-dark_neutral_100 border-[1px]`}></hr>
            </div>
            <div className={`container mx-auto flex justify-end w-[1148px] mt-[18px]`}>
              <div className={`flex gap-6 text-lg`}>
                <div className={`flex items-center gap-[6px]`}>
                  <select
                    id="department-filter"
                    className={`bg-transparent outline-none`}
                    value={selectedDepartment}
                    onChange={handleSelectDepartment}
                  >
                    <option value="all">All Departments</option>
                    {departmentDataList.map((departmentData) => (
                      <option key={departmentData._id} value={departmentData.name}>
                        {departmentData.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className={`container mx-auto w-[1184px] mt-6`}>
              {isSearching ? (
                <div className={`flex flex-col gap-6`}>
                  {Array.isArray(filteredData) &&
                    filteredData
                      .filter(
                        (positionData) =>
                          !positionData.isTrash.isInTrash &&
                          (idSelectedDepartment ? positionData.department === idSelectedDepartment : true)
                      )
                      .map((positionData: PositionData) => (
                        <div key={positionData._id}>
                          <div className={`flex flex-col gap-8 bg-primary_white h-[262.27px] rounded-md py-6 px-8`}>
                            <div className={`flex justify-between`}>
                              <p className={`flex items-center gap-[18px] text-xl text-dark_neutral_100`}>
                                <span className={`text-2xl text-primary_dark font-semibold`}>{positionData.name}</span>
                                <span>-</span>
                                <span>
                                  {
                                    departmentDataList.find((department) => department._id === positionData.department)
                                      ?.name
                                  }
                                </span>
                              </p>
                              <div className={`flex items-center gap-[18px]`}>
                                <Link
                                  href={`/jobs/edit/edit-position?positionId=${encodeURIComponent(
                                    positionData._id
                                  )}&selectedDepartment=${encodeURIComponent(
                                    departmentDataList.find((department) => department._id === positionData.department)
                                      ?.name ?? ''
                                  )}&selectedEducation=${encodeURIComponent(
                                    positionData.education
                                  )}&departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                                  className={`flex items-center w-[124px] h-[47px] border hover:border-[2px] border-primary_blue text-primary_blue rounded gap-[6px]  justify-center`}
                                >
                                  <FiEdit2 />
                                  Edit Posisi
                                </Link>
                                <button
                                  className={`${
                                    isUploading && uploadingId === positionData._id
                                      ? 'bg-primary_white text-primary_blue border-primary_blue'
                                      : 'bg-primary_blue text-primary_white'
                                  } rounded py-[14px] px-[10px] text-center hover:bg-primary_white hover:border-primary_blue hover:text-primary_blue border`}
                                >
                                  {isUploading ? (
                                    <div className={`flex items-center gap-[6px]`}>
                                      <div
                                        className={`w-[20px] h-6 border-t-2 border-primary_blue rounded-full animate-spin`}
                                      />
                                      <p>Uploading</p>
                                    </div>
                                  ) : (
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                      <p>
                                        <span className="mr-[6px] text-[19px]">+</span> Tambah Kandidat Baru
                                      </p>
                                      <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, positionData._id)}
                                      />
                                    </label>
                                  )}
                                </button>
                                <Popover className={`relative`}>
                                  <Popover.Button className={`focus:bg-light_neutral_500 h-[44px] rounded-xl `}>
                                    <RxDotsVertical className={`w-[20px] h-6  `} />
                                  </Popover.Button>
                                  <Popover.Panel className={`absolute z-10`}>
                                    <div
                                      className={`grid grid-rows-2  pl-[16px] bg-light_neutral_200 w-[239px] h-[102px] rounded-md text-dark_neutral_500 border border-dark_neutral_500 drop-shadow`}
                                    >
                                      <button
                                        className={`text-left`}
                                        onClick={() => handleDeletePosition(positionData._id)}
                                      >
                                        Hapus Posisi
                                      </button>
                                      <button
                                        onClick={() => handleResolvePosition(positionData._id)}
                                        className={`text-left`}
                                      >
                                        Selesaikan Posisi
                                      </button>
                                    </div>
                                  </Popover.Panel>
                                </Popover>
                              </div>
                            </div>
                            <div className={`flex gap-[65px] justify-center items-center`}>
                              <div className={`text-center`}>
                                <span className={`font-semibold text-2xl`}>{positionData.uploadedCV}</span>
                                <p>CV yang Terunggah</p>
                              </div>
                              <div className={`border border-dark_neutral_100 h-[79.27px]`} />
                              <button
                                className={`flex items-center justify-center w-[139px] h-[47px] rounded  bg-light_neutral_500`}
                              >
                                Nilai Semua CV
                              </button>
                              <div className={`border border-dark_neutral_100  h-[79.27px]`} />
                            </div>
                            <div className={`flex justify-between`}>
                              <div className={`flex items-center gap-[6px] `}>
                                {positionData.isResolved ? (
                                  <>
                                    <AiOutlineCheck className={` text-xl text-semantic_green_500`} />
                                    <p>Posisi ini sudah selesai</p>
                                  </>
                                ) : (
                                  <>
                                    <VscChromeClose className={` text-xl text-semantic_red_500`} />
                                    <p>Posisi ini belum selesai</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              ) : (
                <div className={`flex flex-col gap-6`}>
                  {Array.isArray(positionDataList) &&
                    positionDataList
                      .filter(
                        (positionData) =>
                          !positionData.isTrash.isInTrash &&
                          (idSelectedDepartment ? positionData.department === idSelectedDepartment : true)
                      )
                      .map((positionData: PositionData) => (
                        <div key={positionData._id}>
                          <div className={`flex flex-col gap-8 bg-primary_white h-[262.27px] rounded-md py-6 px-8`}>
                            <div className={`flex justify-between`}>
                              <p className={`flex items-center gap-[18px] text-xl text-dark_neutral_100`}>
                                <span className={`text-2xl text-primary_dark font-semibold`}>{positionData.name}</span>
                                <span>-</span>
                                <span>
                                  {
                                    departmentDataList.find((department) => department._id === positionData.department)
                                      ?.name
                                  }
                                </span>
                              </p>
                              <div className={`flex items-center gap-[18px]`}>
                                <Link
                                  href={`/jobs/edit/edit-position?positionId=${encodeURIComponent(
                                    positionData._id
                                  )}&selectedDepartment=${encodeURIComponent(
                                    departmentDataList.find((department) => department._id === positionData.department)
                                      ?.name ?? ''
                                  )}&selectedEducation=${encodeURIComponent(
                                    positionData.education
                                  )}&departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                                  className={`flex items-center w-[124px] h-[47px] border hover:border-[2px] border-primary_blue text-primary_blue rounded gap-[6px]  justify-center`}
                                >
                                  <FiEdit2 />
                                  Edit Posisi
                                </Link>
                                <button
                                  className={`${
                                    isUploading && uploadingId === positionData._id
                                      ? 'bg-primary_white text-primary_blue border-primary_blue'
                                      : 'bg-primary_blue text-primary_white'
                                  } bg-primary_blue text-primary_white rounded py-[14px] px-[10px] text-center hover:bg-primary_white hover:border-primary_blue hover:text-primary_blue border`}
                                >
                                  {isUploading ? (
                                    <div className={`flex items-center gap-[6px]`}>
                                      <div
                                        className={`w-[20px] h-6 border-t-2 border-primary_blue rounded-full animate-spin`}
                                      />
                                      <p>Uploading</p>
                                    </div>
                                  ) : (
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                      <p>
                                        <span className="mr-[6px] text-[19px]">+</span> Tambah Kandidat Baru
                                      </p>
                                      <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, positionData._id)}
                                      />
                                    </label>
                                  )}
                                </button>
                                <Popover className={`relative`}>
                                  <Popover.Button className={`focus:bg-light_neutral_500 h-[44px] rounded-xl `}>
                                    <RxDotsVertical className={`w-[20px] h-6`} />
                                  </Popover.Button>
                                  <Popover.Panel className={`absolute z-10`}>
                                    <div
                                      className={`grid grid-rows-2 pl-[16px] bg-light_neutral_200 w-[239px] h-[102px] rounded-md text-dark_neutral_500 border border-dark_neutral_500 drop-shadow`}
                                    >
                                      <button
                                        className={`text-left`}
                                        onClick={() => handleDeletePosition(positionData._id)}
                                      >
                                        Hapus Posisi
                                      </button>
                                      <button
                                        onClick={() => handleResolvePosition(positionData._id)}
                                        className={`text-left`}
                                      >
                                        Selesaikan Posisi
                                      </button>
                                    </div>
                                  </Popover.Panel>
                                </Popover>
                              </div>
                            </div>
                            <div className={`flex gap-[65px] justify-center items-center`}>
                              <div className={`text-center`}>
                                <span className={`font-semibold text-2xl`}>{positionData.uploadedCV}</span>
                                <p>CV yang Terunggah</p>
                              </div>
                              <div className={`border border-dark_neutral_100 h-[79.27px]`} />
                              <div className={`text-center`}>
                                <span className={`font-semibold text-2xl`}>{positionData.filteredCV}</span>
                                <p>CV yang Tersaring</p>
                              </div>
                              <div className={`border border-dark_neutral_100  h-[79.27px]`} />
                              <div className={`text-center`}>
                                <span className={`font-semibold text-2xl`}>{positionData.qualifiedCandidates}</span>
                                <p>Kandidat Terkualifikasi</p>
                              </div>
                            </div>
                            <div className={`flex justify-between`}>
                              <div className={`flex items-center gap-[6px] `}>
                                {positionData.isResolved ? (
                                  <>
                                    <AiOutlineCheck className={` text-xl text-semantic_green_500`} />
                                    <p>Posisi ini sudah selesai</p>
                                  </>
                                ) : (
                                  <>
                                    <VscChromeClose className={` text-xl text-semantic_red_500`} />
                                    <p>Posisi ini belum selesai</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}
