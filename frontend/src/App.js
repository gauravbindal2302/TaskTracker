import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Main from "./components/Main/Main"; // Import the Main component

function App() {
  const [token, setToken] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const toggleRegister = () => {
    setShowRegister(!showRegister);
  };

  const handleLogin = (userToken) => {
    setToken(userToken);
  };

  return (
    <>
      {token ? (
        <Main />
      ) : (
        <div className="app">
          <div className="row">
            <div className="col">
              <div className="col-1">
                <Link to="/">
                  <h1>TaskTracker</h1>
                </Link>
                <p>
                  An Application that allows you to add tasks for your daily
                  activities. The app enables users to plan and organize their
                  tasks effectively, ensuring a productive day ahead. You can
                  customize your daily schedule in this app, specifying tasks
                  for office work, meetings, study time, exercise, lunch, and
                  any other activities you have planned. Additionally, you can
                  set task priorities.
                </p>
              </div>
            </div>
            <div className="col">
              <div className="col-2">
                {showRegister ? (
                  <Register toggleLogin={toggleRegister} />
                ) : (
                  <Login
                    handleLogin={handleLogin}
                    toggleRegister={toggleRegister}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
