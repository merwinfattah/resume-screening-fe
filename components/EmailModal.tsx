import dynamic from 'next/dynamic';
import { Space, Tag } from 'antd';
import { useRef } from 'react';
import { BiUndo } from 'react-icons/bi';

const Select = dynamic(() => import('react-select'), { ssr: false });

type EmailProps = {
  email: string[];
  position: string;
  isOpen: boolean;
  onOk: () => void;
  onClose: () => void;
};

export const EmailModal: React.FC<EmailProps> = ({ email, position, isOpen, onOk, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <div className="bg-primary_white rounded p-8 relative z-10">
        <div className={`flex justify-between border-b`}>
          <h2 className="container mx-auto text-2xl mb-[12px] text-center font-semibold text-primary_dark max-w-[297px]">
            Email Candidates
          </h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={`flex border-b`}>
          <p>Kepada: </p>
          <Space size={[0, 8]} wrap>
            {email.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </Space>
        </div>
        <div className={`flex border-b`}>
          <p>Posisi: {position}</p>
        </div>
        <div className={`flex border-b`}>
          <p>Subject: </p>
          <input type="text" className={`border-none w-full outline-none`} />
        </div>
        <div className={`flex border-b`}>
          <Select />
        </div>
        <div>
          <div className={`justify-between`}>
            <div>{/*toolbars*/}</div>
            <div>
              <button>Simpan Draft</button>
              <button>Kirim</button>
            </div>
          </div>
          <textarea className={`border-none w-full outline-none`} />
        </div>
      </div>
    </div>
  );
};
