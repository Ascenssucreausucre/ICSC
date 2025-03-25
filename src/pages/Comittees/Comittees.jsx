import { committees } from "../../fakeDatas";

export default function Comittees() {
  return (
    <>
      {committees.map((comittee, comitteeIndex) => (
        <div key={comitteeIndex} className="comittee">
          <h2 className="title">{comittee.type}</h2>

          {/* Vérifier si `roles` existe et est un tableau */}
          {Array.isArray(comittee.roles) && comittee.roles.length > 0 ? (
            comittee.roles.map((role, roleIndex) => (
              <div key={roleIndex} className="comittee-role text-container">
                {role.title && <h3 className="primary bold">{role.title}</h3>}

                {/* Vérifier si `members` existe avant de le parcourir */}
                {Array.isArray(role.members) &&
                  role.members.map((member, memberIndex) => (
                    <p key={memberIndex}>
                      {member.name} {member.surname || ""} (
                      {member.from || "Unknown"})
                    </p>
                  ))}
              </div>
            ))
          ) : (
            <p>Aucun membre trouvé</p>
          )}
        </div>
      ))}
    </>
  );
}
