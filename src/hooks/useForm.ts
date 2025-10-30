import { useContext } from "react";
import { FormContext, FormContextType } from "../context/FormContext";


export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  
  if (!context) {
    throw new Error(
      "useForm must be used within a FormProvider. " +
      "Wrap your component tree with <FormProvider>.</FormProvider>"
    );
  }
  
  return context;
};
