import React, { Fragment } from 'react';
//now Routes, no longer Switch
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
//Redux
import { Provider } from 'react-redux';
import store from './store';

import Alert from './components/Alert';
import Landing from './components/Landing';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';





function App() {




  return (
    <Provider store={store}>
    <Router>
      <Navbar/>


    <Alert />
      <Routes>
        <Route  path='/' element={<Landing />} />
        <Route  path='/login' element={<Login />} />
        <Route  path='/register' element={<Register />} />
      </Routes>

    </Router>
    </Provider>
  );
}

export default App;