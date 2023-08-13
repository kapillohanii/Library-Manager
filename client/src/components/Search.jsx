import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../services/helper';

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchQuery = event.target.searchQuery.value;
    handleSearchFocus();
    axios.get(`${api}/search?query=${searchQuery}`)
      .then(response => {
        setSearchResults(response.data);
      })
      .catch(error => {
        console.error('Error searching:', error);
      });
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true); // Show search results when input is focused
  };

  const handleSearchBlur = () => {
    // Hide search results when input loses focus
    setIsSearchFocused(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="Input"
          type="text"
          name="searchQuery"
          placeholder="Enter search term"
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          style={{ marginRight: 0 }}
        />
        <button type="submit" className="bton" style={{ marginLeft: 0 }}>
          Search
        </button>
      </form>
      {isSearchFocused && ( // Only show search results when input is focused
        <div id="search-results">
          {searchResults.map((result, index) => (
            <p key={index}>{result.title}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
