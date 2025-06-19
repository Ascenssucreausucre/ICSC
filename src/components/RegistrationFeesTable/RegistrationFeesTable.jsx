import "./RegistrationFeesTable.css";

export default function RegistrationFeesTable({ data, highlight }) {
  const formatText = (text) =>
    String(text).charAt(0).toUpperCase() + String(text).slice(1);
  return (
    <div className="fees-table">
      <div key={data.id} className="region">
        <h2>{formatText(data.description)}</h2>
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
            {data.feecategories.map((category, catIndex) => (
              <tr key={catIndex}>
                <td>{category.type}</td>
                <td>{category.ieee_member}€</td>
                <td>{category.non_ieee_member}€</td>
                <td>
                  {category.virtual_attendance
                    ? `${category.virtual_attendance}€`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
