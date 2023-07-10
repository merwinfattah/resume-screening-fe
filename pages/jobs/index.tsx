import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import PositionData from '@/interfaces/PositionData';
import Department from '@/interfaces/Department';
import { Modal } from '@/components/Modal';
import { useSelector } from 'react-redux';
import DepartmentDataService from '../api/services/department.service';
import PositionDataService from '../api/services/position.service';
import { Disclosure, Transition } from '@headlessui/react';

//Dynamic Imports
const Layout = dynamic(() => import('@/components/Layout'));
const Link = dynamic(() => import('next/link'));
const IoMdArrowDropdown = dynamic(() => import('react-icons/io').then((module) => module.IoMdArrowDropdown));
const IoAddCircleOutline = dynamic(() => import('react-icons/io5').then((module) => module.IoAddCircleOutline));
const GrAdd = dynamic(() => import('react-icons/gr').then((module) => module.GrAdd));
const AiOutlineSearch = dynamic(() => import('react-icons/ai').then((module) => module.AiOutlineSearch));
const EditorInput = dynamic(() => import('@/components/EditorInput'));
const BsFillTrashFill = dynamic(() => import('react-icons/bs').then((module) => module.BsFillTrashFill));

export default function Jobs() {
  const companyId = useSelector((state: any) => state.login.companyId);
  const token = useSelector((state: any) => state.auth.token);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [positionDataList, setPositionDataList] = useState<PositionData[]>([]);
  const [isDelete, setIsDelete] = useState(false);
  const [departmentChecked, setDepartmentChecked] = useState(0);
  const [idDepartmentChecked, setIdDepartmentChecked] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (!token) {
      window.location.href = '/auth/login';
    }
  }, [token]);

  useEffect(() => {
    const fetchDataPosition = async () => {
      try {
        const positionDataResponse = await PositionDataService.getAll(token.token);
        setPositionDataList(positionDataResponse.data);
      } catch (error) {
        console.error('Error fetching position data:', error);
      }
    };

    fetchDataPosition();
  }, [companyId, token]);

  useEffect(() => {
    const fetchDataDepartment = async () => {
      try {
        const departmentDataResponse = await DepartmentDataService.getAll(token.token);
        setDepartmentList(departmentDataResponse.data);
      } catch (error) {
        console.error('Error fetching department data:', error);
      }
    };
    fetchDataDepartment();
  }, [companyId, token]);

  const addItemToList = async () => {
    const newItem = {
      companyId: companyId,
    };
    try {
      const response = await DepartmentDataService.create(newItem, token.token);
      setDepartmentList((prevState) => {
        const newState = [...prevState];
        newState.push(response.data.department);
        return newState;
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deletePositionId, setDeletePositionId] = useState<string>('');
  const [deletePosition, setDeletePosition] = useState<string>('');
  const [deleteDepartment, setDeleteDepartment] = useState<string>('');
  const [isCheckedDelete, setIsCheckedDelete] = useState<boolean>(false);
  const departmentOptions = departmentList.map((department: Department) => {
    return {
      value: department.name,
      label: department.name,
    };
  });
  const departmentOptionsJson = JSON.stringify(departmentOptions);
  const showModal = (id: string, position: string, department: string) => {
    setIsModalOpen(true);
    setDeletePosition(position);
    setDeleteDepartment(department);
    setDeletePositionId(id);
  };

  const showModalCheckedDelete = async () => {
    setIsModalOpen(true);
    setIsCheckedDelete(true);
  };

  const handleDeletePosition = async (id: string) => {
    setPositionDataList((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        if (newState[i]._id === deletePositionId) {
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
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };

  const closeModal = async () => {
    setIsModalOpen(false);
    if (isCheckedDelete) {
      setIsCheckedDelete(false);
    }
  };

  const handleNameChange = async (newName: string, id: string) => {
    const data = {
      id: id,
      name: newName,
    };

    setDepartmentList((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        if (newState[i] && newState[i]._id === id) {
          newState[i] = { ...newState[i], name: newName };
          break;
        }
      }
      return newState;
    });

    try {
      const response = await DepartmentDataService.edit(data, token.token);
    } catch (error) {
      console.error('Error updating department name:', error);
    }
  };

  const handleNavigateDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDelete((isDelete) => !isDelete);
  };

  const handleCheckedDepartment = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      setIdDepartmentChecked((idDepartmentChecked) => [...idDepartmentChecked, id]);
      setDepartmentChecked((departmentChecked) => departmentChecked + 1);
    } else {
      const newIdDepartmentChecked = idDepartmentChecked.filter((idPosition: string) => idPosition !== id);
      setIdDepartmentChecked(newIdDepartmentChecked);
      setDepartmentChecked((departmentChecked) => departmentChecked - 1);
    }
  };

  const handleCheckedDelete = async () => {
    let newDepartmentList = [...departmentList];
    newDepartmentList = newDepartmentList.filter((department) => !idDepartmentChecked.includes(department._id));
    setDepartmentList(newDepartmentList);
    let data = {
      ids: [...idDepartmentChecked],
    };
    try {
      await DepartmentDataService.delete(data, token.token);
    } catch (error) {
      console.error('Error deleting department:', error);
    } finally {
      setIdDepartmentChecked([]);
      setIsDelete((isDelete) => !isDelete);
      setIsCheckedDelete(false);
      setIsModalOpen(false);
    }
  };

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Layout>
      {isDelete ? (
        <>
          <section
            className={`bg-light_neutral_200 flex gap-[230px] items-center justify-between   w-full py-[18px] pl-[320px] pr-[32px] border-[1px] border-mid_neutral_100`}
          >
            <p className={`text-dark_neutral_400 text-[24px]`}>
              <span className={`font-bold`}>{departmentChecked}</span> Dipilih
            </p>
            {departmentChecked > 0 ? (
              <button
                onClick={showModalCheckedDelete}
                className={`w-[181px] h-[47px] bg-semantic_red_500 text-primary_white rounded flex  items-center  gap-[6px] justify-center hover:text-semantic_red_500 hover:bg-primary_white border border-semantic_red_500`}
              >
                <BsFillTrashFill />
                Hapus Departemen
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
          <section className={`container mx-auto mt-[40px] w-[1148px] `}>
            <h2 className={`font-bold mt-[32px]`}>DAFTAR DEPARTEMEN</h2>
            <div className={` mt-6 flex flex-col gap-[18px]`}>
              {departmentList.map((department) => (
                <Disclosure key={department._id}>
                  {({ open }) => (
                    <>
                      <div className={`flex items-center gap-[32px]`}>
                        <input
                          type="checkbox"
                          className={`hover:cursor-pointer w-[34px] h-[34px] bg-light_neutral_300 border border-mid_neutral_600`}
                          onChange={(e) => handleCheckedDepartment(e, department._id)}
                        />
                        <div
                          className={`flex justify-between px-8 pb-[21px] pt-[22px] w-[1148px] h-[72px] z-10 mb-1 rounded-md ${
                            open ? ' rounded-b-none  drop-shadow-lg' : ''
                          } bg-light_neutral_200`}
                        >
                          <EditorInput
                            initialValue={department.name}
                            onValueChange={(newName) => handleNameChange(newName, department._id)}
                          />
                          <div className={'flex gap-[18px] items-center'}>
                            {positionDataList.filter(
                              (position) =>
                                position.department === department._id && position.isTrash.isInTrash === false
                            ).length > 0 ? (
                              <>
                                <Link
                                  href={`/jobs/add-new-position?departmentName=${encodeURIComponent(
                                    department.name
                                  )}&departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                                  className={`text-[31px] font-thin`}
                                >
                                  <IoAddCircleOutline />
                                </Link>
                                <div
                                  className={`flex justify-center items-center w-[181px] h-[31px] rounded-[68px]  bg-semantic_blue_100`}
                                >
                                  {
                                    positionDataList.filter(
                                      (position) =>
                                        position.department === department._id && position.isTrash.isInTrash === false
                                    ).length
                                  }
                                  posisi
                                </div>
                              </>
                            ) : (
                              <Link
                                href={`/jobs/add-new-position?departmentName=${encodeURIComponent(
                                  department.name
                                )}&departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                                className={`flex w-[198.4px] h-[31px] py-[6px] justify-center rounded-[68px] font-bold items-center gap-[10px] border border-dark_neutral_400 text-dark_neutral_400`}
                              >
                                <GrAdd />
                                Tambah Posisi
                              </Link>
                            )}
                            <Disclosure.Button className={` text-[30px] `}>
                              <IoMdArrowDropdown className={`${open ? 'rotate-180 transform' : ''}`} />
                            </Disclosure.Button>
                          </div>
                        </div>
                      </div>
                      <Transition
                        enter="transition ease-out duration-100 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Disclosure.Panel
                          className={`w-[1148px] flex flex-col gap-[18px] justify-center pt-[32px] pb-[29px] z-0 bg-light_neutral_200 rounded-b-lg rounded-l-md ${
                            open ? 'rounded-t-none' : ''
                          }`}
                        >
                          {positionDataList
                            .filter(
                              (position) =>
                                position.department === department._id && position.isTrash.isInTrash !== true
                            )
                            .map((position: PositionData) => (
                              <div key={position._id} className={`flex justify-center gap-4`}>
                                <button
                                  className={` text-2xl text-semantic_red_500`}
                                  onClick={() => showModal(position._id, position.name, position.department)}
                                >
                                  <BsFillTrashFill />
                                </button>
                                <div
                                  className={`flex items-center justify-between py-3 px-3 rounded-md text-dark_neutral_300 bg-light_neutral_400 w-[1037px] h-[53px]`}
                                >
                                  <div className={`font-semibold`}>{position.name}</div>
                                  <div className={`flex items-center gap-[18px]`}>
                                    <p>
                                      <span className={`font-semibold`}>{position.qualifiedCandidates}</span> Kandidat
                                      Terkualifikasi
                                    </p>
                                    <div className={` text-mid_neutral_400  font-semibold`}>|</div>

                                    <Link
                                      href={`/jobs/edit-position?positionId=${encodeURIComponent(
                                        position._id
                                      )}&selectedDepartment=${encodeURIComponent(
                                        department.name
                                      )}&selectedEducation=${encodeURIComponent(
                                        position.education
                                      )}&departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                                      className={`flex justify-center items-center w-[101px] h-[29px] rounded-[68px]  border border-primary_blue text-primary_blue`}
                                    >
                                      Edit Posisi
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              ))}
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
                  placeholder="Cari department"
                  className={`  outline-none mx-[10px] my-[12.5px] bg-light_neutral_200 w-full`}
                  onChange={handleSearchChange}
                  value={searchTerm}
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
                href={`/jobs/add-new-position?departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
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
                Hapus Departemen
              </button>
            </div>
          </section>
          <section className={`container mx-auto mt-[40px] w-[1148px] `}>
            <h2 className={`font-bold`}>DEPARTEMEN</h2>
            <div className={`flex flex-row  bg-light_neutral_200 rounded-md py-[30px] pl-[38.5px] pr-[35px] mt-6`}>
              <div className={` w-5/6 text-dark_neutral_300`}>
                <h3 className={` text-2xl font-semibold`}>Tambah departemen baru</h3>
                <p className={`mt-[18px] w-[837px]`}>
                  Berikut adalah daftar semua departemen yang Anda buat. Tambahkan departemen dan posisi sebanyak yang
                  Anda inginkan untuk mengotomatiskan proses penyaringan CV Anda.
                </p>
              </div>
              <button
                className={`flex justify-center items-center w-[199px] h-[42px] rounded  border border-dark_neutral_400 text-dark_neutral_400`}
                onClick={addItemToList}
              >
                Tambah Departemen
              </button>
            </div>
            <h2 className={`font-bold mt-[32px]`}>DAFTAR DEPARTEMEN</h2>
            <div className={` mt-6 flex flex-col gap-[18px]`}>
              {departmentList
                .filter((department) => department.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((department) => (
                  <Disclosure key={department._id}>
                    {({ open }) => (
                      <>
                        <div>
                          <div
                            className={`flex justify-between px-8 pb-[21px] pt-[22px] w-[1148px] h-[72px] z-10 mb-1 rounded-md ${
                              open ? ' rounded-b-none  drop-shadow-lg' : ''
                            } bg-light_neutral_200`}
                          >
                            <EditorInput
                              initialValue={department?.name || ''}
                              onValueChange={(newName) => handleNameChange(newName, department._id)}
                            />
                            <div className={'flex gap-[18px] items-center'}>
                              {positionDataList.filter(
                                (position) =>
                                  position.department === department._id && position.isTrash.isInTrash === false
                              ).length > 0 ? (
                                <>
                                  <Link
                                    href={`/jobs/add-new-position?departmentName=${encodeURIComponent(
                                      department.name
                                    )}&departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                                    className={`text-[31px] font-thin`}
                                  >
                                    <IoAddCircleOutline />
                                  </Link>
                                  <div
                                    className={`flex justify-center items-center w-[181px] h-[31px] rounded-[68px]  bg-semantic_blue_100`}
                                  >
                                    {
                                      positionDataList.filter(
                                        (position) =>
                                          position.department === department._id && position.isTrash.isInTrash === false
                                      ).length
                                    }{' '}
                                    posisi
                                  </div>
                                </>
                              ) : (
                                <Link
                                  href={`/jobs/add-new-position?departmentName=${encodeURIComponent(
                                    department.name
                                  )}&departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                                  className={`flex w-[198.4px] h-[31px] py-[6px] justify-center rounded-[68px] font-bold items-center gap-[10px] border border-dark_neutral_400 text-dark_neutral_400`}
                                >
                                  <GrAdd />
                                  Tambah Posisi
                                </Link>
                              )}
                              <Disclosure.Button className={` text-[30px] `}>
                                <IoMdArrowDropdown className={`${open ? 'rotate-180 transform' : ''}`} />
                              </Disclosure.Button>
                            </div>
                          </div>
                          <Transition
                            enter="transition ease-out duration-100 transform"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-75 transform"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Disclosure.Panel
                              className={`w-[1148px] flex flex-col gap-[18px] justify-center pt-[32px] pb-[29px] z-0 bg-light_neutral_200 rounded-b-lg rounded-l-md ${
                                open ? 'rounded-t-none' : ''
                              }`}
                            >
                              {positionDataList
                                .filter(
                                  (position) =>
                                    position.department === department._id && position.isTrash.isInTrash !== true
                                )
                                .map((position: PositionData) => (
                                  <div key={position._id} className={`flex justify-center gap-4`}>
                                    <button
                                      className={` text-2xl text-semantic_red_500`}
                                      onClick={() => showModal(position._id, position.name, position.department)}
                                    >
                                      <BsFillTrashFill />
                                    </button>
                                    <div
                                      className={`flex items-center justify-between py-3 px-3 rounded-md text-dark_neutral_300 bg-light_neutral_400 w-[1037px] h-[53px]`}
                                    >
                                      <div className={`font-semibold`}>{position.name}</div>
                                      <div className={`flex items-center gap-[18px]`}>
                                        <p>
                                          <span className={`font-semibold`}>{position.qualifiedCandidates}</span>{' '}
                                          Kandidat Terkualifikasi
                                        </p>
                                        <div className={` text-mid_neutral_400  font-semibold`}>|</div>

                                        <Link
                                          href={`/jobs/edit-position?positionId=${encodeURIComponent(
                                            position._id
                                          )}&selectedDepartment=${encodeURIComponent(
                                            department.name
                                          )}&selectedEducation=${encodeURIComponent(
                                            position.education
                                          )}&departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                                          className={`flex justify-center items-center w-[101px] h-[29px] rounded-[68px]  border border-primary_blue text-primary_blue`}
                                        >
                                          Edit Posisi
                                        </Link>
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
        </>
      )}
      {isModalOpen && (
        <Modal
          type={`${isCheckedDelete ? 'delete-department' : 'delete-position'}`}
          isOpen={isModalOpen}
          onOk={() => {
            if (isCheckedDelete) {
              handleCheckedDelete();
            } else {
              handleDeletePosition(deletePositionId);
            }
          }}
          onClose={closeModal}
          headline={`${
            isCheckedDelete
              ? 'Apa anda yakin?'
              : `Hapus posisi "${deletePosition}" pada departemen ${
                  departmentList.find((department) => department._id === deleteDepartment)?.name
                } ?`
          }`}
          content={`${
            isCheckedDelete
              ? 'Menghapus departemen ini berarti menghapus seluruh posisi di dalamnya '
              : 'Anda masih dapat mengakses posisi ini di sampah dan akan dihapus secara permanen setelah 30 hari'
          }`}
        />
      )}
    </Layout>
  );
}
