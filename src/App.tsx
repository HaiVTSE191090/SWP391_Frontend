import React from "react";
import AppRouter from "./routes/AppRouter";
import { UserProvider } from "./context/UserContext";
import { VehicleProvider } from "./context/VehicleContext";

const App = () => {
  return (
    <>
      <UserProvider>
        <VehicleProvider>
          <AppRouter />
        </VehicleProvider>
      </UserProvider>
    </>
  );
};


export default App;
