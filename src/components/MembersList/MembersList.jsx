import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import "./MembersList.css";

export default function MembersList({ url, addMember, close, unexists }) {
  const { data: members, loading } = useFetch(url);
  const [searchItem, setSearchItem] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    if (!members) return;

    const filtered = members.filter((member) => {
      const fullText =
        `${member.name} ${member.surname} ${member.affiliation}`.toLowerCase();
      return fullText.includes(searchItem.toLowerCase());
    });

    setFilteredMembers(filtered);
  }, [searchItem, members]);

  return (
    <div className="existing-members-list">
      <div className="searchbar">
        <Search />
        <input
          type="text"
          placeholder="Search member"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
      </div>

      <div className="members-list">
        {loading && <LoadingScreen />}
        {!loading &&
          filteredMembers.map((member) => (
            <p
              key={member.id}
              onClick={() => {
                addMember(member);
                close();
              }}
              className="member-option"
            >
              {`${member.name} ${member.surname}${
                member.affiliation ? `, ${member.affiliation}` : ""
              }`}
            </p>
          ))}
        {!loading && filteredMembers.length === 0 && (
          <>
            <p>No members found.</p>
            {unexists && (
              <button
                className="button"
                onClick={() => {
                  unexists(), close();
                }}
              >
                Add one
              </button>
            )}
          </>
        )}
      </div>

      <div className="button-container">
        <button onClick={close} className="button">
          Close
        </button>
      </div>
    </div>
  );
}
