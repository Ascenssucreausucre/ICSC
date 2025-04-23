import { RouterProvider } from "react-router-dom";
import router from "./routes/routes"; // Import du fichier routes
import { PrimeReactProvider } from "primereact/api";

function App() {
  return (
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  );
}

export default App;
