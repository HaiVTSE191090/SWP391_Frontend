import React from "react";

interface InputFieldProps {
  name?: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({name,type = "text",placeholder,value,onChange,error,required = false}) => (
  <div className="mb-3">
    <input
      name={name}
      type={type}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
    {error && (
      <div className="invalid-feedback">
        {error}
      </div>
    )}
  </div>
);

export default InputField;
