import React from "react";
import "./navbar.css"

export default function Navbar() {
    const isLoggedIn = window.localStorage.getItem("token");
    const userId = window.localStorage.getItem("user_id")
    const logOut = () =>{
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user_id');
    }
    
    if (isLoggedIn) {
        return (
            <nav className="navigation">
                <a href="/" className="brand-name">
                  Acebook
                </a>
                
                <div className="navigation-menu">
                   <ul>
                   <li id="1">
                      <a href = "/posts"  >Feed</a>
                      
                    </li>
                    <li id="2">
                      <a href = {"/user/"+ userId}  >Profile</a>
                      
                    </li>
                    <li id="3">
                      <a href = "/" onClick={logOut} >Log Out</a>
                      
                    </li>
                    </ul>
                </div>
            </nav>
        );
    }
    else{
        return (
            <nav className="navigation">
              <a href="/" className="brand-name">
              Acebook
              </a>
              
              <div
                className="navigation-menu">
                <ul>
                  <li>
                    <a href="/signup">Sign Up</a>
                  </li>
                  <li>
                    <a href="/login">Login</a>
                  </li>
                </ul>
              </div>
            </nav>
          );
    }
}