import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/helper';
import { useParams } from 'react-router-dom';

function Book() {
    const [bookData, setBookData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');

    useEffect(() => {
        fetchBookData();
        fetchMembers();
    },[]);
    const isbn = useParams()['*'];
    const fetchBookData = () => {
        axios.get(`${api}/book/${isbn}`)
            .then(response => {
                setBookData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching book data:', error);
                setIsLoading(false);
            });
    };


    const fetchMembers = () => {
      axios.get(`${api}/members`)
        .then(response => {
          setMembers(response.data);
        })
        .catch(error => {
          console.error('Error fetching members:', error);
        });
    };
  
    const handleIssue = (event) => {
      event.preventDefault();
      if (selectedMember && bookData.bookID) {
        const requestData = {
          member_id: selectedMember,
          book_id: bookData.bookID
        };
  
        axios.post(`${api}/issue-book`, requestData)
          .then(response => {
            alert(response.data.message);
            setSelectedMember('');
            window.location.reload();
          })
          .catch(error => {
            console.error('Error issuing book:', error);
          });
      }
    };

    return (
        <div className="book-details">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className='container'>
                    <h2>{bookData.title}</h2>
                    <hr></hr>
                    <h4><b>book details:</b></h4>
                    <p><b>Author:</b> {bookData.authors}</p>
                    <p><b>Rent:</b> ₹{bookData.rent}</p>
                    <p><b>isbn:</b> {bookData.isbn}</p>
                    <p><b>average rating:</b> {bookData.average_rating}</p>
                    <p><b>publication date:</b> {bookData.publication_date}</p>
                    <p><b>publisher:</b> {bookData.publisher}</p>
                    <form onSubmit={handleIssue} style={{ textAlign: "center" }}>
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
                        <button type="submit" className='bton'>Issue Book</button>
                    </form>
                    <p></p>
                </div>
            )}
        </div>
    );
}

export default Book;
