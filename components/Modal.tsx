import { createContext } from 'react';

const ModalContext = createContext({ isOpen: false, onClose: () => {} });

type ModalProps = {
  type: string;
  headline: string;
  content: string;
  isOpen: boolean;
  onOk: () => void;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({ type, headline, content, isOpen, onOk, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black bg-opacity-50"></div> {/* Overlay */}
        <div className="bg-primary_white rounded p-8 relative z-10">
          <div className="flex justify-end">
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
          <h2 className="container mx-auto text-2xl mb-[12px] text-center font-semibold text-primary_dark max-w-[297px]">
            {headline}
          </h2>
          <p className="max-w-[391px] text-center text-[18px] mb-[32px]">{content}</p>
          <div className="flex justify-center items-center gap-[8px] mb-[24px]">
            <input type="checkbox" name="dontShowAgain" id="dontShowAgain" />
            <label htmlFor="dontShowAgain" className="text-[14px] text-dark_neutral_200">
              don&apos;t show this again
            </label>
          </div>
          {type.includes('delete') && (
            <div className="flex justify-between">
              <button
                className="w-[189px] h-[47px] text-primary_blue border border-primary_blue hover:border-2 rounded"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                onClick={onOk}
                className="w-[189px] h-[47px] text-primary_white bg-semantic_red_500 border hover:bg-primary_white hover:border-semantic_red_500 hover:text-semantic_red_500 rounded"
              >
                Hapus
              </button>
            </div>
          )}
          {type.includes('restore') && (
            <div className="flex justify-between">
              <button
                className="w-[189px] h-[47px] text-primary_blue border border-primary_blue hover:border-2 rounded"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                onClick={onOk}
                className="w-[189px] h-[47px] text-primary_white bg-semantic_green_600 border hover:bg-primary_white hover:border-semantic_green_600 hover:text-semantic_green_600 rounded"
              >
                Pulihkan
              </button>
            </div>
          )}
          {type.includes('resolve') && (
            <div className="flex justify-between">
              <button
                className="w-[189px] h-[47px] text-primary_blue border border-primary_blue hover:border-2 rounded"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                onClick={onOk}
                className="w-[189px] h-[47px] text-primary_white bg-primary_blue border hover:bg-primary_white hover:border-primary_blue hover:text-primary_blue rounded"
              >
                Selesaikan
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

export default ModalContext;
