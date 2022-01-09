import axios from "axios";
import React from "react";
import "./App.css";
import { useCookies } from "react-cookie";

const SSO_SERVER_BE = process.env.REACT_APP_API;
const SSO_SERVER_FE = process.env.REACT_APP_SSO_FE;
const PORT = process.env.PORT;

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [logged, setLogged] = React.useState(false);
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log(cookies);
        if (!cookies) {
          return setLogged(false);
        }

        const response = await axios.get(SSO_SERVER_BE, {
          params: {
            serviceUrl: window.location.origin,
          },
          // withCredentials: true,
          headers: {
            setCookie: `token=${cookies.token}`,
            // Cookie: `token=123123;`,
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
    removeCookie("token");
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
