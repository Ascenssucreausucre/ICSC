import RegistrationFeesTable from "../RegistrationFeesTable/RegistrationFeesTable";
import "./FeesManager.css";

export default function FeesManager({ data }) {
  return (
    <div className="fees-manager">
      {data.map((fee) => (
        <div className="fee-manager" key={fee.id}>
          <RegistrationFeesTable data={fee} />
          <div className="button-container" style={{ paddingInline: "25%" }}>
            <button className="button">Manage Fees</button>
            <button className="button">Delete Fees</button>
          </div>
        </div>
      ))}
      <button className="button">New registration fees</button>
    </div>
  );
}
