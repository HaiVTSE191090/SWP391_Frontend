import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

interface FieldErrorProps {
  fieldName: string;
  className?: string;
}

const FieldError = ({ fieldName, className = "" } : FieldErrorProps) => {
  const userContext = useContext(UserContext);
  
  if (!userContext?.fieldErrors || !userContext.fieldErrors[fieldName]) {
    return null;
  }

  return (
    <div className={`text-danger small mt-1 ${className}`}>
      {userContext.fieldErrors[fieldName]}
    </div>
  );
};

export default FieldError;
