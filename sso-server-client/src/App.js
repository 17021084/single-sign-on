import React from "react";
import "./App.css";
import axios from "axios";

const SSO_SERVER_BE = process.env.REACT_APP_API;
const allowedOrigins = [
  "http://localhost:3000", // cho domain ngoại lai
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",

  // xet alias o
  "http://service.diffent-company.com", // localhost 3000
  "http://service1.company.com",
  "http://service2.company.com",
  "http://service3.company.com",
];

const parseParams = () => {
  var params = {};

  if (window.location.search) {
    var parts = window.location.search.substring(1).split("&");

    for (var i = 0; i < parts.length; i++) {
      var nv = parts[i].split("=");
      if (!nv[0]) continue;
      params[nv[0]] = nv[1] || true;
    }
  }
  return params;
};

function App() {
  const [logged, setLogged] = React.useState(false);
  const [auth, setAuth] = React.useState({
    username: "",
    password: "",
  });
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${SSO_SERVER_BE}login`, auth);
      document.cookie = `token=${response?.data?.token};`;
      const serviceUrl = parseParams()?.serviceUrl;
      if (serviceUrl && allowedOrigins.includes(serviceUrl)) {
        return (window.location.href = serviceUrl);
      }
      setLogged(true);
    } catch (error) {}
  };

  const logout = () => {
    document.cookie = "token=";
    setLogged(false);
  };

  // G
  if (logged) {
    return (
      <div className="App">
        <h1>Go to service </h1>
        {allowedOrigins.map((origin, index) => (
          <a key={index} href={origin}>
            {origin} <br />
            <br />
            <br />
          </a>
        ))}
        <button onClick={logout}> Logout </button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1> SSO-SERVER </h1>
      <form>
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
          <button type="submit" onClick={handleLogin}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
