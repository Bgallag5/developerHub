import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { loginUser } from "../actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Login = ({ loginUser, isAuthenticated }) => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formState;
    loginUser({ email, password });
  };

  if (isAuthenticated) {
    console.log("REDIRECTED");
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container">
      <h1 className="large text-primary"> Login </h1>{" "}
      <p className="lead">
        <i className="fas fa-user"> </i> Sign In To Your Account{" "}
      </p>{" "}
      <form
        className="form"
        action="create-profile.html"
        onSubmit={handleFormSubmit}
      >
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formState.email}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={formState.password}
            onChange={handleFormChange}
          />{" "}
        </div>{" "}
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>{" "}
      <p className="my-1">
        Don 't have an account? <Link to="/register">Create Account</Link>{" "}
      </p>{" "}
    </section>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { loginUser })(Login);
