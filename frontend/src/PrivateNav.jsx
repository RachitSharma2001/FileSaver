import React from "react";
import { Link, withRouter }  from "react-router-dom";

function PrivateNav(props) {
  return (
    <div className="navigation">
      <nav class="navbar navbar-expand navbar-dark bg-dark">
        <div class="container">
          <Link class="navbar-brand" to="/">
            Save My Files
          </Link>

          <div>
            <ul class="navbar-nav ml-auto">
              <li
                class={`nav-item  ${
                  props.location.pathname === "/home" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/home">
                  My Files
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/help" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/help">
                  Help
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/signout" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/signout">
                    Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
export default withRouter(PrivateNav);
