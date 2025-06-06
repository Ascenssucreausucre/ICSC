// components/SearchBar.js
import { Search } from "lucide-react";
import "./SearchBar.css";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

export default function SearchBar({ value, onChange, placeholder, loading }) {
  return (
    <div className="searchbar">
      <Search />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {loading && <LoadingScreen />}
    </div>
  );
}
