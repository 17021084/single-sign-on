import axios from "axios";
import React from "react";
import "./App.css";

const SSO_SERVER_BE = process.env.REACT_APP_API;
const SSO_SERVER_FE = process.env.REACT_APP_SSO_FE;
const PORT = process.env.PORT;


const parseCookies = (cookies) => {
  if (!cookies) return null;
  let listCookies = {};
  cookies?.split(";")?.forEach((cookie) => {
    let splitCookie = cookie.split("=");
    listCookies[splitCookie[0]] = splitCookie[1];
  });
  return listCookies;
};

function App() {
  const [logged, setLogged] = React.useState(false);
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const cookies = parseCookies(document.cookie);
        if (!cookies.token) {
          return setLogged(false);
        }
        const response = await axios.get(SSO_SERVER_BE, {
          params: {
            serviceUrl: window.location.origin,
          },
          withCredentials: true,
          headers: {
            Cookie: `token=${cookies.token};`,
          },
        });

        setUser(response.data.user);
        setLogged(true);
      } catch (error) {
        setLogged(false);
        console.log("error", error);
      }
    };
    checkAuth();
  }, []);

  const goToSSO = () => {
    window.location.href = `${SSO_SERVER_FE}?serviceUrl=${window.location.origin}`;
  };
  const logout = () => {
    document.cookie = "token=";
    setLogged(false);
  };

  if (logged) {
    return (
      <div className="App">
        <h1> Authenticated Component </h1>
        <h2>Domain: {window.location.host} </h2>
        =====================
        <h1>Hello: </h1>
        <h3>{user?.name}</h3>
        <h3>{user?.age} years old</h3>
        <button onClick={logout}> Logout </button>
      </div>
    );
  }
  return (
    <div className="App">
      <h1> Unauthorize ! </h1>
      <h2> you must login before access our resources</h2>
      <h2>Domain: {window.location.hostname} </h2>
      <h3>PORT : {PORT} </h3>
      <h4> Go to SSO login </h4>
      <button onClick={goToSSO}> Click here</button>
    </div>
  );
}

export default App;
