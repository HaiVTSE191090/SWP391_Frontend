import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import AppRouter from "./routes/AppRouter";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </>
  );
};


export default App;
