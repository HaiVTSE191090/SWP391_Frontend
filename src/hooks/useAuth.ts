import { useContext } from "react";
import { UserContext, UserContextType } from "../context/UserContext";

/**
 * Custom hook để sử dụng UserContext với type-safe
 * 
 * @returns UserContext value với đầy đủ type safety
 * @throws Error nếu hook được sử dụng ngoài UserProvider
 * 
 * @example
 * const { login, user, loading } = useAuth();
 */
export const useAuth = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error(
      "useAuth must be used within a UserProvider. " +
      "Wrap your component tree with <UserProvider>.</UserProvider>"
    );
  }
  
  return context;
};
