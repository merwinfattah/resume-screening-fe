import { useState, useRef, useEffect } from 'react';
import {FiEdit2} from 'react-icons/fi';

interface Props {
  initialValue: string;
  onValueChange: (newName: string) => void;
}

const EditorInput = ({ initialValue, onValueChange }: Props) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleValueSave = () => {
    onValueChange(value);
    setIsEditing(false);
  };

  return (
    <div>
      {!isEditing && (
        <div className={`flex gap-[16.77px]`}>
          <p className={` text-2xl`}>{value}</p>
          <button className={`text-primary_blue`} onClick={handleEditClick}><FiEdit2 /></button>
        </div>
      )}

      {isEditing && (
        <div className={`flex gap-[16.77px]`}>
          <input className={` text-2xl outline-none bg-transparent`} type="text" value={value} onChange={handleValueChange} onBlur={handleValueSave} ref={inputRef} />
        </div>
      )}
    </div>
  );
};

export default EditorInput;