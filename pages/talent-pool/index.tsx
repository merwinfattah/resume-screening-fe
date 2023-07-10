import dynamic from 'next/dynamic';
import { Modal } from '@/components/Modal';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import PositionData from '@/interfaces/PositionData';
import Candidate from '@/interfaces/Candidate';
import Department from '@/interfaces/Department';
import PositionDataService from '@/pages/api/services/position.service';
import CandidateDataService from '@/pages/api/services/candidate.service';
import DepartmentDataService from '@/pages/api/services/department.service';

// Lazy-loaded components
const Layout = dynamic(() => import('@/components/Layout'));
const Pagination = dynamic(() => import('@/components/Pagination'));
const Link = dynamic(() => import('next/link'));
const Viewer = dynamic(() => import('@react-pdf-viewer/core').then((module) => module.Viewer));
const AiOutlineSearch = dynamic(() => import('react-icons/ai').then((icons) => ({ default: icons.AiOutlineSearch })));
const GrFormAdd = dynamic(() => import('react-icons/gr').then((icons) => ({ default: icons.GrFormAdd })));
const MdOutlineDriveFolderUpload = dynamic(() =>
  import('react-icons/md').then((icons) => ({ default: icons.MdOutlineDriveFolderUpload }))
);
const TfiUpload = dynamic(() => import('react-icons/tfi').then((icons) => ({ default: icons.TfiUpload })));
const BiArrowBack = dynamic(() => import('react-icons/bi').then((icons) => ({ default: icons.BiArrowBack })));
const RxDragHandleDots2 = dynamic(() =>
  import('react-icons/rx').then((icons) => ({ default: icons.RxDragHandleDots2 }))
);
const MdPersonAddAlt1 = dynamic(() => import('react-icons/md').then((icons) => ({ default: icons.MdPersonAddAlt1 })));
const HiOutlineMail = dynamic(() => import('react-icons/hi').then((icons) => ({ default: icons.HiOutlineMail })));
const IoStarOutline = dynamic(() => import('react-icons/io5').then((icons) => ({ default: icons.IoStarOutline })));
const IoStarSharp = dynamic(() => import('react-icons/io5').then((icons) => ({ default: icons.IoStarSharp })));
const BsFillTrashFill = dynamic(() => import('react-icons/bs').then((icons) => ({ default: icons.BsFillTrashFill })));
const RiArrowUpDownLine = dynamic(() =>
  import('react-icons/ri').then((icons) => ({ default: icons.RiArrowUpDownLine }))
);
const Divider = dynamic(() => import('antd').then((antd) => ({ default: antd.Divider })));
const Space = dynamic(() => import('antd').then((antd) => ({ default: antd.Space })));
const Tag = dynamic(() => import('antd').then((antd) => ({ default: antd.Tag })));

// Lazy-loaded styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function TalentPool() {
  const companyId = useSelector((state: any) => state.login.companyId);
  const token = useSelector((state: any) => state.auth.token);
  const [positionDataList, setPositionDataList] = useState<PositionData[]>([]);
  const [candidateDataList, setCandidateDataList] = useState<Candidate[]>([]);
  const [departmenDataList, setDepartmentDataList] = useState<Department[]>([]);
  const [departmentParam, setDepartmentParam] = useState<string>('');
  const [educationParam, setEducationParam] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [idCandidateChecked, setIdCandidateChecked] = useState<string[]>([]);
  const [showButtonRescore, setShowButtonRescore] = useState<boolean>(false);
  const [visibleTags, setVisibleTags] = useState<number>(10);
  const [scoringLoading, setScoringLoading] = useState<boolean>(false);
  const [candidateDisplayLoading, setCandidateDisplayLoading] = useState<boolean>(false);
  const [positionDisplayLoading, setPositionDisplayLoading] = useState<boolean>(false);
  const [searchCandidateTerm, setSearchCandidateTerm] = useState<string>('');
  const [searchPositionTerm, setSearchPositionTerm] = useState<string>('');
  const [isSearchPosition, setIsSearchPosition] = useState<boolean>(false);
  const [sortedOrder, setSortedOrder] = useState<string>('asc');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      window.location.href = '/auth/login';
    }
  }, [token]);

  const handleSearchCandidateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPositionTerm(event.target.value);
  };

  const handleSearchCandidateIconClick = () => {
    setIsSearchPosition(true);
  };

  const handleSearchCandidateInputBlur = () => {
    setIsSearchPosition(false);
    setSearchPositionTerm('');
  };

  const sortList = (order: string) => {
    let sortedList: PositionData[] = [];

    if (order === 'asc') {
      sortedList = positionDataList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'desc') {
      sortedList = positionDataList.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sortedList;
  };

  const handleSortClick = () => {
    const newOrder = sortedOrder === 'asc' ? 'desc' : 'asc';
    const sortedList = sortList(newOrder);

    setSortedOrder(newOrder);
    // You may update the activeIndex here if needed
    setActiveIndex(sortedList[0]?._id);
    setActiveCandidateIndex(candidateDataList.filter((candidate) => candidate.position === sortedList[0]?._id)[0]?._id);
  };

  const handleSearchCandidate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCandidateTerm(event.target.value);
  };

  const handleHoverFilteredTab = () => {
    setShowButtonRescore(true);
  };

  const handleLeaveFilteredTab = () => {
    setShowButtonRescore(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setCandidateDisplayLoading(true);
      setPositionDisplayLoading(true);
      try {
        const departmentDataListResponse = await DepartmentDataService.getAll(token.token);
        const positionDataListResponse = await PositionDataService.getAll(token.token);
        const candidateDataListResponse = await CandidateDataService.getAll(token.token);
        setDepartmentDataList(departmentDataListResponse.data);
        setPositionDataList(positionDataListResponse.data);
        setCandidateDataList(candidateDataListResponse.data['candidates']);
        setCandidateDisplayLoading(false);
        setPositionDisplayLoading(false);
      } catch (error) {
        console.log(error);
        setCandidateDisplayLoading(false);
        setPositionDisplayLoading(false);
      }
    };
    fetchData();
  }, [companyId, token]);

  const filteredPositionDataList = positionDataList.filter(
    (positionData: PositionData) => !positionData.isTrash.isInTrash && !positionData.isResolved
  );
  const departmentOptions = departmenDataList.map((department: Department) => {
    return {
      value: department.name,
      label: department.name,
    };
  });
  const departmentOptionsJson = JSON.stringify(departmentOptions);
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [activeCandidateIndex, setActiveCandidateIndex] = useState<string | null>(null);
  const [activeFilteredListCandidate, setActiveFilteredListCandidate] = useState<string>('unfiltered');
  const newPlugin = defaultLayoutPlugin();
  const activeCandidate = candidateDataList.find((candidate: Candidate) => candidate._id === activeCandidateIndex);
  const filteredCandidates = candidateDataList.filter(
    (candidate: Candidate) => candidate.position === activeIndex && candidate.score !== null && candidate.score > 0
  );
  const sortedScores = filteredCandidates
    .map((candidate: Candidate) => candidate.score)
    .sort((a, b) => (b ?? 0) - (a ?? 0));
  const activeCandidateScore = activeCandidate?.score ?? null;

  const rank = activeCandidateScore !== null ? sortedScores.indexOf(activeCandidateScore) + 1 : null;

  const totalCount = filteredCandidates.length;

  const rankText = rank !== null ? `${rank} / ${totalCount}` : '';

  const skills = candidateDataList.find(
    (candidate: Candidate) => candidate._id === activeCandidateIndex && (candidate.score ?? 0 > 0)
  )?.skills;
  const handleExpandTags = () => {
    if (skills && skills.length > 10) {
      if (visibleTags === skills.length) {
        setVisibleTags(10); // Reset visibleTags to the initial value of 10 when collapsing
      } else {
        const remainingTags = skills.length - visibleTags; // Calculate the remaining tags when expanding
        const additionalTags = Math.min(remainingTags, 10); // Calculate the number of additional tags to show (up to 10)
        setVisibleTags(visibleTags + additionalTags); // Update the visibleTags state by adding the additionalTags
      }
    }
  };

  const visibleSkills = skills ? skills.slice(0, visibleTags) : [];
  const remainingTags = skills ? skills.length - visibleTags : 0;
  useEffect(() => {
    if (filteredPositionDataList.length > 0 && activeIndex === null) {
      const firstItemId = filteredPositionDataList[0]._id;
      setActiveIndex(firstItemId);
      setDepartmentParam(
        departmenDataList.find(
          (departmentData: Department) =>
            departmentData._id ===
            filteredPositionDataList.find((positionData: PositionData) => positionData._id === firstItemId)?.department
        )?.name || ''
      );
      setEducationParam(
        filteredPositionDataList.find((positionData: PositionData) => positionData._id === firstItemId)?.education || ''
      );
    }
  }, [filteredPositionDataList, activeIndex, departmenDataList]);

  useEffect(() => {
    if (
      candidateDataList.filter((candidate: Candidate) => candidate.position === activeIndex).length > 0 &&
      activeCandidateIndex === null
    ) {
      const firstItemId =
        candidateDataList.find((candidate: Candidate) => candidate.position === activeIndex)?._id || '';
      setActiveCandidateIndex(firstItemId);
    }
  }, [candidateDataList, activeCandidateIndex, activeIndex]);

  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const fileList = acceptedFiles.filter((file) => {
      const fileExtension = file.name.split('.').pop();
      return fileExtension === 'pdf' || fileExtension === 'docx';
    });

    if (fileList.length > 0) {
      // Handle valid files
      // let candidateData = await getItem('candidateDataList');
      // let newPositionDataList = await getItem('positionDataList');
      const newCandidateUploadList = new FormData();

      fileList.forEach((file: File, index: number) => {
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
        const data = {
          id: activeIndex,
          qualifiedCV:
            positionDataList.find((positionData: PositionData) => positionData._id === activeIndex)
              ?.qualifiedCandidates || 0,
        };
        await CandidateDataService.upload(newCandidateUploadList, token.token);
        await PositionDataService.editNumber(data, token.token);
        setIsUploading(false);
        window.location.reload();
      } catch (error) {
        console.log(error);
        setIsUploading(false);
      }
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
    setIdCandidateChecked([]);
    setActiveFilteredListCandidate('unfiltered');
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
    const nextActiveIndex = filteredPositionDataList.filter((positionData) => positionData._id !== activeIndex)[0]?._id;
    const nextActiveCandidateIndex = candidateDataList.filter(
      (candidateData) => candidateData.position === nextActiveIndex
    )[0]?._id;
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
        setActiveIndex(nextActiveIndex || '');
        setActiveCandidateIndex(nextActiveCandidateIndex);
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

  const handleQualified = async (id: string) => {
    const newCandidateDataList = candidateDataList.map((candidateData: Candidate) => {
      if (candidateData._id === id) {
        candidateData.isQualified = !candidateData.isQualified;
      }
      return candidateData;
    });
    setCandidateDataList(newCandidateDataList);
    const newPositionDataList = positionDataList.map((positionData: PositionData) => {
      if (positionData._id === activeIndex) {
        if (newCandidateDataList.find((candidateData) => candidateData._id === id)?.isQualified) {
          positionData.qualifiedCandidates = positionData.qualifiedCandidates + 1;
        } else {
          positionData.qualifiedCandidates = positionData.qualifiedCandidates - 1;
        }
      }
      return positionData;
    });
    setPositionDataList(newPositionDataList);
    const candidateData = {
      ids: [id],
    };
    const newPositionData = {
      id: activeIndex,
      uploadedCV: positionDataList.find((position: PositionData) => position._id === activeIndex)?.uploadedCV,
      filteredCV: positionDataList.find((position: PositionData) => position._id === activeIndex)?.filteredCV,
      qualifiedCandidates: positionDataList.find((position) => position._id === activeIndex)?.qualifiedCandidates,
    };
    try {
      const responseCandidate = await CandidateDataService.qualify(candidateData, token.token);
      const responsePosition = await PositionDataService.editNumber(newPositionData, token.token);
      console.log(responseCandidate);
      console.log(responsePosition);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMultipleQualified = async () => {
    const newCandidateDataList = candidateDataList.map((candidateData: Candidate) => {
      if (idCandidateChecked.includes(candidateData._id)) {
        candidateData.isQualified = !candidateData.isQualified;
      }
      return candidateData;
    });
    setCandidateDataList(newCandidateDataList);
    const newPositionDataList = positionDataList.map((positionData: PositionData) => {
      if (positionData._id === activeIndex) {
        if (
          idCandidateChecked.every(
            (id) => newCandidateDataList.find((candidateData) => candidateData._id === id)?.isQualified
          )
        ) {
          positionData.qualifiedCandidates = positionData.qualifiedCandidates + idCandidateChecked.length;
        } else {
          positionData.qualifiedCandidates = positionData.qualifiedCandidates - idCandidateChecked.length;
        }
      }
      return positionData;
    });
    setPositionDataList(newPositionDataList);
    const candidateData = {
      ids: [...idCandidateChecked],
    };
    const newPositionData = {
      id: activeIndex,
      uploadedCV: positionDataList.find((position: PositionData) => position._id === activeIndex)?.uploadedCV,
      filteredCV: positionDataList.find((position: PositionData) => position._id === activeIndex)?.filteredCV,
      qualifiedCandidates: positionDataList.find((position) => position._id === activeIndex)?.qualifiedCandidates,
    };
    try {
      await CandidateDataService.qualify(candidateData, token.token);
      await PositionDataService.editNumber(newPositionData, token.token);
      setIdCandidateChecked([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckedCandidate = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      setIdCandidateChecked((prev) => [...prev, id]);
    } else {
      setIdCandidateChecked((prevIdCandidateChecked) =>
        prevIdCandidateChecked.filter((idCandidate: string) => idCandidate !== id)
      );

      // Check if all checkboxes are unchecked, then uncheck the radio button
    }
  };
  const handleCheckAll = () => {
    if (activeFilteredListCandidate === 'filtered') {
      if (
        idCandidateChecked.length !==
        candidateDataList.filter((candidate) => candidate.position === activeIndex && (candidate?.score ?? 0 > 0))
          .length
      ) {
        const candidatesToSelect = candidateDataList
          .filter((candidate) => candidate.position === activeIndex && (candidate?.score ?? 0 > 0))
          .map((candidateData) => candidateData._id);
        setIdCandidateChecked(candidatesToSelect);
      } else {
        setIdCandidateChecked([]);
      }
    } else {
      if (
        idCandidateChecked.length !== candidateDataList.filter((candidate) => candidate.position === activeIndex).length
      ) {
        const candidatesToSelect = candidateDataList
          .filter((candidate) => candidate.position === activeIndex)
          .map((candidateData) => candidateData._id);
        setIdCandidateChecked(candidatesToSelect);
      } else {
        setIdCandidateChecked([]);
      }
    }
  };

  const handleScoreCandidate = async () => {
    setScoringLoading(true);
    try {
      const url = `http://ec2-44-202-51-145.compute-1.amazonaws.com:8000/resume_scoring?positionId=${activeIndex}&token_value=${token.token}`;

      const scoringResponse = await fetch(url, {
        method: 'POST',
      });

      if (scoringResponse.ok) {
        const scoringData = await scoringResponse.json();
        console.log(scoringData);
      }
      setActiveFilteredListCandidate('filtered');
      setScoringLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setScoringLoading(false);
    }
  };

  const handleFileUpload = async (event: any) => {
    setIsUploading(true);
    const files = event.target.files;

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
        const data = {
          id: activeIndex,
          qualifiedCV:
            positionDataList.find((positionData: PositionData) => positionData._id === activeIndex)
              ?.qualifiedCandidates || 0,
        };
        await CandidateDataService.upload(newCandidateUploadList, token.token);
        await PositionDataService.editNumber(data, token.token);
        setIsUploading(false);
        window.location.reload();
      } catch (error) {
        console.log(error);
        setIsUploading(false);
      }
    } else {
      // Handle no valid files
      console.log('No valid files found.');
    }
  };

  const handleSwitchToFilteredTab = async () => {
    setActiveFilteredListCandidate('filtered');
    setActiveCandidateIndex(
      candidateDataList.filter((candidate) => candidate.position === activeIndex && (candidate.score ?? 0 > 0))[0]._id
    );
  };

  const handleSwitchToUnfilteredTab = async () => {
    setActiveFilteredListCandidate('unfiltered');
    setActiveCandidateIndex(candidateDataList.filter((candidate) => candidate.position === activeIndex)[0]._id);
  };

  const handleUncheckedAllCandidates = async () => {
    setIdCandidateChecked([]);
  };

  const handleDeleteCandidates = async () => {
    let filteredSum = 0;
    let qualifiedSum = 0;
    for (let candidate of candidateDataList) {
      if (idCandidateChecked.includes(candidate._id) && (candidate.score ?? 0 > 0)) {
        filteredSum += 1;
      }
    }
    for (let candidate of candidateDataList) {
      if (idCandidateChecked.includes(candidate._id) && candidate.isQualified) {
        qualifiedSum += 1;
      }
    }

    if (
      idCandidateChecked.length === candidateDataList.filter((candidate) => candidate.position === activeIndex).length
    ) {
      const positionNextIndex = positionDataList.filter((position) => position._id !== activeIndex)[0]._id;
      setActiveIndex(positionNextIndex);
      setActiveCandidateIndex(candidateDataList.filter((candidate) => candidate.position === positionNextIndex)[0]._id);
    } else {
      const candidateNextIndex = candidateDataList.filter(
        (candidate) => candidate.position === activeIndex && !idCandidateChecked.includes(candidate._id)
      )[0]._id;
      setActiveCandidateIndex(candidateNextIndex);
    }
    setCandidateDataList((prevCandidateDataList) =>
      prevCandidateDataList.filter((candidate) => !idCandidateChecked.includes(candidate._id))
    );
    setPositionDataList((prevPositionDataList) =>
      prevPositionDataList.map((position) => {
        if (position._id === activeIndex && filteredSum > 0 && qualifiedSum > 0) {
          return {
            ...position,
            uploadedCV: position.uploadedCV - idCandidateChecked.length,
            filteredCV: position.filteredCV - filteredSum,
            qualifiedCandidates: position.qualifiedCandidates - qualifiedSum,
          };
        } else if (position._id === activeIndex && filteredSum > 0 && qualifiedSum === 0) {
          return {
            ...position,
            uploadedCV: position.uploadedCV - idCandidateChecked.length,
            filteredCV: position.filteredCV - filteredSum,
          };
        } else if (position._id === activeIndex && filteredSum === 0 && qualifiedSum > 0) {
          return {
            ...position,
            uploadedCV: position.uploadedCV - idCandidateChecked.length,
            qualifiedCandidates: position.qualifiedCandidates - qualifiedSum,
          };
        } else {
          return {
            ...position,
            uploadedCV: position.uploadedCV - idCandidateChecked.length,
          };
        }
      })
    );

    const data = {
      ids: [...idCandidateChecked],
    };
    try {
      const responseCandidate = await CandidateDataService.delete(data, token.token);
      console.log(responseCandidate.data);
      setIdCandidateChecked([]);
    } catch (error) {
      console.log(error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default number of items per page

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to the first page when the number of items per page changes
  };

  // Calculate the index range of items to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedCandidates = candidateDataList
    .filter(
      (candidate: Candidate) =>
        candidate.position === activeIndex && candidate.name.toLowerCase().includes(searchCandidateTerm.toLowerCase())
    )
    .slice(startIndex, endIndex);

  const displayedScoredCandidates = candidateDataList
    .filter(
      (candidate) =>
        candidate.position === activeIndex &&
        (candidate.score ?? 0 > 0) &&
        candidate.name.toLowerCase().includes(searchCandidateTerm.toLowerCase())
    )
    .slice(startIndex, endIndex);

  const totalCandidates =
    activeFilteredListCandidate === 'filtered'
      ? candidateDataList.filter((candidate) => candidate.position === activeIndex && (candidate.score ?? 0 > 0)).length
      : candidateDataList.filter((candidate: Candidate) => candidate.position === activeIndex).length;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSendEmail = async () => {
    const name = candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.name;
    const position = positionDataList.find((position) => position._id === activeIndex)?.name;
    const email = candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.email ?? '';
    const modifiedEmail = email.replace('@', '%40');

    try {
      const url = `http://ec2-44-202-51-145.compute-1.amazonaws.com:8000/mailer?email_recipient=${modifiedEmail}&nama_kandidat=${name}&posisi_dilamar=${position}`;

      const sendEmailResponse = await fetch(url, {
        method: 'POST',
      });

      if (sendEmailResponse.ok) {
        window.alert('Email berhasil dikirim');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMultipleEmail = async () => {
    try {
      for (let idCandidate of idCandidateChecked) {
        const name = candidateDataList.find((candidate) => candidate._id === idCandidate)?.name;
        const position = positionDataList.find((position) => position._id === activeIndex)?.name;
        const email = candidateDataList.find((candidate) => candidate._id === idCandidate)?.email ?? '';
        const modifiedEmail = email.replace('@', '%40');
        const url = `http://ec2-44-202-51-145.compute-1.amazonaws.com:8000/mailer?email_recipient=${modifiedEmail}&nama_kandidat=${name}&posisi_dilamar=${position}`;

        await fetch(url, {
          method: 'POST',
        });
      }
      window.alert('Email berhasil dikirim');
      setIdCandidateChecked([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <article className={`flex`}>
        <section className={`w-[236px]   bg-light_neutral_200  border-r-2 border-semantic_blue_100`}>
          <aside>
            <div className={`flex items-center py-4 pr-4 pl-[33px] justify-between border-b border-mid_neutral_400`}>
              {!isSearchPosition ? (
                <>
                  <div className={`flex items-center gap-[6px]`} onClick={handleSearchCandidateIconClick}>
                    <AiOutlineSearch className={`text-dark_neutral_200`} />
                    <h2 className={`text-primary_dark`}>Daftar Posisi</h2>
                  </div>
                  <button onClick={handleSortClick}>
                    <RiArrowUpDownLine className={`text-dark_neutral_200`} />
                  </button>
                  <Link
                    href={`/jobs/add-new-position?departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                    className={`w-[19px] h-[19px] text-dark_neutral_200`}
                  >
                    <GrFormAdd />
                  </Link>
                </>
              ) : (
                <input
                  type="text"
                  className={`text-primary_dark outline-none bg-transparent`}
                  placeholder="Cari Posisi"
                  value={searchPositionTerm}
                  onChange={handleSearchCandidateInputChange}
                  onBlur={handleSearchCandidateInputBlur}
                  autoFocus
                />
              )}
            </div>
            {positionDisplayLoading ? (
              <div className={`flex justify-center items-center w-full h-[200px]`}>
                <div className={`w-[50px] h-[50px] border-t-2 border-primary_blue rounded-full animate-spin`} />
              </div>
            ) : (
              <ul>
                {sortList(sortedOrder)
                  .filter(
                    (position: PositionData) =>
                      !position.isTrash.isInTrash &&
                      !position.isResolved &&
                      position.name.toLowerCase().includes(searchPositionTerm.toLowerCase())
                  )
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
            )}
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
          {positionDataList.filter((position) => !position.isTrash.isInTrash && !position.isResolved).length > 0 ? (
            <>
              <div className={`flex gap-[18px] w-full `}>
                <div
                  className={` relative z-10 drop-shadow-md  w-1/2 h-[78px] bg-light_neutral_200 rounded-md flex gap-[40px] items-center justify-center`}
                >
                  <Link
                    href={`/jobs/edit-position?positionId=${encodeURIComponent(
                      activeIndex || ''
                    )}&selectedDepartment=${encodeURIComponent(departmentParam)}&selectedEducation=${encodeURIComponent(
                      educationParam
                    )}&departmentOptions=${encodeURIComponent(departmentOptionsJson)}`}
                    className={`flex items-center justify-center text-primary_blue w-[108px] h-[47px] rounded gap-[6px] border border-primary_blue hover:border-2`}
                  >
                    Edit Posisi
                  </Link>
                  <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                  <button
                    onClick={handleSwitchToUnfilteredTab}
                    className={`w-[197px] h-[54px] flex flex-col ${
                      activeFilteredListCandidate === 'unfiltered' ? 'bg-semantic_blue_100' : ''
                    } justify-center items-center rounded-[68px] text-center font-bold text-dark_neutral_400 border hover:border-semantic_blue_100 hover:cursor-pointer`}
                  >
                    {positionDataList.find((position: PositionData) => position._id === activeIndex)?.uploadedCV}
                    <p className={`font-medium`}>Cv yang Terunggah</p>
                  </button>
                  <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                  {positionDataList.find((position) => position._id === activeIndex && position.filteredCV > 0) ? (
                    <button
                      onClick={handleSwitchToFilteredTab}
                      onMouseEnter={handleHoverFilteredTab}
                      onMouseLeave={handleLeaveFilteredTab}
                      className={`w-[188px] h-[54px] rounded-[68px] flex flex-col ${
                        activeFilteredListCandidate === 'filtered' ? 'bg-semantic_blue_100' : ''
                      } justify-center items-center text-center font-bold text-dark_neutral_400 border hover:border-semantic_blue_100 hover:cursor-pointer`}
                    >
                      {positionDataList.find((position) => position._id === activeIndex)?.filteredCV} /{' '}
                      {positionDataList.find((position) => position._id === activeIndex)?.uploadedCV}{' '}
                      <p className={`font-medium`}>CV yang tersaring</p>
                      {showButtonRescore && (
                        <div
                          className={`rounded-[6px] z-20 py-[24px] px-[16px] modal-notification absolute top-[60px] right-0 bg-primary_white border flex flex-col justify-center items-center`}
                        >
                          <h2 className={`text-[18px]`}>Nilai Ulang CV?</h2>
                          <button
                            onClick={handleScoreCandidate}
                            className={`mt-[16px] flex justify-center items-center border hover:border-primary_blue bg-primary_blue hover:bg-primary_white text-primary_white hover:text-primary_blue rounded w-[177px] h-[47px]`}
                          >
                            {scoringLoading ? (
                              <div className={`flex justify-center items-center`}>
                                <div className={`animate-spin rounded-full h-6 w-6 border-b-2 border-primary_blue`} />
                              </div>
                            ) : (
                              <p>Nilai Semua CV</p>
                            )}
                          </button>
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleScoreCandidate}
                      className={` w-[161px] h-[47px] flex justify-center items-center rounded bg-primary_white border border-primary_blue text-primary_blue hover:border-2`}
                    >
                      {scoringLoading ? (
                        <div className={`flex justify-center items-center`}>
                          <div className={`animate-spin rounded-full h-6 w-6 border-b-2 border-primary_blue`} />
                        </div>
                      ) : (
                        <p>Nilai Semua CV</p>
                      )}
                    </button>
                  )}
                </div>
                <div
                  className={`relative z-10 justify drop-shadow-md flex gap-[30px] w-1/2 h-[78px] rounded-lg bg-light_neutral_200 py-3 px-4 items-center`}
                >
                  <div
                    className={`flex flex-col justify-center items-center h-[54px] w-[290px]  rounded-[68px] text-center text-sm font-bold text-dark_neutral_400`}
                  >
                    {positionDataList
                      .filter((position) => position._id === activeIndex)
                      .map((position) => position.qualifiedCandidates)}
                    <p className={`font-medium`}>Kandidat Terkualifikasi</p>
                  </div>
                  <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                  <button
                    className={`flex justify-center  w-[291px] h-[47px] ${
                      isUploading ? 'bg-primary_white text-primary_blue' : 'bg-primary_blue text-primary_white'
                    }  rounded  hover:text-primary_blue hover:bg-primary_white border border-primary_blue items-center `}
                  >
                    {isUploading ? (
                      <div className={`flex justify-center items-center`}>
                        <div className={`animate-spin rounded-full h-6 w-6 border-b-2 border-primary_blue`} />
                      </div>
                    ) : (
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <p>
                          <span className="mr-[6px] text-[19px]">+</span>
                          Tambah Kandidat Baru
                        </p>
                        <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileUpload} />
                      </label>
                    )}
                  </button>
                  <div className={` w-[6px] h-[19px]  text-dark_neutral_100`}>|</div>
                  <button
                    onClick={showModal}
                    className={`flex justify-center items-center w-[224px] h-[47px]  rounded border hover:border-semantic_green_600 bg-semantic_green_600 hover:bg-primary_white text-center text-primary_white hover:text-semantic_green_600`}
                  >
                    Tutup Posisi
                  </button>
                </div>
              </div>
              {candidateDataList.filter((candidate) => candidate.position === activeIndex).length ? (
                <div className={` relative flex gap-[18px]  `}>
                  <div
                    className={`flex flex-col w-[381px] h-fit bg-light_neutral_200 rounded-md bg-scroll overflow-hidden`}
                  >
                    {idCandidateChecked.length > 0 ? (
                      <div
                        className={`p-[18px] flex justify-between  items-center bg-primary_blue text-primary_white `}
                      >
                        <div className={`flex gap-[20px]`}>
                          <button
                            onClick={handleUncheckedAllCandidates}
                            className={`w-[24px] h-[24px] flex items-center justify-center`}
                          >
                            <BiArrowBack className={`w-full h-full`} />
                          </button>
                          <button
                            onClick={handleSendMultipleEmail}
                            className={`w-[24px] h-[24px] flex items-center justify-center`}
                          >
                            <HiOutlineMail className={`w-full h-full`} />
                          </button>
                        </div>
                        <div className={`flex gap-[20px]`}>
                          <button
                            onClick={handleMultipleQualified}
                            className={`w-[24px] h-[24px] flex items-center justify-center`}
                          >
                            <MdPersonAddAlt1 className={`w-full h-full`} />
                          </button>
                          <button
                            onClick={handleDeleteCandidates}
                            className={`w-[24px] h-[24px] flex items-center justify-center`}
                          >
                            <BsFillTrashFill className={`w-full h-full`} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`container mx-auto mt-[18px] flex w-[345px] h-[35px] rounded gap-[10px] py-2 px-[10px] border border-dark_neutral_100 text-dark_neutral_100`}
                      >
                        <AiOutlineSearch />
                        <input
                          placeholder="Cari nama kandidat"
                          className={` w-full italic outline-none bg-transparent`}
                          onChange={handleSearchCandidate}
                          value={searchCandidateTerm}
                        />
                      </div>
                    )}
                    <div className={`py-[18px] px-[18px] `}>
                      {idCandidateChecked.length > 0 ? (
                        <div className={`flex justify-between  items-center`}>
                          <input
                            type="checkbox"
                            className={`w-[15.81px] h-[15.81px] `}
                            checked={
                              activeFilteredListCandidate === 'filtered'
                                ? idCandidateChecked.length ===
                                  candidateDataList.filter(
                                    (candidate) => candidate.position === activeIndex && (candidate?.score ?? 0 > 0)
                                  ).length
                                : idCandidateChecked.length ===
                                  candidateDataList.filter((candidate) => candidate.position === activeIndex).length
                            }
                            onChange={handleCheckAll}
                          />
                          <p className={`font-normal text-base text-dark_neutral_300`}>
                            <span className={`font-bold`}>{idCandidateChecked.length}</span> dipilih
                          </p>
                        </div>
                      ) : (
                        <div className={`flex items-center`}></div>
                      )}
                    </div>
                    <div className={`w-full `}>
                      {candidateDisplayLoading ? (
                        <div className={`flex justify-center items-center w-full h-[200px]`}>
                          <div
                            className={`w-[50px] h-[50px] border-t-2 border-primary_blue rounded-full animate-spin`}
                          ></div>
                        </div>
                      ) : activeFilteredListCandidate === 'filtered' ? (
                        displayedScoredCandidates
                          .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                          .map((candidate: Candidate, index: number) => (
                            <div
                              key={candidate._id}
                              className={`${
                                activeCandidateIndex === candidate._id ? 'bg-semantic_blue_100' : ''
                              } group py-[18px] pl-[27px] pr-[10.78px] flex justify-between items-start hover:border-b-2 border-b border-mid_neutral_100 `}
                              onClick={() => handleCandidateClick(candidate._id)}
                            >
                              <div className={`flex items-start`}>
                                <RxDragHandleDots2 className={`invisible group-hover:visible mt-[4px]`} />
                                <p>{index + 1}</p>
                                <input
                                  type="checkbox"
                                  className={`group-hover:visible ${
                                    idCandidateChecked.length > 0 ? 'visible' : 'invisible'
                                  } ml-[19px] mr-[11.69px] w-[13px] h-[13px] mt-[6px]`}
                                  onChange={(e) => handleCheckedCandidate(e, candidate._id)}
                                  checked={idCandidateChecked.includes(candidate._id)}
                                />
                                <div className={`flex flex-col gap-[7px] ml-[11.69px]`}>
                                  <p className={`text-dark_neutral_300 text-lg font-semibold`}>{candidate.name}</p>
                                  <div className={`flex flex-col gap-[4px]`}>
                                    <p className={`text-semantic_blue_500 font-semibold text-base`}>
                                      Skor: {candidate.score} /100
                                    </p>
                                    <p className={`text-dark_neutral_300 font-normal text-base`}>
                                      {candidate.domicile}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className={`flex flex-col items-center gap-2`}>
                                <button onClick={() => handleQualified(candidate._id)}>
                                  {candidate.isQualified ? (
                                    <IoStarSharp
                                      className={`text-semantic_yellow_600 outline-semantic_orange_600 text-2xl `}
                                    />
                                  ) : (
                                    <IoStarOutline className={`text-mid_neutral_600 text-2xl`} />
                                  )}
                                </button>
                              </div>
                            </div>
                          ))
                      ) : (
                        displayedCandidates.map((candidate: Candidate) => (
                          <div
                            key={candidate._id}
                            className={`${
                              activeCandidateIndex === candidate._id ? 'bg-semantic_blue_100' : ''
                            } group px-[18px] hover:border-b-2 h-[48px] border-b border-mid_neutral_100 flex items-center justify-between gap-[18px]`}
                            onClick={() => handleCandidateClick(candidate._id)}
                          >
                            <div
                              className={`flex items-center gap-2 invisible group-hover:visible group-active:visible`}
                            >
                              <RxDragHandleDots2 />
                              <input
                                type="checkbox"
                                onChange={(e) => handleCheckedCandidate(e, candidate._id)}
                                className={`w-[13px] h-[13px] ${idCandidateChecked.length > 0 ? 'visible' : ''}`}
                                checked={idCandidateChecked.includes(candidate._id)}
                              />
                              <p className={`visible text-dark_neutral_300 text-lg font-semibold`}>{candidate.name}</p>
                            </div>
                            <div className={`flex items-center gap-2`}>
                              <button onClick={() => handleQualified(candidate._id)}>
                                {candidate.isQualified ? (
                                  <IoStarSharp
                                    className={`text-semantic_yellow_600 outline-semantic_orange_600 text-2xl `}
                                  />
                                ) : (
                                  <IoStarOutline className={`text-mid_neutral_600 text-2xl`} />
                                )}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div
                    className={` w-[1249px]  bg-light_neutral_200 border border-mid_neutral_200 rounded-t-md overflow-hidden`}
                  >
                    {candidateDisplayLoading ? (
                      <div className={`flex justify-center items-center w-full h-[200px]`}>
                        <div
                          className={`w-[50px] h-[50px] border-t-2 border-primary_blue rounded-full animate-spin`}
                        ></div>
                      </div>
                    ) : (
                      <div className={`h-fit`}>
                        <div className={`bg-light_neutral_300 h-auto `}>
                          <div
                            className={`h-[76px] flex items-center justify-between bg-light_neutral_200 border-b border-mid_neutral_200 pl-[32px] pr-[14px]`}
                          >
                            <h2 className={` text-[28px] text-primary_blue font-semibold`}>
                              {
                                candidateDataList.find((candidate: Candidate) => candidate._id === activeCandidateIndex)
                                  ?.name
                              }
                            </h2>
                            <div className={`flex gap-[16px]`}>
                              <button
                                onClick={() => handleQualified(activeCandidateIndex || '')}
                                className={`flex  h-[44px] px-[10px] items-center border border-mid_neutral_100 rounded justify-center  gap-[6px]  ${
                                  candidateDataList.find(
                                    (candidate: Candidate) => candidate._id === activeCandidateIndex
                                  )?.isQualified
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
                              <button
                                onClick={handleSendEmail}
                                className={`w-[135px] h-[44px] items-center border border-mid_neutral_100 rounded justify-center flex gap-[6px] bg-primary_white text-primary_blue`}
                              >
                                <HiOutlineMail />
                                <p>Kirim Email</p>
                              </button>
                            </div>
                          </div>
                          <div className={`py-[18px] px-[32px]`}>
                            <div className={`flex justify-between`}>
                              <div className={`flex gap-[24px]`}>
                                <div>
                                  <p className={`text-[18px] text-dark_neutral_400 font-semibold`}>Email</p>
                                  <p className={`text-[18px] text-dark_neutral_400 font-semibold`}>Domisili</p>
                                </div>
                                <div>
                                  <p className={`text-dark_neutral_400 text-lg font-normal`}>
                                    {
                                      candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)
                                        ?.email
                                    }
                                  </p>
                                  <p className={`text-dark_neutral_400 text-lg font-normal`}>
                                    {
                                      candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)
                                        ?.domicile
                                    }
                                  </p>
                                </div>
                              </div>
                              <div>
                                {candidateDataList.find(
                                  (candidate) => candidate._id === activeCandidateIndex && candidate.score
                                ) !== undefined && activeFilteredListCandidate === 'filtered' ? (
                                  <div
                                    className={`w-[142px]  h-[82px] text-[16px] flex flex-col justify-center items-center  text-primary_blue font-medium rounded bg-semantic_blue_50 border-2 border-secondary_blue`}
                                  >
                                    Peringkat: {rankText}
                                    <p className={`font-bold text-semantic_blue_600 text-[32px]`}>
                                      {
                                        candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)
                                          ?.score
                                      }
                                    </p>
                                  </div>
                                ) : (
                                  <div className={`w-[142px] h-[82px]`} />
                                )}
                              </div>
                            </div>
                            {activeFilteredListCandidate === 'filtered' &&
                              (candidateDataList.find(
                                (candidate) => candidate._id == activeCandidateIndex && (candidate.score ?? 0 > 0)
                              )?.score ??
                                0 > 0) && (
                                <div>
                                  <Divider orientation="left" style={{ fontSize: '18px' }}>
                                    Skills
                                  </Divider>
                                  <Space size={[0, 8]} wrap>
                                    {visibleSkills.map((skill: string, index: number) => (
                                      <Tag color="blue" key={index} style={{ borderRadius: '32px', fontSize: '14px' }}>
                                        {skill}
                                      </Tag>
                                    ))}
                                    {skills && skills.length > 10 && (
                                      <Tag
                                        color="blue"
                                        onClick={handleExpandTags}
                                        style={{ borderRadius: '32px', fontSize: '14px' }}
                                      >
                                        {remainingTags > 0 ? '...' : 'Less'}
                                      </Tag>
                                    )}
                                  </Space>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className={``}>
                          <div className={`flex justify-between pl-[18px] pr-[32px] pt-6`}>
                            <p className={`text-center font-bold border-b-[7px] border-primary_blue w-[56px] `}>CV</p>
                            <p className={`text-lg`}>
                              <span className={`font-semibold`}>Diunggah pada</span>{' '}
                              {formattedDate(
                                candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)
                                  ?.createdDate
                              )}
                            </p>
                          </div>
                          <hr className={`mx-[18px] bg-mid_neutral_100 mb-[22px]`} />
                          <div>
                            <Viewer
                              fileUrl={
                                candidateDataList.find((candidate) => candidate._id === activeCandidateIndex)?.cvFile ??
                                ''
                              }
                              plugins={[newPlugin]}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-dark_neutral_500 z-20 fixed bottom-5 left-[260px] drop-shadow-md bg-white py-4 px-8 gap-[24px] flex items-center justify-center rounded">
                    <div className="flex justify-center items-center">
                      <label htmlFor="itemsPerPage" className="mr-2">
                        Tampilkan (CV):
                      </label>
                      <input
                        id="itemsPerPage"
                        type="number"
                        min="1"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className={`w-[75px] px-2 py-1  border rounded`}
                      />
                    </div>
                    <Pagination
                      totalItems={totalCandidates}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={(page: number) => onPageChange(page)}
                    />
                  </div>
                </div>
              ) : (
                <div className={` bg-light_neutral_200 h-[813px] w-full rounded-md pt-[184px] px-[638px]`}>
                  {isUploading ? (
                    <div className={`flex flex-col gap-[18px]`}>
                      <p className={`text-center text-dark_neutral_300  mb-[30px] pl-[32px]`}>
                        CV anda sedang diunggah. Mohon ditunggu...
                      </p>
                      <div className={`flex justify-center`}>
                        <div className={`animate-spin rounded-full h-32 w-32 border-b-2 border-primary_blue`} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={`text-center font-bold mb-[30px] pl-[32px]`}>
                        Mulai unggah CV untuk mulai mengotomatiskan proses penyaringan Anda!
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
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <div
              className={` h-screen  gap-[36px] bg-light_neutral_200 rounded-[6px] drop-shadow-md flex flex-col items-center justify-center`}
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
          content="Posisi yang ditutup dapat dilihat kembali di halaman Arsip"
        />
      )}
    </Layout>
  );
}
