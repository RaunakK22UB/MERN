// src/layout/Header.js
import { Link } from "react-router-dom";

function Header() {
    return (
        // 🟢 Earlier: Just a plain div with centered links
        // ✅ Now: Using Bootstrap navbar for better layout and design
        <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom border-body">
            <div className="container-fluid">
                {/* 🟢 Earlier: Just a Link with "Home" text */}
                {/* ✅ Now: Styled as navbar-brand */}
                <Link className="navbar-brand" to="/">
                   A-Links
                </Link>

                {/* ✅ Toggle button for responsive navbar */}
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

                {/* ✅ Navbar Links section */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* 🟢 Earlier: simple <br> based layout */}
                    {/* ✅ Now: Proper nav list */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/login">
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;




//------------------------------------Last changes 
// import { Link } from "react-router-dom";

// function Header() {
//     return (
//         <>
//             <div className="container-fluid text-center">
//                 <Link to="/">Home</Link>
//                 <br></br>
//                 <Link to="/login">Login</Link>
//                 <br></br>
//                 <Link to="/register">Register</Link>
//             </div>
//         </>
//     );
// }

// export default Header;
