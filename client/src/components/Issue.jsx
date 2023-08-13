import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/helper';

function Issue() {
  const [members, setMembers] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedBook, setSelectedBook] = useState('');

  useEffect(() => {
    fetchMembers();
    fetchAvailableBooks();
  },[]);

  const fetchMembers = () => {
    axios.get(`${api}/members`)
      .then(response => {
        setMembers(response.data);
      })
      .catch(error => {
        console.error('Error fetching members:', error);
      });
  };

  const fetchAvailableBooks = () => {
    axios.get(`${api}/books`)
      .then(response => {
        setAvailableBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching available books:', error);
      });
  };

  const handleIssue = (event) => {
    event.preventDefault();
    if (selectedMember && selectedBook) {
      const requestData = {
        member_id: selectedMember,
        book_id: selectedBook
      };

      axios.post(`${api}/issue-book`, requestData)
        .then(response => {
          alert(response.data.message);
          fetchAvailableBooks();
          setSelectedMember('');
          setSelectedBook('');
          window.location.reload();
        })
        .catch(error => {
          console.error('Error issuing book:', error);
        });
    }
  };

  return (
    <div  >
      <h2 style={{textAlign:"center"}}>Issue a Book</h2>
      <form onSubmit={handleIssue} style={{textAlign:"center"}}>
        <select
          className='Select'
          value={selectedMember}
          onChange={e => setSelectedMember(e.target.value)}
        >
          <option value="">Select Member</option>
          {members.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
        <select
          className='Select'
          value={selectedBook}
          onChange={e => setSelectedBook(e.target.value)}
        >
          <option value="">Select Book</option>
          {availableBooks.map(book => (
            <option key={book.bookID} value={book.bookID}>{book.title}</option>
          ))}
        </select>
        <button type="submit" className='bton'>Issue Book</button>
      </form>
    </div>
  );
}

export default Issue;
