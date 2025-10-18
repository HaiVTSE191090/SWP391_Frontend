import React, { createContext, useState, ReactNode } from "react";

interface FormContextType {
    formData: Record<string, any>,
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    resetForm: () => void;
    fieldErrors: Record<string, string>;
    setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    clearErrors: () => void;
    message: string | null;
    error: string | null;
    setMessage: (message: string | null) => void;
    setError: (error: string | null) => void;
    clearMessages: () => void;
}

export const FormContext = createContext<FormContextType | null>(null);

interface Props {
    children: ReactNode;
}

export const FormProvider = ({ children }: Props) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }
    
    const resetForm = () => {
        setFormData({});
        setFieldErrors({});
        setMessage(null);
        setError(null);
    };
    
    const clearErrors = () => setFieldErrors({});
    
    const clearMessages = () => {
        setMessage(null);
        setError(null);
    };

    const value = { 
        formData, 
        setFormData, 
        handleChange, 
        resetForm, 
        fieldErrors, 
        setFieldErrors, 
        clearErrors,
        message,
        error,
        setMessage,
        setError,
        clearMessages,
    };

    return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}