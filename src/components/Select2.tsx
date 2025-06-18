import React from 'react';
import Select from 'react-select';

interface Select2Props {
  label?: string;
  onChange: (value: number) => void;
  options: Array<{ value: number; label: string }>;
  value?: number;
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  className?: string;
}

const Select2: React.FC<Select2Props> = ({
  label,
  onChange,
  options,
  value,
  placeholder = 'Select an option...',
  isSearchable = false,
  isClearable = false,
  className = '',
  ...props
}) => {
  const selectedOption = options.find(option => option.value === value);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '38px',
      border: state.isFocused ? '1px solid #6366f1' : '1px solid #d1d5db',
      borderRadius: '6px',
      boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
      '&:hover': {
        border: '1px solid #6366f1',
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#6366f1' 
        : state.isFocused 
        ? '#f3f4f6' 
        : 'transparent',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      padding: '8px 12px',
      fontSize: '14px',
      '&:hover': {
        backgroundColor: state.isSelected ? '#6366f1' : '#f3f4f6',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 50,
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#374151',
      fontSize: '14px',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '14px',
    }),
    input: (provided: any) => ({
      ...provided,
      fontSize: '14px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: state.isFocused ? '#6366f1' : '#9ca3af',
      '&:hover': {
        color: '#6366f1',
      },
    }),
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}
      <Select
        value={selectedOption}
        onChange={(option) => onChange(option?.value || 10)}
        options={options}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isClearable}
        styles={customStyles}
        classNamePrefix="select2"
        {...props}
      />
    </div>
  );
};

export default Select2; 