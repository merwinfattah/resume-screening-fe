import React from 'react';
import { MdArrowForwardIos, MdArrowBackIos } from 'react-icons/md';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    onPageChange(page);
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-[24px] h-[24px] hover:cursor-pointer mr-2 bg-transparent rounded"
      >
        <MdArrowBackIos />
      </button>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-[24px] h-[24px] hover:cursor-pointer ml-2 bg-transparent rounded"
      >
        <MdArrowForwardIos />
      </button>
    </div>
  );
};

export default Pagination;
