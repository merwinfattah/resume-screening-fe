import { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '@/components/Layout';
import PositionData from '@/interfaces/PositionData';
import { Modal } from '@/components/Modal';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import DepartmentDataService from './api/services/department.service';
import PositionDataService from './api/services/position.service';
import Department from '@/interfaces/Department';

export default function Trash() {
  const companyId = useSelector((state: any) => state.login.companyId);
  const token = useSelector((state: any) => state.auth.token);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [positionDataList, setPositionDataList] = useState<PositionData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDelete, setIsDelete] = useState(false);
  const [isRestore, setIsRestore] = useState(false);
  const [positionChecked, setPositionChecked] = useState(0);
  const [idPositionChecked, setIdPositionChecked] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = '/auth/login';
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDepartment = await DepartmentDataService.getAll(token.token);
        const responsePosition = await PositionDataService.getAll(token.token);
        console.log(responseDepartment.data);
        setDepartmentList(responseDepartment.data);
        setPositionDataList(responsePosition.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [companyId, token]);

  const filteredDepartmentList =
    departmentList?.filter((department: Department) => {
      for (let i = 0; i < positionDataList.length; i++) {
        if (positionDataList[i].department === department._id && positionDataList[i].isTrash.isInTrash) {
          return true;
        }
      }
      return false;
    }) || [];

  const handleNavigateDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDelete((isDelete) => !isDelete);
  };

  const handleNavigateRestore = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsRestore((isRestore) => !isRestore);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckedPosition = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      setIdPositionChecked((idPositionChecked) => [...idPositionChecked, id]);
      setPositionChecked((positionChecked) => positionChecked + 1);
      console.log(idPositionChecked);
    } else {
      const newIdPositionChecked = idPositionChecked.filter((idPosition: string) => idPosition !== id);
      setIdPositionChecked(newIdPositionChecked);
      setPositionChecked((positionChecked) => positionChecked - 1);
      console.log(idPositionChecked);
    }
  };

  const handleDeletePosition = async () => {
    const newPositionDataList = positionDataList.filter(
      (positionData: PositionData) => !idPositionChecked.includes(positionData._id)
    );
    setPositionDataList(newPositionDataList);
    const data = {
      ids: [...idPositionChecked],
    };
    try {
      const response = await PositionDataService.delete(data, token.token);
      console.log(response.data);
      setIsDelete((isDelete) => !isDelete);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestorePosition = async () => {
    const newPositionDataList = positionDataList.map((positionData: PositionData) => {
      if (idPositionChecked.includes(positionData._id)) {
        positionData.isTrash.isInTrash = false;
      }
      return positionData;
    });
    setPositionDataList(newPositionDataList);
    const data = {
      ids: [...idPositionChecked],
    };
    try {
      const restoreResponse = await PositionDataService.remove(data, token.token);
      console.log(restoreResponse.data);
      setIsRestore((isRestore) => !isRestore);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Layout>
      {isDelete || isRestore ? (
        <>
          <section
            className={`bg-light_neutral_200 flex items-center  justify-between   w-full py-[18px] pl-[320px] pr-[32px] border-[1px] border-mid_neutral_100`}
          >
            <div className={`text-dark_neutral_400 text-[24px]`}>
              <span className={`font-bold`}>{positionChecked}</span> dipilih
            </div>
            {isDelete ? (
              positionChecked > 0 ? (
                <button
                  onClick={showModal}
                  className={`w-[161px] h-[47px] bg-semantic_red_500 text-primary_white rounded flex  items-center px-[10px] py-[14px] gap-[6px] justify-center border hover:bg-primary_white hover:text-semantic_red_500 hover:border-semantic_red_500`}
                >
                  <BsFillTrashFill /> Hapus Posisi
                </button>
              ) : (
                <button
                  onClick={handleNavigateDelete}
                  className={`hover:border-2 w-[98px] h-[47px] rounded text-semantic_red_500 border border-semantic_red_500`}
                >
                  X Batal
                </button>
              )
            ) : positionChecked > 0 ? (
              <button
                onClick={showModal}
                className={`w-[145px] h-[47px] rounded py-[12px] text-center  text-semantic_green_600 border border-semantic_green_600 hover:border-2`}
              >
                Pulihkan Posisi
              </button>
            ) : (
              <button
                onClick={handleNavigateRestore}
                className={`hover:border-2 w-[98px] h-[47px] rounded text-semantic_green_600 border border-semantic_green_600`}
              >
                X Batal
              </button>
            )}
          </section>
          <section className={`pt-8`}>
            <div
              className={`container mx-auto flex justify-between w-[1856px] h-[44px] rounded bg-semantic_purple_100 border border-semantic_purple_600 text-semantic_purple_600 py-[10px] px-[12px]`}
            >
              <p>
                Catatan: Setiap item yang Anda hapus akan tetap berada di halaman Sampah selama 30 hari sebelum dihapus
                secara permanen
              </p>
            </div>
            <div className={` mx-[32px] mt-8 flex flex-col gap-6`}>
              {filteredDepartmentList.map((department: Department) => {
                return (
                  <div key={department._id}>
                    <div className={`flex gap-[18px] items-center`}>
                      <p className={`min-w-fit text-2xl font-bold text-dark_neutral_500`}>
                        Departemen {department.name}
                      </p>
                      <hr className={`w-full h-[2px]  bg-dark_neutral_100`} />
                    </div>
                    <div className={`flex flex-wrap gap-8 mt-6`}>
                      {positionDataList
                        .filter((position) => position.department === department._id && position.isTrash.isInTrash)
                        .map((positionData) => {
                          const createdDate = new Date(department.createdDate);
                          const formattedDate = createdDate.toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          });

                          return (
                            <div
                              key={positionData._id}
                              className={`${
                                idPositionChecked.includes(positionData._id) ? 'border-primary_blue' : ''
                              } border flex flex-col gap-6  w-[440px] h-[308px]  bg-light_neutral_200 rounded p-6 `}
                            >
                              <div className={`flex flex-col gap-[12px]`}>
                                <div className={`flex justify-between`}>
                                  <h2 className={`font-semibold text-2xl text-primary_dark`}>{positionData.name}</h2>
                                  <input
                                    type="checkbox"
                                    className={`hover:cursor-pointer w-[29px] h-[29px] bg-light_neutral_300 border border-mid_neutral_600`}
                                    onChange={(e) => handleCheckedPosition(e, positionData._id)}
                                  />
                                </div>
                                <div>
                                  <p className={`font-normal text-dark_neutral_100  `}>
                                    Ditambahkan pada tanggal:
                                    <span className={`font-semibold text-dark_neutral_400`}>{formattedDate}</span>
                                  </p>
                                </div>
                              </div>
                              <div className={` grid  gap-3`}>
                                <div
                                  className={`w-[392px] h-[35px] flex justify-between bg-light_neutral_300 border border-light_neutral_600 p-2 rounded-sm`}
                                >
                                  <p className={`text-dark_neutral_300`}>Uploaded CV</p>
                                  <p className={`text-primary_dark font-semibold`}>{positionData.uploadedCV}</p>
                                </div>
                                <div
                                  className={`w-[392px] h-[35px] flex justify-between bg-light_neutral_300 border border-light_neutral_600 p-2 rounded-sm`}
                                >
                                  <p className={`text-dark_neutral_300`}>Filtered CV</p>
                                  <p className={`text-primary_dark font-semibold`}>{positionData.filteredCV}</p>
                                </div>

                                <div
                                  className={`w-[392px] h-[35px] flex justify-between bg-light_neutral_300 border border-light_neutral_600 p-2 rounded-sm`}
                                >
                                  <p className={`text-dark_neutral_300`}>Qualified Candidates</p>
                                  <p className={`text-primary_dark font-semibold`}>
                                    {positionData.qualifiedCandidates}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
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
                className={` flex items-center justify-between w-[676px] h-[47px] border border-dark_neutral_100  rounded`}
              >
                <input
                  placeholder="Cari departemen"
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
              <button
                onClick={handleNavigateDelete}
                className={`w-[161px] h-[47px] bg-semantic_red_500 text-primary_white rounded flex  items-center px-[10px] py-[14px] gap-[6px] justify-center border hover:bg-primary_white hover:text-semantic_red_500 hover:border-semantic_red_500`}
              >
                <BsFillTrashFill /> Hapus Posisi
              </button>
              <button
                onClick={handleNavigateRestore}
                className={`w-[145px] h-[47px] rounded py-[12px] text-center  text-semantic_green_600 border border-semantic_green_600 hover:border-2`}
              >
                Pulihkan Posisi
              </button>
            </div>
          </section>
          <section className={`pt-8`}>
            <div
              className={`container mx-auto flex justify-between w-[1856px] h-[44px] rounded bg-semantic_purple_100 border border-semantic_purple_600 text-semantic_purple_600 py-[10px] px-[12px]`}
            >
              <p>
                Catatan: Setiap item yang Anda hapus akan tetap berada di halaman Sampah selama 30 hari sebelum dihapus
                secara permanen
              </p>
            </div>
            <div className={` mx-[32px] mt-8 flex flex-col gap-6`}>
              {filteredDepartmentList
                .filter((department) => department.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((department: Department) => {
                  return (
                    <div key={department._id}>
                      <div className={`flex gap-[18px] items-center`}>
                        <p className={`min-w-fit text-2xl font-bold text-dark_neutral_500`}>
                          Departemen {department.name}
                        </p>
                        <hr className={`w-full h-[2px]  bg-dark_neutral_100`} />
                      </div>
                      <div className={`flex flex-wrap gap-8 mt-6`}>
                        {positionDataList
                          .filter(
                            (position: PositionData) =>
                              position.department === department._id && position.isTrash.isInTrash
                          )
                          .map((positionData: PositionData) => {
                            const createdDate = new Date(department.createdDate);
                            const formattedDate = createdDate.toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            });

                            return (
                              <div
                                key={positionData._id}
                                className={`flex flex-col gap-6  w-[440px] h-[308px]  bg-light_neutral_200 rounded p-6 `}
                              >
                                <div>
                                  <h2 className={`font-semibold text-2xl text-primary_dark`}>{positionData.name}</h2>
                                  <p className={`font-normal text-dark_neutral_100 mt-3 `}>
                                    Ditambahkan pada tanggal:{' '}
                                    <span className={`font-semibold text-dark_neutral_400`}>{formattedDate}</span>
                                  </p>
                                </div>
                                <div className={` grid  gap-3`}>
                                  <div
                                    className={`w-[392px] h-[35px] flex justify-between bg-light_neutral_300 border border-light_neutral_600 p-2 rounded-sm`}
                                  >
                                    <p className={`text-dark_neutral_300`}>Uploaded CV</p>
                                    <p className={`text-primary_dark font-semibold`}>{positionData.uploadedCV}</p>
                                  </div>
                                  <div
                                    className={`w-[392px] h-[35px] flex justify-between bg-light_neutral_300 border border-light_neutral_600 p-2 rounded-sm`}
                                  >
                                    <p className={`text-dark_neutral_300`}>Filtered CV</p>
                                    <p className={`text-primary_dark font-semibold`}>{positionData.filteredCV}</p>
                                  </div>

                                  <div
                                    className={`w-[392px] h-[35px] flex justify-between bg-light_neutral_300 border border-light_neutral_600 p-2 rounded-sm`}
                                  >
                                    <p className={`text-dark_neutral_300`}>Qualified Candidates</p>
                                    <p className={`text-primary_dark font-semibold`}>
                                      {positionData.qualifiedCandidates}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </>
      )}
      {isModalOpen && (
        <Modal
          type={`${isDelete ? 'delete-position' : 'restore-position'}`}
          isOpen={isModalOpen}
          onOk={isDelete ? handleDeletePosition : handleRestorePosition}
          onClose={closeModal}
          headline="Apa anda yakin?"
          content={`${
            isDelete
              ? 'Menghapus posisi ini dari Trash berarti menghapus seluruh posisi ini secara permanen'
              : 'Dengan memulihkan posisi ini dari Trash, anda dapat mengakses posisi ini kembali'
          }`}
        />
      )}
    </Layout>
  );
}
