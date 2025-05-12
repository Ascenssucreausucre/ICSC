import { Link, useLoaderData } from "react-router-dom";
import { LinkIcon } from "lucide-react";
import "./LocalInfo.css";

export default function LocalInfo() {
  const localInformations = useLoaderData();
  console.log(localInformations);
  return (
    <>
      <h1 className="title secondary">Local Info</h1>
      <div className="front-local-info-container">
        {localInformations.map((localInfo, index) => (
          <>
            <div className="local-information">
              <h2 className="card-title secondary">{localInfo.title}</h2>
              {localInfo?.text && <p>{localInfo.text}</p>}
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
            {/* {index + 1 < localInformations.length && <hr />} */}
          </>
        ))}
      </div>
    </>
  );
}
