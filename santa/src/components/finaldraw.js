import React, { useEffect, useState } from 'react';
import { Link, Links, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import URL from '../links';

const Finaldraw = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const drawFor = location.state?.selectedValue || "";
    const [message,setMessage] = useState("");
    
    const [groupdata,setGroupData] = useState(null);
    const [chosen,setChosen] = useState("");

    const roomcode = localStorage.getItem("roomcode");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res  = await axios.get(`${URL}/check/${roomcode}`);
                setGroupData(res.data);
            } catch (error) {
                alert("ERROR:", error.message); 
            }
        };
        
        fetchData(); 
    }, [roomcode]); 
  
    const draw = async () => {
        const undrawn = groupdata.undrawn;
        const groupno = undrawn.length;
      
        console.log(groupdata.draws);
        const pairMap = new Map();
        if(Object.keys(groupdata.draws).length !== 0){
            console.log("you already have mappings");
            setChosen(groupdata.draws[drawFor]);
            console.log(groupdata.draws[drawFor]);
            const updateundrawn = undrawn.filter((mem) => mem !== drawFor);
            console.log(updateundrawn + " after drawing");
            const data = {
                roomcode: roomcode,
                undrawn: updateundrawn
            };
            try {
                const res = await axios.post(`${URL}/update-undrawn`, data);
                console.log(res);
                console.log("Undrawn updated successfully");
            } catch (error) {
                alert(error.message);
            }

        }
        else{
            console.log("lets mapp");
            pair(groupdata.undrawn,pairMap);
            console.log( pairMap);
            setChosen(pairMap.get(drawFor));
            const updateundrawn = undrawn.filter((mem) => mem != drawFor);
            console.log(updateundrawn + "after drwaing");
            const data = {
                roomcode:roomcode,
                draws :Object.fromEntries(pairMap),
                undrawn :updateundrawn
            }
            try{
                const res = await axios.post(`${URL}/add-draws`,data);
                console.log(res);
                console.log("Updated the map");
            }
            catch (error) {
                    alert(error.message);
            }


        }
        
    };
    const sendEmail = async()=>{
        const email = groupdata.group.filter((mem) => mem.name === chosen).map((mem) => mem.email);
        const data = {
            email:email,
            subject: "I am your secret santa. Shhh!!",
            message:message 
        }
        try{
            const res = await axios.post(`${URL}/sendMessage`,data);
            alert("Sent successfully");
            console.log(res);
        }
        catch(error){
            alert("Mail not sent. " + error.message);
        }

    }
    const pair = (undrawn,pairMap) => {
        const drawnSet = new Set();
       
    
        for (let i = 0; i < undrawn.length; i++) {
            let ran = getRandom(undrawn.length);
            while(undrawn[ran] == undrawn[i] || drawnSet.has(undrawn[ran])){
                ran = getRandom(undrawn.length);
            }
    
            drawnSet.add(undrawn[ran]);
            pairMap.set(undrawn[i], undrawn[ran]);
        }
    
        console.log("pair map in pais  " + pairMap); 
        return;
    };
    
    const getRandom = (len) => {
        return Math.floor(Math.random() * len);
    }
    

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
                    <h5>YOU ARE THE SECRET SANTA FOR</h5>
                </div>
                    {!chosen && <button className='btn btn-outline-danger m-2' onClick={()=> draw()}>Get</button>}
                    {chosen && <h2 className='text-success m-2'>{chosen}</h2>}
                    {chosen && 
                        <div>
                            <textarea 
                                placeholder={`Would you like to send any message to ${chosen}?`} 
                                className="form-control"
                                onChange={(e)=>setMessage(e.target.value)}
                            ></textarea>
                            {message && <button className='btn btn-outline-success m-2' onClick={sendEmail}>Send</button>}

                        </div>
                       
                    }



                  
            </div>
        </div>
    );
};

export default Finaldraw;
