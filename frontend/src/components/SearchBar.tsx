import { ChangeEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  placeholder?: string;
  handleSearch: (term: ChangeEvent<HTMLInputElement>) => void;
}
const SearchBar = ({searchTerm,placeholder,handleSearch}:SearchBarProps) => {
  return (
    <div>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => handleSearch(e)}
        className="input input-bordered text-base-content focus:ring-primary mb-6 w-full max-w-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
