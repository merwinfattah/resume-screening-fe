
import React, { useState } from "react";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });

type Props = {
    handleChange: (selectedOption: { value: string; label: string }) => void
    options: any[]
    id: string
    inputName: string
    placeholder: string
    width: string
    value?: { value: any, label: any }
  };

const SelectItems: React.FC<Props> = ({handleChange, id, options, inputName, placeholder, width, value}) =>  {
    const [isSearchable] = useState(true);
    const [isClearable] = useState(true);
    const [isDisabled] = useState(false);
    const [isLoading] = useState(false);
    const [isRtl] = useState(false);
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            width: width,
            height: "44px",
            backgroundColor: "transparent",
            borderRadius: "6px",
            borderWidth: "1px",
            borderColor: "#53687B",
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#3B82F6" : "#F3F4F6",
            color: state.isFocused ? "#fff" : "#111827",
            "&:hover": {
            backgroundColor: "#3B82F6",
            color: "#fff",
            },
        }),
        singleValue: (provided: any, state: any) => ({
            ...provided,
            color: state.isFocused ? "#3B82F6" : "#111827",
        }),
        };
        
    const handleSelectChange = (selectedOption: any) => {
        handleChange(selectedOption);
        };

    return (
        <>
            <Select
                className="basic-single "
                classNamePrefix="select"
                isDisabled={isDisabled}
                isLoading={isLoading}
                isClearable={isClearable}
                isRtl={isRtl}
                isSearchable={isSearchable}
                id={id}
                name={inputName}
                options={options}
                styles={customStyles}
                placeholder={placeholder}
                onChange={handleSelectChange}
                value={value}
            /> 
        </>                    
    );
}

export default SelectItems;