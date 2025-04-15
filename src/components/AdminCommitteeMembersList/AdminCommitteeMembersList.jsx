import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import { Search } from "lucide-react";
import "./AdminCommitteeMembersList.css";

export default function AdminCommitteeMembersList({ addMember, close }) {
  const {
    data: members,
    loading,
    error,
    refetch,
  } = useFetch(`/Committee-member/`);

  const [searchItem, setSearchItem] = useState("");
  const [membersList, setMembersList] = useState([]);

  useEffect(() => {
    if (!members) {
      return;
    }

    const filtered = members
      ? members.filter((member) => {
          const fullText =
            `${member.name} ${member.surname} ${member.affiliation}`.toLowerCase();
          return fullText.includes(searchItem.toLowerCase());
        })
      : [];

    setMembersList(filtered);
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
        {!loading &&
          membersList.map((member) => (
            <p
              key={member.id}
              onClick={() => {
                addMember(member);
                close();
              }}
            >{`${member.name} ${member.surname}, ${member.affiliation}`}</p>
          ))}
      </div>
      <div className="button-container">
        <button onClick={() => close()} className="button">
          Close
        </button>
      </div>
    </div>
  );
}
