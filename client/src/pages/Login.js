import React, { useState }  from "react";
import { Link } from "react-router-dom";



export default function Login() {
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
    const {email, password } = formState;
    // password !== confirmPassword
    //   ? setAlert("Passwords do not match", "danger")
    //   : register({ username, email, password });
    if (password && email) {
      console.log("no match password");
    } else {
      console.log("success");
    }
  };

  //   if (isAuthenticated) {
  //     //  redirect to homepage with direct Homepage return
  //     return <Redirect to="/dashboard" />;
  //   }

  return (
    <section className="container">
      <h1 className="large text-primary">Login</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign In To Your Account
      </p>
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
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Create Account</Link>
      </p>
    </section>
  );
}

