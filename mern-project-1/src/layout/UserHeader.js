// src/layout/UserHeader.js
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Can from "../rbac/Can";


function UserHeader() {
  // ✅ Access user details from Redux store
  const userDetails = useSelector((state) => state.userDetails);

  return (
    <nav
      className="navbar navbar-expand-lg bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container">
        {/* Brand Link */}
        <Link className="navbar-brand" to="/dashboard">
          Dashboard
        </Link>

        {/* Toggler for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Navigation items */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Left-side (empty for now) */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* You can add links here if needed */}
          </ul>

          {/* Right-side user dropdown */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userDetails ? userDetails.name : <>Account</>}
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                   <Link className="dropdown-item" to="/logout">
                    LogOut
                  </Link>
                 </li>
                 <Can permission="canViewUser">
                 <li>
                  
                  <Link className="dropdown-item" to="/manageUsers">
                    manage Users
                  </Link>
                
                </li>
                  </Can>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default UserHeader;
