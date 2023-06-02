import { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './../components/Layout';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscChromeClose } from 'react-icons/vsc';
import { FiEdit2 } from 'react-icons/fi';
import { RxDotsVertical } from 'react-icons/rx';
import { Popover } from '@headlessui/react';
import { getItem, setItem } from '@/utils/sessionStorage';
import dynamic from 'next/dynamic';
import PositionData from '@/interfaces/PositionData';
import { Modal } from '@/components/Modal';

const Link = dynamic(() => import('next/link'));
import UploadCV from './talent-pool/upload-cv';

export default function Home() {
  const [formDataList, setFormDataList] = useState<PositionData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [positionChecked, setPositionChecked] = useState(0);
  const [idPositionChecked, setIdPositionChecked] = useState<number[]>([]);

  const fetchData = useCallback(async () => {
    const data = await getItem('positionDataList');
    setFormDataList(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim() === '') {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  const handleNavigateDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDelete((isDelete) => !isDelete);
  };

  const handleCheckedPosition = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (event.target.checked) {
      setIdPositionChecked((idPositionChecked) => [...idPositionChecked, id]);
      setPositionChecked((positionChecked) => positionChecked + 1);
    } else {
      const newIdPositionChecked = idPositionChecked.filter((idPosition: number) => idPosition !== id);
      setIdPositionChecked(newIdPositionChecked);
      setPositionChecked((positionChecked) => positionChecked - 1);
    }
  };

  const handleCheckedDelete = () => {
    setFormDataList((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        if (idPositionChecked.includes(newState[i].id)) {
          newState[i].isTrash.isInTrash = true;
          newState[i].isTrash.removedDate = new Date();
        }
      }
      setItem('positionDataList', newState)
        .then(() => {
          // Handle successful storage
          console.log('Data stored successfully');
        })
        .catch((error) => {
          // Handle storage error
          console.error('Error storing data:', error);
        });
      return newState;
    });
    setIsDelete(false);
    setPositionChecked(0);
    setIdPositionChecked([]);
  };

  const handleDeletePosition = (id: number) => {
    setFormDataList((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        if (newState[i].id === id) {
          newState[i].isTrash.isInTrash = true;
          newState[i].isTrash.removedDate = new Date();
          break;
        }
      }
      setItem('positionDataList', newState);
      return newState;
    });
  };

  {
    /*const filteredData = formDataList && formDataList.filter((positionData: any) => {
    return positionData.position.toLowerCase().includes(searchTerm.toLowerCase()) || positionData.department.toLowerCase().includes(searchTerm.toLowerCase());
  });*/
  }

  const filteredData = useMemo(() => {
    if (!formDataList) return [];
    return formDataList.filter((positionData: any) => {
      return (
        positionData.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        positionData.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [formDataList, searchTerm]);

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
                {' '}
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
              <div className={`flex flex-col gap-6`}>
                {Array.isArray(formDataList) &&
                  formDataList
                    .filter((position) => !position.isTrash.isInTrash)
                    .map((positionData: any, index: number) => (
                      <div key={index} className={`flex gap-[32px] items-center `}>
                        <input
                          type="checkbox"
                          className={`hover:cursor-pointer w-[34px] h-[34px] bg-light_neutral_300 border border-mid_neutral_600`}
                          onChange={(e) => handleCheckedPosition(e, positionData.id)}
                        />
                        <div
                          className={`flex flex-col gap-8 bg-primary_white w-[1148px] h-[262.27px] rounded-md py-6 px-8`}
                        >
                          <div className={`flex justify-between`}>
                            <p className={`flex items-center gap-[18px] text-xl text-dark_neutral_100`}>
                              <span className={`text-2xl text-primary_dark font-semibold`}>
                                {positionData.position}
                              </span>
                              <span>-</span>
                              <span>{positionData.department}</span>
                            </p>
                            <div className={`flex items-center gap-[18px]`}>
                              <button
                                className={`flex items-center w-[124px] h-[47px] border hover:border-[2px] border-primary_blue text-primary_blue rounded gap-[6px]  justify-center`}
                              >
                                <FiEdit2 />
                                Edit Posisi
                              </button>
                              <button
                                className={`bg-primary_blue text-primary_white rounded py-[14px] px-[10px] text-center hover:bg-primary_white hover:border-primary_blue hover:text-primary_blue border`}
                              >
                                + Tambah Kandidat Baru
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
                                      onClick={() => handleDeletePosition(positionData.id)}
                                    >
                                      Hapus Posisi
                                    </button>
                                    <button className={`text-left`}>Selesaikan Posisi</button>
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
                              <VscChromeClose className={` text-xl text-semantic_red_500`} />
                              <p>Posisi ini belum selesai</p>
                            </div>
                            <p>
                              Kandidat terakhir ditambahkan:
                              <span className={`font-semibold`}>-</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section
            className={`bg-light_neutral_200 flex gap-[230px]   w-full py-[18px] px-[31px] border-[1px] border-mid_neutral_100`}
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
                {' '}
                <BsFillTrashFill />
                Hapus Posisi
              </button>
            </div>
          </section>
          <section className={`pt-[59px]`}>
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
              {isSearching ? (
                <div className={`flex flex-col gap-6`}>
                  {Array.isArray(filteredData) &&
                    filteredData
                      .filter((positionData) => !positionData.isTrash.isInTrash)
                      .map((positionData: any, index: number) => (
                        <div key={index}>
                          <div className={`flex flex-col gap-8 bg-primary_white h-[262.27px] rounded-md py-6 px-8`}>
                            <div className={`flex justify-between`}>
                              <p className={`flex items-center gap-[18px] text-xl text-dark_neutral_100`}>
                                <span className={`text-2xl text-primary_dark font-semibold`}>
                                  {positionData.position}
                                </span>
                                <span>-</span>
                                <span>{positionData.department}</span>
                              </p>
                              <div className={`flex items-center gap-[18px]`}>
                                <button
                                  className={`flex items-center w-[124px] h-[47px] border hover:border-[2px] border-primary_blue text-primary_blue rounded gap-[6px]  justify-center`}
                                >
                                  <FiEdit2 />
                                  Edit Posisi
                                </button>
                                <button
                                  className={`bg-primary_blue text-primary_white rounded py-[14px] px-[10px] text-center hover:bg-primary_white hover:border-primary_blue hover:text-primary_blue border`}
                                >
                                  + Tambah Kandidat Baru
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
                                        onClick={() => handleDeletePosition(positionData.id)}
                                      >
                                        Hapus Posisi
                                      </button>
                                      <button className={`text-left`}>Selesaikan Posisi</button>
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
                              <div className={`text-center`}>
                                <span className={`font-semibold text-2xl`}>{positionData.filteredCV}</span>
                                <p>Kandidat Terpilihj</p>
                              </div>
                              <div className={`border border-dark_neutral_100  h-[79.27px]`} />
                              <div className={`text-center`}>
                                <span className={`font-semibold text-2xl`}>{positionData.qualifiedCandidates}</span>
                                <p>Kandidat Terkualifikasi</p>
                              </div>
                            </div>
                            <div className={`flex justify-between`}>
                              <div className={`flex items-center gap-[6px] `}>
                                <VscChromeClose className={` text-xl text-semantic_red_500`} />
                                <p>Posisi ini belum selesai</p>
                              </div>
                              <p>
                                Kandidat terakhir ditambahkan:
                                <span className={`font-semibold`}>-</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              ) : (
                <div className={`flex flex-col gap-6`}>
                  {Array.isArray(formDataList) &&
                    formDataList
                      .filter((positionData) => !positionData.isTrash.isInTrash)
                      .map((positionData: any, index: number) => (
                        <div key={index}>
                          <div className={`flex flex-col gap-8 bg-primary_white h-[262.27px] rounded-md py-6 px-8`}>
                            <div className={`flex justify-between`}>
                              <p className={`flex items-center gap-[18px] text-xl text-dark_neutral_100`}>
                                <span className={`text-2xl text-primary_dark font-semibold`}>
                                  {positionData.position}
                                </span>
                                <span>-</span>
                                <span>{positionData.department}</span>
                              </p>
                              <div className={`flex items-center gap-[18px]`}>
                                <button
                                  className={`flex items-center w-[124px] h-[47px] border hover:border-[2px] border-primary_blue text-primary_blue rounded gap-[6px]  justify-center`}
                                >
                                  <FiEdit2 />
                                  Edit Posisi
                                </button>
                                <button
                                  className={`bg-primary_blue text-primary_white rounded py-[14px] px-[10px] text-center hover:bg-primary_white hover:border-primary_blue hover:text-primary_blue border`}
                                >
                                  + Tambah Kandidat Baru
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
                                        onClick={() => handleDeletePosition(positionData.id)}
                                      >
                                        Hapus Posisi
                                      </button>
                                      <button className={`text-left`}>Selesaikan Posisi</button>
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
                                <VscChromeClose className={` text-xl text-semantic_red_500`} />
                                <p>Posisi ini belum selesai</p>
                              </div>
                              <p>
                                Kandidat terkahir ditambahkan:
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
        </>
      )}
    </Layout>
  );
}
