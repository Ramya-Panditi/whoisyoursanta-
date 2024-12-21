import React, { useState } from 'react'
import '../App.css';
import { useNavigate,Link } from 'react-router-dom';
import axios from "axios"
import URL from '../links';


const Landing = () => { 
    const navigate = useNavigate();
    
    const [clickjoin,setClickJoin] = useState(false);   
    const [code,setCode] = useState('');
    const create = ()=>{
        navigate("/create");
    }
    axios.defaults.withCredentials = true;
    const joinroom =  async ()=>{
     
        if(!clickjoin){
            setClickJoin(true);
            return;
        }
        console.log(code);
        // const data  = {roomcode:code};
        try{
            const res = await axios.get(`${URL}/check/${code}`);
            console.log(res);
            if(res.status === 404){
                alert("No such room is available. Create a room first");
                navigate("/create");
            }
            else{
                console.log(res.data);
                navigate("/drawnames", { state: res.data });
                localStorage.setItem("roomcode",code);

            }
        }
        catch(error){
            console.log(error);
        }




    }
    return <div className='container-fluid '>
       <div className="bg-success text-center p-3">
                <Link to="/" className="no-decoration">
                    <h2>Welcome to the Santa Party</h2>
                </Link>
            </div>
        <div className='tree'>
            <div className = "branch"></div>
            <div className = "branch2"></div>
            <div className = "branch3"></div>
            <div className='trunk'></div>
            <div className = "giftbox d-flex flex-wrap justify-content-between align-content-between">
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
        <div className='dialog-box container-fluid'>
            <div className='dialog-box-head'>
                <h5>Play yet?</h5>
            </div>
            <div><p>Draw names for your secret santa. Create room if you haven't.<br/>
                 Join room if you already got the code</p></div>
            <div className='d-flex flex-column gap-2'>
                <button onClick= {()=> create()} className='btn btn-outline-primary'>Create room</button>
                {clickjoin && (
                    <input
                        type='text'
                        placeholder='Enter room code'
                        className='form-control'
                        value={code} 
                        onChange={(e) => setCode(e.target.value)}
                    />
                )}
                <button onClick = {()=> joinroom()} className='btn btn-outline-primary'>Join room</button>
            </div>
        </div>
        

        

    </div>
}

export default Landing;