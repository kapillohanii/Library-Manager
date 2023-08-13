import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/helper';

function Members() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    axios.get(`${api}/members`)
      .then(response => {
        setMembers(response.data);
      })
      .catch(error => {
        console.error('Error fetching members:', error);
      });
  };

  const addMember = () => {
    const memberName = prompt('Enter the name of the member');
    if (memberName) {
      axios.post(`${api}/members`, { name: memberName })
        .then(response => {
          alert(response.data.message);
          fetchMembers();
          window.location.reload();
        })
        .catch(error => {
          console.error('Error adding member:', error);
        });
    }
  };

  const updateMember = (id, newName) => {
    axios.put(`${api}/members/${id}`, { name: newName })
      .then(response => {
        alert(response.data.message);
        fetchMembers();
        window.location.reload();

      })
      .catch(error => {
        console.error('Error updating member:', error);
      });
  };

  const deleteMember = (id) => {
    axios.delete(`${api}/members/${id}`)
      .then(response => {
        alert(response.data.message);
        fetchMembers();
        window.location.reload();
      })
      .catch(error => {
        console.error('Error deleting member:', error);
      });
  };

  return (
    <div>
        <h2 style={{textAlign:"center"}}>Members <button onClick={addMember} className='bton'>Add Member</button></h2>   
      <div id="member-list">
        {members.map((member, index) => (
          <div key={index}>
            <hr></hr>
            <p><b>{member.name}</b>
              <div>
                <button onClick={() => updateMember(member.id, prompt('Enter new name:'))} className='bton' style={{ fontSize: '14px', margin: '5px' }}>Update</button>
                <button onClick={() => deleteMember(member.id)} className='bton red' style={{ fontSize: '14px', margin: '5px' }}>Delete</button>
              </div>
            </p>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Members;
