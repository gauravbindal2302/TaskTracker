import React, { useState } from "react";
import axios from "axios";

export default function Login({ toggleRegister, handleLogin }) {
  const [user, setUser] = useState({
    email: "",
    password: "",
    forgotPassword: "",
  });

  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setUser({
      email: "",
      password: "",
      forgotPassword: "",
    });
  };

  const login = () => {
    const { email, password, forgotPassword } = user;

    if (forgotPasswordMode && email && forgotPassword) {
      // If in forgotPasswordMode, update the password
      axios
        .post("http://localhost:5000/reset-password", {
          email,
          newPassword: forgotPassword,
        })
        .then((res) => {
          alert(res.data.message);
          setForgotPasswordMode(false); // Reset forgotPasswordMode to false after successful update
          resetForm(); // Reset the form
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            alert(error.response.data.error);
          } else {
            alert("Password update failed. Please try again later.");
          }
          console.error(error);
        });
    } else if (!forgotPasswordMode && email && password) {
      // If not in forgotPasswordMode, perform regular login
      axios
        .post("http://localhost:5000/login", user)
        .then((res) => {
          handleLogin(res.data.token);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            alert(error.response.data.error);
          } else {
            alert("Login failed. Please try again later.");
          }
          resetForm();
          console.error(error);
        });
    } else {
      alert("Please fill in all fields!");
    }
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordMode(true);
  };

  return (
    <div className="form">
      <div className="form-heading">
        <h1 id="current-state">Login</h1>
        <h1>|</h1>
        <h1 id="other-state" onClick={toggleRegister}>
          Register
        </h1>
      </div>
      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Enter Email"
      />
      {forgotPasswordMode ? (
        <div className="forgot">
          <label id="forgot-label">New Password</label>
          <input
            name="forgotPassword"
            value={user.forgotPassword}
            onChange={handleChange}
            type="password"
            placeholder="Enter New Password"
          />
        </div>
      ) : (
        <input
          name="password"
          value={user.password}
          onChange={handleChange}
          type="password"
          placeholder="Enter your Password"
        />
      )}
      <div className="button" onClick={login}>
        {forgotPasswordMode ? "Submit" : "Login"}
      </div>
      {!forgotPasswordMode && (
        <div className="forgot-password">
          <button onClick={handleForgotPasswordClick}>Forgot Password</button>
        </div>
      )}
    </div>
  );
}
