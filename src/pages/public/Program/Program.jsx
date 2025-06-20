import { useLoaderData } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import "./Program.css";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PlenaryAuthorModal from "../../../components/PlenaryAuthorModal/PlenaryAuthorModal";
import React from "react";
import { Link } from "react-router-dom";
import { FileX2 } from "lucide-react";
import { LinkIcon } from "lucide-react";
import { LucideUnlink } from "lucide-react";
import { FileCheck2 } from "lucide-react";
import Linkify from "linkify-react";

export default function Program() {
  const [bio, setBio] = useState(null);
  const { specialSessions, plenarySessions, workshops } = useLoaderData();
  const formatDate = (date, country = "en-US", props) => {
    const options = props ?? { day: "numeric", month: "long" };
    const converted = new Date(date);
    return converted.toLocaleDateString(country, options);
  };

  return (
    <>
      <AnimatePresence>
        {bio && (
          <PlenaryAuthorModal
            data={bio.authors}
            image={bio.image}
            resume={bio.resume}
            onClose={() => setBio(null)}
          />
        )}
      </AnimatePresence>

      <h1 className="title primary">Program</h1>

      <section>
        <TabView>
          <TabPanel header="Plenary Sessions">
            {!plenarySessions || plenarySessions.length === 0 ? (
              <p>This conference has no plenary sessions yet.</p>
            ) : (
              plenarySessions.map((session, index) => (
                <React.Fragment key={session.id || index}>
                  <section className="section">
                    <div className="section-header">
                      <div className="section-header-text">
                        <h2 className="card-title secondary">
                          {session.title}
                        </h2>
                        <p className="sub-title">
                          by{" "}
                          {session.authors.map(
                            (author) =>
                              `${author.title ? author.title + " " : ""}${
                                author.name
                              } ${author.surname}, ${session.affiliation}`
                          )}
                        </p>
                        <button
                          className="bio-toggle"
                          onClick={() =>
                            setBio({
                              authors: session.authors,
                              image: session.image,
                              resume: session.author_resume,
                            })
                          }
                        >
                          See author's biography
                        </button>
                      </div>
                      <img
                        src={import.meta.env.VITE_IMAGE_URL + session.image}
                      />
                    </div>
                    <p>
                      <Linkify options={{ target: "_blank" }}>
                        {session.session_resume}
                      </Linkify>
                    </p>
                  </section>
                  {index + 1 < plenarySessions.length && <hr />}
                </React.Fragment>
              ))
            )}
          </TabPanel>

          <TabPanel header="Special Session">
            {!specialSessions || specialSessions.length === 0 ? (
              <p>This conference has no special sessions yet.</p>
            ) : (
              specialSessions.map((session, index) => (
                <React.Fragment key={session.id || index}>
                  <section className="section">
                    <div className="section-header">
                      <div className="section-header-text">
                        <h2 className="card-title secondary">
                          {session.title}
                        </h2>
                        <p className="sub-title">
                          by{" "}
                          {session.authors.map(
                            (author, index) =>
                              `${author.title ? author.title + " " : ""}${
                                author.name
                              } ${author.surname}${
                                index + 1 < session.authors.length ? ", " : "."
                              }`
                          )}
                        </p>
                      </div>
                    </div>
                    <p>{session.summary}</p>
                  </section>
                  {index + 1 < specialSessions.length && <hr />}
                </React.Fragment>
              ))
            )}
          </TabPanel>

          <TabPanel header="Workshops">
            {!workshops || workshops.length === 0 ? (
              <p>This conference has no workshops yet.</p>
            ) : (
              <div>
                {workshops.map((workshop, index) => (
                  <React.Fragment key={workshop.id || index}>
                    <section className="section">
                      <div className="section-header-text">
                        <h2 className="card-title secondary">
                          {workshop.title}
                        </h2>
                        <p className="sub-title">{`Presented by ${workshop.presenters},`}</p>
                        <p className="sub-title">{`from ${formatDate(
                          workshop.date_from
                        )} to ${formatDate(workshop.date_to)}.`}</p>
                      </div>
                      <p>
                        <Linkify>{workshop.text}</Linkify>
                      </p>
                      {workshop?.additional_file && (
                        <Link
                          to={`${
                            import.meta.env.VITE_IMAGE_URL +
                            workshop.additional_file
                          }`}
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
                    </section>

                    {index + 1 < workshops.length && <hr />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </TabPanel>

          <TabPanel header="Program">
            <div>
              <h2 className="secondary">General Program</h2>
              <p>The detailed program will be announced soon.</p>
            </div>
          </TabPanel>
        </TabView>
      </section>
    </>
  );
}
