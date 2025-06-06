import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Feedback } from "../components/Feedback/Feedback";
import { Helmet } from "react-helmet";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import NavigationProgress from "../components/NavigationProgress/NavigationProgress";
import ChatRoom from "../components/ChatRoom/ChatRoom";

const API_URL = import.meta.env.VITE_API_URL;

function Root() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const className = location.pathname.slice(1).replace("/", "-");

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch(`${API_URL}/front/navbar-data`);
        const data = await response.json();
        setHeaderData(data);
      } catch (error) {
        console.error("Erreur API Header:", error);
      }
    };

    const fetchFooterData = async () => {
      try {
        const response = await fetch(`${API_URL}/front/footer-data`);
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
      <main className={className}>
        <NavigationProgress />
        <Feedback />
        <ChatRoom />
        <Outlet />
      </main>
      <Footer data={footerData} />
    </>
  );
}

export default Root;
