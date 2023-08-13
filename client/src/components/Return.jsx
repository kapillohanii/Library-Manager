import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/helper';

function Return() {
  const [membersForReturning, setMembersForReturning] = useState([]);
  const [booksForReturning, setBooksForReturning] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedBook, setSelectedBook] = useState('');

  useEffect(() => {
    fetchMembersForReturning();
  }, []);

  const fetchMembersForReturning = () => {
    axios.get(`${api}/members`)
      .then(response => {
        setMembersForReturning(response.data);
      })
      .catch(error => {
        console.error('Error fetching members for returning:', error);
      });
  };

  const fetchBooksForReturning = (memberId) => {
    if (memberId) {
      axios.get(`${api}/books-issued/${memberId}`)
        .then(response => {
          setBooksForReturning(response.data);
        })
        .catch(error => {
          console.error('Error fetching books for returning:', error);
        });
    } else {
      setBooksForReturning([]); // Clear the book list if no member is selected
    }
  };
  
  const handleReturn = (event) => {
    event.preventDefault();
    if (selectedMember && selectedBook) {
      const requestData = {
        member_id: selectedMember,
        book_id: selectedBook
      };

      axios.post(`${api}/return-book`, requestData)
        .then(response => {
          alert(response.data.message);
          fetchMembersForReturning();
          setSelectedMember('');
          setSelectedBook('');
          window.location.reload();
        })
        .catch(error => {
          console.error('Error returning book:', error);
        });
    }
  };

  return (
    <div>
      <h2 style={{textAlign:"center"}}>Return a Book</h2>
      <form onSubmit={handleReturn} style={{textAlign:"center"}}>
        <select
          className='Select'
          value={selectedMember}
          onChange={e => {
            setSelectedMember(e.target.value);
            fetchBooksForReturning(e.target.value);
          }}
        >
          <option value="">Select Member</option>
          {membersForReturning.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
        <select
          className='Select'
          value={selectedBook}
          onChange={e => setSelectedBook(e.target.value)}
        >
          <option value="">Select Book</option>
          {booksForReturning.map(book => (
            <option key={book.bookID} value={book.bookID}>{book.title}</option>
          ))}
        </select>
        <button type="submit" className='bton'>Return Book</button>
      </form>
    </div>
  );
}

export default Return;
