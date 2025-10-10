import React, { createContext, useState, ReactNode } from "react";

interface FormContextType {
    formData: Record<string, any>,
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    resetForm: () => void;

}

export const FormContext = createContext<FormContextType | null>(null);

interface Props {
    children: ReactNode;
}

export const FormProvider = ({ children }: Props) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const resetForm = () => setFormData({});

    const value = { formData, setFormData, handleChange, resetForm };

    return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}