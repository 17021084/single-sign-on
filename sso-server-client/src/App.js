import React from "react";
import "./App.css";
import axios from "axios";
import { useCookies } from "react-cookie";

const SSO_SERVER_BE = process.env.REACT_APP_API;
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",

  // xet alias etc
  "http://service.diffent-company.trung:3000",
  "http://service1.company.trung:3001",
  "http://service2.company.trung:3002",
  "http://service3.company.trung:3003",
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

// company.trung:5000
function App() {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [logged, setLogged] = React.useState(false);
  const [auth, setAuth] = React.useState({
    username: "",
    password: "",
  });
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${SSO_SERVER_BE}login`, auth);
      // document.cookie = `token=${response?.data?.token};`;
      setCookie("token", response?.data?.token, {
        path: "/",
        domain: ".company.trung",
      });
      const serviceUrl = parseParams()?.serviceUrl;
      if (serviceUrl && allowedOrigins.includes(serviceUrl)) {
        return (window.location.href = serviceUrl);
      }
      setLogged(true);
    } catch (error) {}
  };

  const logout = () => {
    removeCookie('token', {
      domain: "company.trung",
    });
    // co the dung document.cookie=""
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
