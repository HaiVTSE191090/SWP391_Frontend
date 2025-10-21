import React from "react";
import AppRouter from "./routes/AppRouter";
import { UserProvider } from "./context/UserContext";
import { VehicleProvider } from "./context/VehicleContext";
import ToastConfig from "./components/common/ToastConfig";

const App = () => {
  return (
    <>
      <UserProvider>
        <VehicleProvider>
          <AppRouter />
        </VehicleProvider>
      </UserProvider>
      
      <ToastConfig />
    </>
  );
};


export default App;
