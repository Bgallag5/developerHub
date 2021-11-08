import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
// import { setAlert } from "../../actions/alert";
// import { register } from "../../actions/auth";
import { setAlert } from "../actions/alert";
import PropTypes from "prop-types";
import axios from 'axios';
import { registerUser } from '../actions/auth';


const Register = ({ setAlert, registerUser, isAuthenticated }) => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleFormChange = (e) => {
    //destructure properties on target
    const { name, value } = e.target;
    //set formState on targeted field: value
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formState;
    if (password !== confirmPassword){
        // sends message, and type (type for css styles)
        setAlert('Passwords must match', 'danger')
    } else {
        console.log('success');
        registerUser({username, email, password})
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form
        className="form"
        action="create-profile.html"
        onSubmit={handleFormSubmit}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="username"
            value={formState.username}
            onChange={handleFormChange}
            // required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formState.email}
            onChange={handleFormChange}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            // minLength="6"
            value={formState.password}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            // minLength="6"
            value={formState.confirmPassword}
            onChange={handleFormChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
};


Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})


//export statement that connects redux; what we EXPORT in connect (i.e. setAlert), we have access to in PROPS on THIS component
export default connect(mapStateToProps, {setAlert, registerUser})(Register);
