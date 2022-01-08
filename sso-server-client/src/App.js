import React from "react";
import "./App.css";
import axios from "axios";

const SSO_SERVER_BE = process.env.REACT_APP_API


function App() {
  const [auth, setAuth] = React.useState({
    username: "",
    password: "",
  });
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${SSO_SERVER_BE}login`, auth);
      console.log("responseee", response?.data);
    } catch (error) {}
  };

  return (
    <div className="App">
      <h1> SSO-SERVER </h1>
      <div>
        <div>Username:</div>
        <input
          onChange={(e) => {
            setAuth((pre) => {
              return { ...pre, username: e.target.value };
            });
          }}
        />
        <div>Password:</div>
        <input
          onChange={(e) => {
            setAuth((pre) => {
              return { ...pre, password: e.target.value };
            });
          }}
        />
        <div>Submit: </div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default App;
