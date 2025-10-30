import React from "react";

interface AlertMessageProps {
  type: "success" | "danger";
  message: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} text-center mt-3`} role="alert">
      {message}
    </div>
  );
};

export default AlertMessage;
