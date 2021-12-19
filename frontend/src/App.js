import { React, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Home from './Home.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Help from './Help.jsx';
import Signout from './Signout.jsx';
import PublicNav from './PublicNav.jsx';
import PrivateNav from './PrivateNav.jsx';

function App(){
  // Get the token that is stored in browser history
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
  }
  
  // Set token saved in browser as react hook
  const [token, setToken] = useState(getToken());
  const backendUrl = "http://127.0.0.1:8000/";

  // Function called when user signs in successfully
  const saveToken = (userToken) => {
    // Store user information in browser
    localStorage.setItem('token', JSON.stringify(userToken));
    // Trigger react hook so page reloads to user home screen
    setToken(userToken);
  };

  // Function called to sign user out
  const clearToken = () => {
    // Clear local storage
    localStorage.clear();
    // Reset token -> triggers react to reload, causing sign in page to appear
    setToken(getToken());
  }

  // If the token does not exist, prompt the user to sign in
  if(!token){
    return (<div className="PublicView"> 
      <Router> 
        <PublicNav/>
        <Route path="/signup"> <Signup url={backendUrl}/> </Route>
        <Route path="/home"> <Login givenUrl={backendUrl} saveTokenFunc={saveToken}/> </Route>
      </Router>
    </div>);
  }

  return (
    <div className="UserView">
      <Router>
        <PrivateNav/>
        <Route path="/home"> <Home userId={getToken()}/> </Route>
        <Route path="/help"> <Help/> </Route>
        <Route path="/signout"> <Signout clearToken={clearToken}/> </Route>
      </Router>
    </div>
  )
}

export default App;