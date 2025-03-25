import "./Header.css";
import morocco from "../../assets/images/morocco.jpg";
import NavBar from "../NavBar/NavBar";

import { globalInfos, importantDates } from "./../../fakeDatas";

export default function Header() {
  return (
    <header>
      <NavBar />
      <div
        className="page-title"
        style={{ backgroundImage: `url(${morocco})` }}
      >
        <h1>ICSC 2025</h1>
        <p>
          {importantDates.congress.opening.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
          })}{" "}
          to{" "}
          {importantDates.congress.closing.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          , 2025 in {globalInfos.city}, {globalInfos.country}.
        </p>
      </div>
    </header>
  );
}
