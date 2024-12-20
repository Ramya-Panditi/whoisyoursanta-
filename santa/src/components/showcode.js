import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const RoomPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {}; 
  
  const [roomcode, setRoomcode] = useState(data?.roomcode || "");  
  const [copySuccess, setCopySuccess] = useState(false); 
  
  const handleCopy = () => {
    navigator.clipboard.writeText(roomcode)
      .then(() => {
        setCopySuccess(true); 
        // setTimeout(() => setCopySuccess(false), 3000); 
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        setCopySuccess(false); 
      });
  };

  return (
    <div className='container-fluid'>
      <div className="bg-success text-center p-3">
        <h2>Welcome to the Santa Party</h2>
      </div>
      <div className='tree'>
        <div className="branch"></div>
        <div className="branch2"></div>
        <div className="branch3"></div>
        <div className='trunk'></div>
        <div className="giftbox d-flex flex-wrap justify-content-between align-content-between">
          <div className='box'></div>
          <div className='box'></div>
          <div className='box'></div>
          <div className='box'></div>
        </div>
        <div className='bow d-flex'>
          <div className='bow1'></div>
          <div className='bow2'></div>
        </div>
      </div>
      <div className='dialog-box container-fluid d-flex flex-column'>
        <h3>This is the room code. Share it with your friends</h3>
         <button
         className="btn btn-outline-success my-2"
         onClick={()=>{handleCopy()}}
       >
         Copy Code to Clipboard
       </button>
        {copySuccess && <button onClick = {()=> navigate("/")}className=" btn btn-outline-success mt-2">Join room</button>}
        
        <p className="mt-2">Now you can paste the room code and send it to your friends!</p>
      </div>
    </div>
  );
};

export default RoomPage;
