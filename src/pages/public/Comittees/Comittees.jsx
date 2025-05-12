import { useState, useEffect } from "react";
import "./Comittees.css";
import useFetch from "../../../hooks/useFetch";
import React from "react";

export default function Comittees() {
  const [committees, setCommittees] = useState([]);

  const { data: committeesData, loading } = useFetch(`/Committee/current`);

  useEffect(() => {
    if (committeesData) {
      const formattedCommittees = committeesData.map((committee) => {
        const grouped = committee.members.reduce((acc, member) => {
          const { CommitteeRole, ...formattedMember } = member;
          const title = CommitteeRole.title || null;

          let existingGroup = acc.find((item) => item.title === title);
          if (!existingGroup) {
            existingGroup = { title, members: [] };
            acc.push(existingGroup);
          }

          existingGroup.members.push(formattedMember);
          return acc;
        }, []);

        return {
          type: committee.type,
          roles: grouped,
        };
      });
      setCommittees(formattedCommittees);
    }
  }, [committeesData]);

  return (
    <div className="committees">
      <h1 className="title primary">Committees</h1>
      {!loading && committees && committees.length > 0 ? (
        committees.map((comittee, comitteeIndex) => (
          <React.Fragment>
            <div key={comitteeIndex} className="committee">
              <h2 className="title secondary">{comittee.type}</h2>

              <div className="roles-container">
                {/* Vérifier si `roles` existe et est un tableau */}
                {Array.isArray(comittee.roles) && comittee.roles.length > 0 ? (
                  comittee.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="committee-role">
                      {role.title && (
                        <h3 className="primary bold">{role.title}</h3>
                      )}

                      {/* Vérifier si `members` existe avant de le parcourir */}
                      {Array.isArray(role.members) &&
                        role.members.map((member, memberIndex) => (
                          <p key={memberIndex}>
                            {member.name} {member.surname || ""} (
                            {member.affiliation || "Unknown"})
                          </p>
                        ))}
                    </div>
                  ))
                ) : (
                  <p>Aucun membre trouvé</p>
                )}
              </div>
            </div>
            {comitteeIndex + 1 < committees.length && <hr />}
          </React.Fragment>
        ))
      ) : (
        <p>This conference's committees hasn't been defined yet.</p>
      )}
    </div>
  );
}
