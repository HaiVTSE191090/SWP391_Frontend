import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

interface FieldErrorProps {
  fieldName: string;
  className?: string;
}

const FieldError = ({ fieldName, className = "" } : FieldErrorProps) => {
  const userContext = useContext(UserContext);
  
  const fieldErrors = (userContext as any)?.fieldErrors as Record<string, string>;

  if (!fieldErrors || !fieldErrors[fieldName]) {
    return null;
  }

  return (
    <div className={`text-danger small mt-1 ${className}`}>
      {fieldErrors[fieldName]}
    </div>
  );
};

export default FieldError;
