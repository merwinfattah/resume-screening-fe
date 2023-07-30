import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { educationOptions } from '@/components/SelectOptions';
import 'react-quill/dist/quill.snow.css';
import PositionDataService from '@/pages/api/services/position.service';
import DepartmentDataService from '@/pages/api/services/department.service';
import { useSelector } from 'react-redux';
import Department from '@/interfaces/Department';
import Layout from '@/components/Layout';
import Link from 'next/link';
import SelectItems from '@/components/SelectItems';
import { BiArrowBack } from 'react-icons/bi';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

// Dynamic Components
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AddNewPosition() {
  const companyId = useSelector((state: any) => state.login.companyId);
  const token = useSelector((state: any) => state.auth.token);
  const router = useRouter();
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDescription, setShowDescription] = useState('');
  const [showQualification, setShowQualification] = useState('');
  const { departmentName, departmentOptions } = router.query;
  const departmentNameQuery = Array.isArray(departmentName) ? '' : departmentName ?? '';
  const initialDepartmentOptions = departmentOptions ? JSON.parse(departmentOptions as string) : [];
  const [positionData, setPositionData] = useState({
    departmentId: '',
    name: '',
    education: '',
    location: '',
    description: '',
    qualification: '',
    minWorkExp: 0,
  });

  useEffect(() => {
    if (!token) {
      window.location.href = '/auth/login';
    }
  }, [token]);

  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        const response = await DepartmentDataService.getAll(token.token);
        setDepartmentList(response.data);
        setPositionData((prevState) => ({
          ...prevState,
          departmentId:
            response.data.find((department: Department) => department.name === departmentNameQuery)?._id ?? '',
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartmentList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, departmentNameQuery, token]);

  const handlePositionInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setPositionData((prevState) => ({
      ...prevState,
      name: event.target.value,
    }));
  };

  const handleLocationInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setPositionData((prevState) => ({
      ...prevState,
      location: event.target.value,
    }));
  };

  const handleDepartmentInputChange = (selectedOption: any) => {
    console.log('ini department yang dipilih', selectedOption.value);
    if (selectedOption) {
      setPositionData((prevState) => ({
        ...prevState,
        departmentId: departmentList.find((department) => department.name === selectedOption.value)?._id ?? '',
      }));
    }
  };

  const handleEducationInputChange = (selectedOption: any) => {
    if (selectedOption) {
      setPositionData((prevState) => ({
        ...prevState,
        education: selectedOption.value,
      }));
    }
  };

  const handleExperienceInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setPositionData((prevState) => ({
      ...prevState,
      minWorkExp: parseInt(event.target.value),
    }));
  };

  const handleDescriptionInputChange = async (value: string) => {
    setShowDescription(value);
    setPositionData((prevState) => ({
      ...prevState,
      description: value.replace(/<\/?p>/g, ''),
    }));
  };

  const handleQualificationInputChange = async (value: string) => {
    setShowQualification(value);
    setPositionData((prevState) => ({
      ...prevState,
      qualification: value.replace(/<\/?p>/g, ''),
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(positionData);
    try {
      const response = await PositionDataService.create(positionData, token.token);
      console.log(response.data);
      setPositionData({
        departmentId: departmentList.find((department) => department.name === departmentNameQuery)?._id ?? '',
        name: '',
        education: '',
        location: '',
        description: '',
        qualification: '',
        minWorkExp: 0,
      });
      router.push('/talent-pool');
    } catch (error) {
      console.log(error);
    }
  };

  const addExperince = async () => {
    if (positionData.minWorkExp >= 0) {
      setPositionData((prevState) => ({
        ...prevState,
        minWorkExp: prevState.minWorkExp + 1,
      }));
    } else {
      setPositionData((prevState) => ({
        ...prevState,
        minWorkExp: 0,
      }));
    }
  };

  const minusExperince = async () => {
    if (positionData.minWorkExp > 0) {
      setPositionData((prevState) => ({
        ...prevState,
        minWorkExp: prevState.minWorkExp - 1,
      }));
    } else {
      setPositionData((prevState) => ({
        ...prevState,
        minWorkExp: 0,
      }));
    }
  };

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file, file.name);

      try {
        const response = await fetch(`http://ec2-34-238-50-38.compute-1.amazonaws.com:8000/jobdesc_reader`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { job_description, qualification } = await response.json();
          // Process the response data as needed
          const formattedJobDescription = job_description.replace(/\n/g, '<br/>');
          const formattedQualification = qualification.replace(/\n/g, '<br/>');
          setShowDescription(formattedJobDescription);
          setShowQualification(formattedQualification);
          console.log(qualification);
        } else {
          console.error('Failed to upload job description file');
        }
      } catch (error) {
        console.error('An error occurred during the file upload:', error);
      } finally {
        setLoading(false); // Set loading back to false after the upload is complete
      }
    }
  };

  return (
    <Layout>
      <section className={`flex justify-center pt-[19px]`}>
        <div
          className={` items-center flex  justify-between w-[1646px] h-[75px] py-[14px] px-4 rounded-md bg-light_neutral_200 drop-shadow z-10`}
        >
          <div>
            <div className={`flex gap-[18px] items-center`}>
              <Link href="/jobs" className={` text-[32px]`}>
                <BiArrowBack />
              </Link>
              <p>BUAT POSISI BARU</p>
            </div>
          </div>
          <div className={`flex gap-[18px] text-dark_neutral_200`}>
            <button
              className={`rounded bg-primary_blue text-primary_white py-[14px] px-[10px] border  hover:bg-primary_white hover:text-primary_blue hover:border-primary_blue`}
              form="job-detail"
              type="submit"
            >
              Simpan dan Lanjutkan
            </button>
          </div>
        </div>
      </section>
      <section className={`flex flex-row mt-[17px] gap-[18px] justify-center`}>
        <div className={` w-[339px] h-[378px] bg-light_neutral_200 py-6 px-[18px] z-10`}>
          <div className={`p-[18px] bg-semantic_blue_50 rounded`}>
            <h2 className={`font-semibold`}>Detail Posisi</h2>
            <p className={`mt-[13px]`}>
              Isi bagian ini dengan informasi posisi termasuk departemen, posisi, pendidikan, dan lokasi pekerjaan
            </p>
          </div>
          <hr className={`  border border-dark_neutral_300 my-[25px]`} />
          <div className={`p-[18px]`}>
            <h2 className={`font-semibold`}>Deskripsi Posisi</h2>
            <p className={`mt-[13px] w-[261.1px] h-[48px]`}>
              Isi bagian ini dengan requirement pekerjaan yang sesuai dengan detail posisi Anda
            </p>
          </div>
        </div>
        <div className={`w-[1289px]  rounded-md  bg-light_neutral_200 `}>
          <div className={`pb-[40px]`}>
            <div className={`bg-light_neutral_300 border border-b-mid_neutral_600 py-[21px] pl-6`}>
              <h2 className={`text-2xl font-semibold`}>Detail Pekerjaan</h2>
            </div>
            <div className={`px-[40px] pt-8`}>
              <form className={`flex flex-col gap-6`} id="job-detail" onSubmit={handleFormSubmit}>
                <div
                  className={` h-auto flex justify-between py-[10px] px-[12px] rounded text-semantic_purple_600  bg-semantic_purple_100 border border-semantic_purple_600`}
                >
                  <p>Catatan: Ini akan terlihat sebagai Posisi Pekerjaan - Departemen pada Talent Pool</p>
                </div>
                <div className={`flex gap-[49px]`}>
                  <div className={` w-1/2 h-[113px]`}>
                    <label htmlFor="department" className={`text-xl font-medium text-primary_dark`}>
                      <span className={`text-secondary_red`}>*</span>Departemen
                    </label>
                    <div className={`flex justify-between items-center mt-[18px] mb-2 `}>
                      <SelectItems
                        options={initialDepartmentOptions}
                        id="department"
                        inputName="department"
                        placeholder="Select Department, ex : Human Resource"
                        width="580px"
                        handleChange={handleDepartmentInputChange}
                        value={departmentNameQuery}
                      />
                    </div>
                    <p className={`text-dark_neutral_300`}>80 karakter tersisa.</p>
                  </div>
                  <div className={` w-1/2 h-[113px]`}>
                    <label htmlFor="job-position" className={`text-xl font-medium text-primary_dark`}>
                      Posisi Pekerjaan
                    </label>
                    <div
                      className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-[580px] h-[44px] border border-dark_neutral_200`}
                    >
                      <input
                        id="job-position"
                        name="job-position"
                        placeholder="Example : Associate Manager"
                        className={`bg-transparent w-full outline-none `}
                        onChange={handlePositionInputChange}
                      />
                    </div>
                    <p className={`text-dark_neutral_300`}>80 karakter tersisa.</p>
                  </div>
                </div>
                <div
                  className={` h-auto flex justify-between py-[10px] px-[12px] rounded text-semantic_purple_600  bg-semantic_purple_100 border border-semantic_purple_600`}
                >
                  <p className={`w-[749px]`}>
                    Edukasi dan lokasi pekerjaan bersifat opsional dan Anda bisa memilih untuk tidak mengisinya. Jika
                    Anda mengisinya, sistem akan memilah kandidat berdasarkan pendidikan dan / atau lokasi pekerjaan
                    yang dibutuhkan
                  </p>
                </div>
                <div className={`flex gap-[49px]`}>
                  <div className={` w-1/2 h-[113px]`}>
                    <label htmlFor="education" className={`text-xl font-medium text-primary_dark`}>
                      Edukasi
                    </label>
                    <div className={`flex justify-between items-center mt-[18px] mb-2 `}>
                      <SelectItems
                        options={educationOptions}
                        id="education"
                        inputName="education"
                        placeholder="Pilih. . ."
                        width="580px"
                        handleChange={handleEducationInputChange}
                      />
                    </div>
                    <p className={`text-dark_neutral_300`}>Pendidikan minimal untuk posisi ini</p>
                  </div>
                  <div className={` w-1/2 h-[113px]`}>
                    <label htmlFor="job-position" className={`text-xl font-medium text-primary_dark`}>
                      Lokasi Pekerjaan
                    </label>
                    <div
                      className={`flex justify-between items-center mt-[18px] mb-2 py-3 px-4 rounded-md w-[580px] h-[44px] border border-dark_neutral_200`}
                    >
                      <input
                        id="location"
                        name="location"
                        placeholder="Example : Jakarta, Bogor, atau Bandung"
                        className={`bg-transparent w-full outline-none`}
                        onChange={handleLocationInputChange}
                      />
                    </div>
                    <p className={`text-dark_neutral_300`}>Sertakan lokasi pekerjaan</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="minimum-experience" className={`text-xl font-medium text-primary_dark`}>
                    Minimal Pengalaman Kerja
                  </label>
                  <div className={`flex items-center gap-[12px] mt-[18px]`}>
                    <div
                      className={`flex  w-[90px] h-[52px] items-center px-[16px]  border border-dark_neutral_200 rounded-[6px] `}
                    >
                      <input
                        type="text"
                        value={positionData.minWorkExp}
                        onChange={handleExperienceInputChange}
                        placeholder="isi.."
                        className={`w-[44px] bg-transparent  outline-none `}
                      />
                      <div>
                        <div
                          onClick={addExperince}
                          className={`   hover: cursor-pointer text-dark_neutral_400 text-lg `}
                        >
                          <MdArrowDropUp />
                        </div>
                        <div
                          onClick={minusExperince}
                          className={` hover: cursor-pointer text-dark_neutral_400 text-lg `}
                        >
                          <MdArrowDropDown />
                        </div>
                      </div>
                    </div>
                    <p className={` text-dark_neutral_500`}>Tahun</p>
                  </div>
                </div>
              </form>
            </div>
            <div className={`bg-light_neutral_300 border border-b-mid_neutral_600 py-[21px] pl-6 mt-8`}>
              <h2 className={`text-2xl font-semibold`}>Requirement Posisi</h2>
            </div>
            <div className={`flex flex-col gap-6 px-10 pt-[32px]`}>
              <div
                className={` h-auto flex justify-between py-[10px] px-[12px] rounded text-semantic_purple_600  bg-semantic_purple_100 border border-semantic_purple_600`}
              >
                <p>
                  Sistem akan menyaring kandidat Anda berdasarkan tingkat kesesuaian CV kandidat dengan requirement
                  pekerjaan ini.
                </p>
              </div>
              <div className={`flex flex-col gap-[18px]`}>
                <div>
                  <p>
                    Anda dapat mengunggah file requirement posisi untuk mengekstrak deskripsi pekerjaan dan kualifikasi
                    pekerjaan secara otomatis
                  </p>
                  <div className={`hover:cursor-pointer relative overflow-hidden inline-block `}>
                    {loading ? (
                      <div className="flex items-center justify-center h-12">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary_blue"></div>
                      </div>
                    ) : (
                      <>
                        <button
                          className={` mt-[8px] rounded bg-primary_blue text-primary_white py-[14px] px-[10px] border  hover:bg-primary_white hover:text-primary_blue hover:border-primary_blue`}
                        >
                          <label htmlFor="job-desc-upload" className="cursor-pointer">
                            <p>Unggah File Job Desc</p>
                          </label>
                          <input
                            type="file"
                            id="job-desc-upload"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <label htmlFor="job-description" className={`text-xl font-medium`}>
                  <span className={`text-secondary_red`}>*</span>Deskripsi Pekerjaan
                </label>
                <div className={` h-[400px] w-[1209px] pb-[40px] `}>
                  <ReactQuill
                    value={showDescription}
                    placeholder="Unggah file deskripsi pekerjaan untuk mengekstrak deskripsi pekerjaan secara otomatis atau tuliskan deskripsi pekerjaan di sini; sertakan area tanggung jawab utama dan apa yang mungkin dilakukan kandidat sehari-hari"
                    onChange={handleDescriptionInputChange}
                    className={`h-full rounded`}
                  />
                </div>
                <label htmlFor="job-description" className={`text-xl font-medium`}>
                  <span className={`text-secondary_red`}>*</span>Kualifikasi Pekerjaan
                </label>
                <div className={` h-[400px] w-[1209px] pb-[40px] `}>
                  <ReactQuill
                    value={showQualification}
                    placeholder="Tuliskan seluruh kualifikasi pekerjaan di sini;"
                    onChange={handleQualificationInputChange}
                    className={`h-full rounded`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
