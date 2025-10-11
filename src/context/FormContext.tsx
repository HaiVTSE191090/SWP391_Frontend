import React, { createContext, useState, ReactNode } from "react";

interface FormContextType {
    formData: Record<string, any>,
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    resetForm: () => void;
    fieldErrors: Record<string, string>;
    setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    clearErrors: () => void;
}

export const FormContext = createContext<FormContextType | null>(null);

interface Props {
    children: ReactNode;
}

export const FormProvider = ({ children }: Props) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
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
    };
    
    const clearErrors = () => setFieldErrors({});

    const value = { 
        formData, 
        setFormData, 
        handleChange, 
        resetForm, 
        fieldErrors, 
        setFieldErrors, 
        clearErrors 
    };

    return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}