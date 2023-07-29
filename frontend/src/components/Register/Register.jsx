import React, { useState } from "react";
import axios from "axios";

export default function Register({ toggleLogin }) {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const register = () => {
    const { username, email, password, reEnterPassword } = user;
    if (!username || !email || !password || !reEnterPassword) {
      alert("Please fill in all fields!");
    } else if (password !== reEnterPassword) {
      alert("Re-Entered password does not match with the password!");
    } else {
      axios
        .post("http://localhost:5000/register", user)
        .then((res) => {
          alert(res.data.message);
          toggleLogin();
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            alert(error.response.data.error);
          } else {
            alert("Registration failed, Please try again later!");
          }
          console.error(error);
        });
    }
  };

  return (
    <div className="form">
      <div className="form-heading">
        <h1 id="other-state" onClick={toggleLogin}>
          Login
        </h1>
        <h1>|</h1>
        <h1 id="current-state">Register</h1>
      </div>
      <input
        type="username"
        name="username"
        value={user.username}
        onChange={handleChange}
        placeholder="Enter Name"
      />
      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Enter Email"
      />
      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="Enter Password"
      />
      <input
        type="password"
        name="reEnterPassword"
        value={user.reEnterPassword}
        onChange={handleChange}
        placeholder="Re-Enter Password"
      />
      <div className="button" onClick={register}>
        Register
      </div>
    </div>
  );
}
