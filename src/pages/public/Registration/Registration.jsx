import RegistrationFeesTable from "../../../components/RegistrationFeesTable/RegistrationFeesTable";
import { ArrowRight } from "lucide-react";
import { useLoaderData } from "react-router-dom";

export default function Registration() {
  const iconSize = 12;

  const { registrationFees, importantDates } = useLoaderData();

  console.log(importantDates);

  return (
    <>
      <h1 className="title primary">Registration</h1>
      <section>
        <div className="text-container">
          <p>
            The registration phase ends on{" "}
            <span className="important-info">
              {new Date(
                importantDates.initial_submission_due
              ).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>{" "}
            , each procedure must have been finalized before.
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
        {registrationFees.map((registrationFee) => (
          <RegistrationFeesTable
            data={registrationFee}
            key={registrationFee.id}
          />
        ))}
      </section>
    </>
  );
}
