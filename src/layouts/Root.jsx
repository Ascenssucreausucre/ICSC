import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

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
    return <div>Chargement...</div>;
  }

  return (
    <>
      <Header banner={isHome} data={headerData} />
      <main>
        <Outlet />
      </main>
      <Footer data={footerData} />
    </>
  );
}

export default Root;
