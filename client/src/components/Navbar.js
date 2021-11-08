import React from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { logoutUser } from '../actions/auth'; 

const  Navbar = ({ auth: {isAuthenticated, loading}, logoutUser}) =>  {


  return (
    <>
      <nav className="navbar bg-dark">
        <h1>
          <Link to="/">
            <i className="fas fa-code"></i> developerHUB
          </Link>
        </h1>
        <ul>
          <li>
            <Link to="profiles.html">Developers</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          {!loading && (
            <li>
            {!isAuthenticated ? (
              <Link to="/login">Login</Link>
            ):(
              <i onClick={logoutUser} className='fas fa-sign-out-alt'><span className='hide-sm'>Logout</span></i>
            )}
          </li>
          )}
        </ul>
      </nav>
    </>
  );
}


Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
 auth: PropTypes.bool
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, {logoutUser})(Navbar)