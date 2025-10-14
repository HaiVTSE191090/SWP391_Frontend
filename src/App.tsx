import React from "react";
import AppRouter from "./routes/AppRouter";
import { UserProvider } from "./context/UserContext";
import Staff from "./components/StaffInterface/Staff";

const App = () => {
  return (
    <>
      {/* <UserProvider>
        <AppRouter />
      </UserProvider> */}

      <Staff />
    </>
  );
};


export default App;
