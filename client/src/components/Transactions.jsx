import React, { useState, useEffect } from 'react';
import { api } from '../services/helper';// Import the CSS file for styling

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(`${api}/get-latest-transactions`);
        console.log(response);
        const data = await response.json();
        if (response.ok) {  
          setTransactions(data.transactions);
        } else {
          console.error('Failed to fetch transactions:', response.message);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2 style={{textAlign:"center"}}>Pending Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Member</th>
            <th>Book</th>
            <th>Amount</th>
            <th>Date Issued</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.transaction_id}>
              <td>{transaction.transaction_id}</td>
              <td>{transaction.member_name}</td>
              <td>{transaction.book_title}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;

