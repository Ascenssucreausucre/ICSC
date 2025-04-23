// components/SearchBar.js
import { Search } from "lucide-react";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="searchbar">
      <Search />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
