import useFetch from "../../../hooks/useFetch";

export default function Submission() {
  const { loading, data: dates } = useFetch("/ImportantDates/current");
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <h1 className="title secondary">Submission</h1>
      <section>
        <p className="sub-title">
          In order to submit your papers, you will have to electronically submit
          them by{" "}
          <span className="important-info">
            {new Date(dates.final_submission_due).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          , via{" "}
          <a
            href="https://controls.papercept.net/conferences/scripts/start.pl"
            target="_blank"
          >
            this website
          </a>
          .
        </p>
        <br />
        <p>
          Full papers should be submitted in standard IEEE double-column format
          for conferences. The first page of the paper, centered on the top
          below the top margin, should include the paper title, the authors'
          names and their affiliations, an abstract, and keywords.
        </p>
        <br />
        <p>
          Six pages are allowed for each paper. Up to two additional pages will
          be permitted for a charge of{" "}
          <span
            style={{
              fontWeight: 900,
              color: "red",
              textDecoration: "underline",
            }}
          >
            {" "}
            PRICE TO ADD
          </span>{" "}
          per additional page.
        </p>
        <p>Illustrations and references are included in the page count.</p>
        <p>
          Submitted papers will undergo a blind peer review process, coordinated
          by the Program Chairs and the IPC. Authors will be notified of
          acceptance or rejection by{" "}
          <strong>
            {new Date(dates.paper_decision_notification).toLocaleDateString(
              "en-EN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </strong>
          . Accepted papers in final form must be received no later than{" "}
          <strong>
            {new Date(dates.final_submission_due).toLocaleDateString("en-EN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>
          .
        </p>
      </section>
      <section>
        <h2 className="secondary">Invited Sessions</h2>
        <p>
          A Summary Statement describing the motivation and relevance of the
          proposed session, invited paper titles and author names must be
          e-mailed by the organizer(s) to the Invited Sessions Chair by May 15,
          2025 . Authors must submit FULL versions of invited papers
          electronically, through the Conference Website. Each such paper must
          be marked as 'Invited Session Paper'. Please go to the online paper
          submission site, and login using your PIN/Password (you have to
          register to get your PIN), to submit your contribution (please follow
          closely the instructions provided by The Online paper submission
          site.)
        </p>
      </section>
      <section>
        <h2 className="title secondary">Paper Style</h2>
        <p>
          Please note that the paper size for final manuscripts must be set to
          'letter format'. Full papers should be submitted in standard IEEE 10pt
          double-column format for conferences.
        </p>
      </section>
    </>
  );
}
