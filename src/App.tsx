import React from "react";
import AppRouter from "./routes/AppRouter";
<<<<<<< Updated upstream
import { UserProvider } from "./context/UserContext";
=======
>>>>>>> Stashed changes

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
