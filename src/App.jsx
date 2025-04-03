import { RouterProvider } from "react-router-dom";
import router from "./routes/routes"; // Import du fichier routes

function App() {
  return <RouterProvider router={router} />;
}

export default App;
