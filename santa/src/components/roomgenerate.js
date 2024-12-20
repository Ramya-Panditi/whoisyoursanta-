import React, { useState } from 'react';
import URL from '../links';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';

const RoomGenerate = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([{ name: '', email: '' }, { name: '', email: '' }, { name: '', email: '' }]);
  const [roomcode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const addField = () => {
    setMembers([...members, { name: '', email: '' }]);
  };

  const generateRoomCode = () => {
    let res = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    const len = chars.length;
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * len));
    }
    return res;
  };

  const sendEmail = async () =>{
    const emaildata = {
      roomcode: roomcode, 
      group: members
        
    };
  
    try{
      const response = await axios.post(`${URL}/sendEmail`,emaildata);
      console.log(response);

    }
    catch(error){
      console.log(error.message);
    }

  }



  const generate = async (e) => {
    e.preventDefault();

    
    for (const m of members) {
      if (!m.name.trim() || !m.email.trim()) {
        setError('All names and emails must be filled');
        return;
      }
    }
    setError('');

    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);

    const data = {
      roomcode: newRoomCode,
      group: members,
    };

    try {
     
      const response = await axios.post(`${URL}/add`, data);
      console.log(response);
   
      sendEmail();
      navigate('/showcode', { state: { data } });
    } catch (error) {
      console.error('Error:', error);
      setError(error.response ? error.response.data.error : 'Something went wrong');
    }
  };

  const handleChange = (index, field, value) => {
    const changed = members.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    setMembers(changed);
  };

  return (
    <div className="container-fluid">
      <div className="bg-success text-center p-3">
        <h2>Welcome to the Santa Party</h2>
      </div>
      <div className="tree">
                <div className="branch"></div>
                <div className="branch2"></div>
                <div className="branch3"></div>
                <div className="trunk"></div>
                <div className="giftbox d-flex flex-wrap justify-content-between align-content-between">
                    <div className="box"></div>
                    <div className="box"></div>
                    <div className="box"></div>
                    <div className="box"></div>
                </div>
                <div className="bow d-flex">
                    <div className="bow1"></div>
                    <div className="bow2"></div>
                </div>
            </div>
      <div className="dialog-box container-fluid">
        <form className="d-flex justify-content-center flex-column align-items-center p-4 bg-light rounded shadow-sm">
          <table>
            <tbody>
              {members.map((member, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={member.name}
                      onChange={(e) =>
                        handleChange(index, 'name', e.target.value)
                      }
                      placeholder={`Member ${index + 1} Name`}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      className="form-control"
                      value={member.email}
                      onChange={(e) =>
                        handleChange(index, 'email', e.target.value)
                      }
                      placeholder={`Member ${index + 1} Email`}
                    />
                  </td>
                  <td>
                    {index === members.length - 1 && (
                      <button
                        type="button"
                        onClick={addField}
                        className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px' }}
                      >
                        <i className="fa-solid fa-user-plus" style={{ fontSize: '18px' }}></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <button
              className="btn btn-danger"
              onClick={(e) => {
                generate(e);
              }}
            >
              Generate Room
            </button>
            {error && <p className="text-danger mt-3">{error}</p>}
            {roomcode && <p>Room Code: {roomcode}</p>}
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomGenerate;
