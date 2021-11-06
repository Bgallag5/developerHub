import React, { Fragment } from 'react';
//now Routes, no longer Switch
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

import Landing from './components/Landing';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';





function App() {




  return (
    <Router>

      <Navbar/>


      <Routes>
        <Route  path='/' element={<Landing />} />
        <Route  path='/login' element={<Login />} />
        <Route  path='/register' element={<Register />} />
      </Routes>
      
    </Router>
  );
}

export default App;
