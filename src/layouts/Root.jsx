import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Feedback } from "../components/Feedback/Feedback";
import { Helmet } from "react-helmet";
import NavigationProgress from "../components/NavigationProgress/NavigationProgress";
import ChatRoom from "../components/ChatRoom/ChatRoom";

function Root() {
  const { conferenceData, importantDatesData, newsData, sponsors, contacts } =
    useLoaderData();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const headerData = { conferenceData, newsData, importantDatesData };
  const footerData = { conferenceData, importantDatesData, sponsors, contacts };
  const className = location.pathname.slice(1).replace("/", "-");

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
