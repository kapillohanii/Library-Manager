import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/helper';

function Books() {
  const [books, setBooks] = useState([]);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newRent, setNewRent] = useState('');
  const [importTitle, setImportTitle] = useState('');
  const [importAuthor, setImportAuthor] = useState('');
  const [importNumBooks, setImportNumBooks] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios.get(`${api}/books`)
      .then(response => {
        setBooks(response.data.reverse());
        
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  };

  const importBooks = (e) => {
    e.preventDefault(); // Prevent the default form submission
    const apiUrl = `${api}/import-books`;

    const queryParams = {
      title: importTitle,
      authors: importAuthor,
      num_books: importNumBooks
    };
    if (queryParams.num_books === '') {
      alert('Number of Books field cannot be empty.');
    }
    else {
      axios.get(apiUrl, { params: queryParams })
        .then(response => {
          const importedBooks = response.data.books;
          if (Array.isArray(importedBooks) && importedBooks.length > 0) {
            alert(`Imported ${importedBooks.length} Books!`);
            window.location.reload();
          } else {
            alert('No books matching the criteria were found.');
          }

          setImportTitle('');
          setImportAuthor('');
          setImportNumBooks('');
        })
        .catch(error => {
          console.error('Error importing books:', error);
        });
    }
  };


  const addBook = () => {
    axios.post(`${api}/books`, {
      title: newBookTitle,
      authors: newBookAuthor,
      rent: newRent
    })
      .then(response => {
        alert(response.data.message);
        fetchBooks();
        setNewBookTitle('');
        setNewBookAuthor('');
        setNewRent('');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error adding book:', error);
      });
  };

  const updateRent = (id, newRent) => {
    axios.put(`${api}/books/${id}`, { rent: newRent })
      .then(response => {
        alert(response.data.message);
        fetchBooks();
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating rent:', error);
      });
  };

  const deleteBook = (id) => {
    axios.delete(`${api}/books/${id}`)
      .then(response => {
        alert(response.data.message);
        fetchBooks();
        window.location.reload();
      })
      .catch(error => {
        console.error('Error deleting book:', error);
      });
  };

  return (
    <div>
      <h2 style={{textAlign:'center'}}>Books</h2>
      <div id="member-list">
        <form onSubmit={importBooks}>
          <input
            type="text"
            placeholder="Title"
            className='Input'
            value={importTitle}
            onChange={e => setImportTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            className='Input'
            value={importAuthor}
            onChange={e => setImportAuthor(e.target.value)}
          />
          <input
            type="number"
            placeholder="Number of Books"
            className='Input'
            value={importNumBooks}
            onChange={e => setImportNumBooks(e.target.value)}
          />
          <button type="submit" className='bton'>Import Books</button>
        </form>
      </div>
      <div id="member-list">
        <input
          type="text"
          placeholder="Title"
          className='Input'
          value={newBookTitle}
          onChange={e => setNewBookTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          className='Input'
          value={newBookAuthor}
          onChange={e => setNewBookAuthor(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rent"
          className='Input'
          value={newRent}
          onChange={e => setNewRent(e.target.value)}
        />
        <button onClick={addBook} className='bton'>Add Book</button>
      </div>
      {/* <div id="book-list">
        {books.map((book, index) => (
          <p key={index}>
            <b>{book.title}</b> by <b>{book.authors}</b> for <i>Rs.{book.rent}</i>
            <div>
              <button onClick={() => updateRent(book.bookID, prompt('Change rent to:'))} className='bton' style={{ fontSize: '14px', margin: '5px' }}>Change Rent</button>
              <button onClick={() => deleteBook(book.bookID)} className='bton' style={{ fontSize: '14px', margin: '5px' }}>Delete</button>
            </div>
          </p>
        ))}
      </div> */}
      <div>
        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Rent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index}>
                <td>{book.title}</td>
                <td>{book.authors}</td>
                <td>Rs. {book.rent}</td>
                <td className="book-actions">
                  <button onClick={() => updateRent(book.bookID, prompt('Change rent to:'))} className='bton'>Change Rent</button>
                  <button onClick={() => deleteBook(book.bookID)} className='bton red'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Books;




