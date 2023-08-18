import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/helper';

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [blurTimeout, setBlurTimeout] = useState(null);

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
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    // Set a timeout before hiding the search results
    setBlurTimeout(
      setTimeout(() => {
        setIsSearchFocused(false);
      }, 250) // 0.25 second delay
    );
  };

  // Clear the timeout when the component unmounts or when form is submitted
  useEffect(() => {
    return () => {
      clearTimeout(blurTimeout);
    };
  }, [blurTimeout]);

  return (
    <div>
      <form id='search-box' onSubmit={handleSubmit}>
        <input
          className="Input"
          id='search-input'
          type="text"
          name="searchQuery"
          placeholder="Enter search term"
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          style={{ marginRight: 0 }}
        />
        <button type="submit" className="bton" id="search-button" style={{ marginLeft: 0 }}>
          Search
        </button>
      </form>
      {isSearchFocused && (
        <div id="search-results">
          {searchResults.map((result, index) => (
            <p key={index}><a href={"/book/" + result.isbn} className='book-card'>{result.title}</a></p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
