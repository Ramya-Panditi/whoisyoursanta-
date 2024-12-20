import './App.css';
import RoomGenerate from './components/roomgenerate';
import Showcode from './components/showcode';
import Landing from './components/landing';
import Drawnames from './components/drawnames';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Finaldraw from './components/finaldraw';


function App() {
  return (
    <div className="App">
      <HashRouter>
        <div className="container-fluid">
            {/* <Landing /> */}
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/create" element={<RoomGenerate />} />
              <Route path="/showcode" element={<Showcode />} />
              <Route path="/drawnames" element={<Drawnames />} />
              <Route path="/finaldraw" element={<Finaldraw />} />
            </Routes>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
