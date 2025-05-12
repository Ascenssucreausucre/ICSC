import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { PrimeReactProvider } from "primereact/api";
import useFetch from "./hooks/useFetch";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

function App() {
  const { data, loading } = useFetch("/Conferences/current");

  useEffect(() => {
    if (data) {
      const { primary_color, secondary_color, tertiary_color } =
        data.currentConference;
      // Appliquer les couleurs dynamiquement
      document.documentElement.style.setProperty(
        "--primary-color",
        primary_color
      );
      document.documentElement.style.setProperty(
        "--secondary-color",
        secondary_color
      );
      document.documentElement.style.setProperty(
        "--tertiary-color",
        tertiary_color
      );
    }
  }, [data]);

  const value = {
    ripple: true,
  };

  if (loading) return <LoadingScreen />;

  return (
    <PrimeReactProvider value={value}>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  );
}

export default App;
