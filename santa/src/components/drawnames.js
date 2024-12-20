import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import URL from '../links';

const Drawnames = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // console.log(location.state);
    const { group  } = location.state || {}; 
    const { undrawn } = location.state || []; 
    const { draws } = location.state || []; 
   
    console.log(draws);
   
    
   
    const sendMessage = async()=>{
        const yourMapping = draws[selectedValue];
        const email = group.filter((mem) => mem.name === selectedValue).map((mem) => mem.email);
        const data = {
            email:email,
            subject: "Secret santa. Shhh!!",
            message:  `Hooray you are the santa for ${yourMapping}`
        }
        try{
            const res = await axios.post(`${URL}/sendMessage`,data);
            console.log(res);
        }
        catch(error){
            alert("Mail not sent. " + error.message);
        }

    }
    const [selectedValue, setSelectedValue] = useState('');
    const [error,setError] = useState("");
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        setError('');
        
        
    };

    const handleDraw = () => {
        if (!undrawn) {
            setError('Error: No undrawn list found.');
            return;
        }
        if(undrawn.includes(selectedValue)){
            navigate("/finaldraw", { state: { selectedValue } });
        }
        else{
            setError("You have already drawn a name. Would like to your drawn name to be sent to your email?");
        }
        
    };
    

    return (
        <div className="container-fluid">
           <div className="bg-success text-center p-3">
                <Link to="/" className="no-decoration">
                    <h2>Welcome to the Santa Party</h2>
                </Link>
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
                <div className="dialog-box-head">
                    <h5>Which one of them are you??</h5>
                </div>
                    <div className='my-3'>
                        <label htmlFor="dropdown" className='form-label'>Choose an option:</label>
                        <select id="dropdown" value={selectedValue} onChange={handleChange} className='form-control'>
                                    <option key={0} value="">
                                        select
                                    </option>
                            {group && group.length > 0 ? (
                                group.map((val, index) => (
                                    <option key={index} value={val.name}>
                                        {val.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No participants available</option>
                            )}
                        </select>
                       
                    </div>
                        {selectedValue && !error  && (
                            <button className="btn btn-danger" onClick={handleDraw}>
                                Next
                            </button>)

                        }
                        {error && <p>{error}</p>}
                        {error && <button className = "btn btn-danger"onClick={sendMessage}>Send</button>}
            </div>
        </div>
    );
};

export default Drawnames;
