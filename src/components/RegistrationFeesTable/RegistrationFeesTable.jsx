import { registrationFees } from "../../fakeDatas";
import "./RegistrationFeesTable.css";

export default function RegistrationFeesTable() {
  return (
    <div className="fees-table">
      {registrationFees.map((region, index) => (
        <div key={index} className="region">
          <h2>{region.country}</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>IEEE Member</th>
                <th>Non-IEEE Member</th>
                <th>Virtual Attendance</th>
              </tr>
            </thead>
            <tbody>
              {region.categories.map((category, catIndex) => (
                <tr key={catIndex}>
                  <td>{category.type}</td>
                  <td>{category.ieeeMember}€</td>
                  <td>{category.nonIeeeMember}€</td>
                  <td>
                    {category.virtualAttendance
                      ? `${category.virtualAttendance}€`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
