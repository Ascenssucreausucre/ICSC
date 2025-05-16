import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Helmet } from "react-helmet";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import NavigationProgress from "../components/NavigationProgress/NavigationProgress";

const API_URL = import.meta.env.VITE_API_URL;

function Root() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch(`${API_URL}/front-routes/navbar-data`);
        const data = await response.json();
        setHeaderData(data);
      } catch (error) {
        console.error("Erreur API Header:", error);
      }
    };

    const fetchFooterData = async () => {
      try {
        const response = await fetch(`${API_URL}/front-routes/footer-data`);
        const data = await response.json();
        setFooterData(data);
      } catch (error) {
        console.error("Erreur API Footer:", error);
      }
    };

    fetchHeaderData();
    fetchFooterData();
  }, []);

  if (!headerData || !footerData) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title>
          {headerData.conferenceData.acronym +
            "'" +
            headerData.conferenceData.year}
        </title>
      </Helmet>
      <Header banner={isHome} data={headerData} />
      <main>
        <NavigationProgress />
        <Outlet />
      </main>
      <Footer data={footerData} />
    </>
  );
}

export default Root;
