import { Link, useLoaderData } from "react-router-dom";
import { LinkIcon } from "lucide-react";
import "./LocalInfo.css";
import React from "react";
import Linkify from "linkify-react";

export default function LocalInfo() {
  const localInformations = useLoaderData();
  return (
    <>
      <h1 className="title primary">Local Info</h1>
      <div className="front-local-info-container">
        {localInformations.map((localInfo, index) => (
          <React.Fragment key={index}>
            <div className="local-information">
              <h2 className="card-title secondary">{localInfo.title}</h2>
              {localInfo?.text && (
                <p>
                  <Linkify options={{ target: "_blank" }}>
                    {localInfo.text}
                  </Linkify>
                </p>
              )}
              {localInfo?.file && (
                <Link
                  to={`${import.meta.env.VITE_IMAGE_URL + localInfo.file}`}
                  className="link"
                  target="__blank"
                  style={{
                    color: "var(--tertiary-color)",
                    width: "fit-content",
                  }}
                >
                  Attached file
                  <LinkIcon
                    className="text-icon hover-icon"
                    size="1.2rem"
                    strokeWidth="2.5"
                  />
                </Link>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
