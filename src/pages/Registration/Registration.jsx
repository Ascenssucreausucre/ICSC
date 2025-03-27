import Submission from "../Submission/Submission";
import CallForPaper from "../C4P/CallForPaper";
import RegistrationFeesTable from "../../components/RegistrationFeesTable/RegistrationFeesTable";
import ImportantDates from "../../components/ImportantDates/ImportantDates";
import { ArrowRight } from "lucide-react";
import { importantDates } from "../../fakeDatas";

export default function Registration() {
  const iconSize = 12;

  return (
    <>
      <h1 className="title primary">Registration</h1>
      <section>
        <div className="text-container">
          <p>
            Registrations are closed on{" "}
            <span className="important-info">
              {importantDates.initialSubmissionDue.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>{" "}
            and must have been submit until then.
          </p>
        </div>
      </section>
      <section>
        <div className="text-container">
          <p>
            In order to register, you will have some registration fees to pay.
          </p>
          <h2 className="secondary">Good to know :</h2>
          <ul>
            <li>
              <ArrowRight size={iconSize} color="#eb4c4c" />
              The registration fee includes the conference Proceedings.
            </li>
            <li>
              <ArrowRight size={iconSize} color="#eb4c4c" />
              At most one additional paper is accepted by a non-student
              registration.
            </li>
            <li>
              <ArrowRight size={iconSize} color="#eb4c4c" />A Student
              Registration does not give right to an additional paper.
            </li>
            <li>
              <ArrowRight size={iconSize} color="#eb4c4c" />
              Six pages are allowed for each paper. Up to two additional pages
              will be permitted for a charge of 40 EUR per additional page.
            </li>
            <li>
              <ArrowRight size={iconSize} color="#eb4c4c" />
              Students must provide concurrently with the Registration Form an
              official university letter confirming their status (or Student
              card) as full time students and the degree program they are
              enrolled in.
            </li>
          </ul>
        </div>
        <RegistrationFeesTable />
      </section>

      <Submission />
      <CallForPaper />
    </>
  );
}
