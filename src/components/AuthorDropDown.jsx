import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

export default function AuthorDropdown({
  value,
  onChange,
  placeholder = "Select an author",
  disabled = false,
}) {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Ajouter l'auteur sélectionné si absent
  useEffect(() => {
    const fetchSelectedAuthor = async () => {
      if (!value || authors.some((a) => a.value === value)) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/authors/${value}`
        );
        const author = response.data;

        const formatted = {
          label: `${author.title ? author.title + " " : ""}${author.name} ${
            author.surname
          }`,
          value: author.id,
        };

        setAuthors((prev) => [...prev, formatted]);
      } catch (error) {
        console.error("Failed to fetch selected author:", error);
      }
    };

    fetchSelectedAuthor();
  }, [value, authors]);

  // Fetch filtré selon la searchbar
  useEffect(() => {
    setLoading(true);

    const fetchAuthors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/authors/search`,
          {
            params: { search: searchTerm, page: 1, limit: 9999 },
          }
        );

        const mapped = response.data.results.map((author) => ({
          label: `${author.title ? author.title + " " : ""}${author.name} ${
            author.surname
          }`,
          value: author.id,
        }));

        setAuthors(mapped);
      } catch (error) {
        console.error("Failed to fetch authors:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchAuthors, 400);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleFilter = (e) => {
    setSearchTerm(e.filter);
  };

  return (
    <Dropdown
      value={value}
      options={authors}
      onChange={(e) => onChange(e.value)}
      placeholder={placeholder}
      filter
      showClear
      disabled={disabled}
      style={{ minWidth: "250px" }}
      loading={loading}
      onFilter={handleFilter}
      emptyMessage={loading ? "Loading authors..." : "No authors found"}
    />
  );
}
