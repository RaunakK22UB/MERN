// src/layout/Header.js
import { Link } from "react-router-dom";
import ASCIIText from "../components/ASCIIText"; // ✅ Make sure path is correct

function Header() {
  return (
    <nav
      className="navbar navbar-expand-lg p-3 shadow-sm border-bottom"
      style={{
        backgroundColor: 'transparent', // ✅ Transparent navbar
        backdropFilter: 'blur(10px)',   // ✅ Frosted glass effect
        boxShadow: 'none',
        position: 'relative',
        zIndex: 10,                    // ✅ Ensure navbar is above animations
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* 🔵 Brand Name replaced with ASCIIText */}
        <div style={{ height: '50px', width: '200px', position: 'relative' }}>
          <ASCIIText
            text="insyte"
            enableWaves={true}
            asciiFontSize={10}    // ✅ Adjust size as needed
            textFontSize={120}    // ✅ Bigger font for header
          />
        </div>

        {/* 🔵 Responsive Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 🔵 Navbar Links */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-3">
            <li className="nav-item">
              <Link className="nav-link fw-semibold fs-5" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold fs-5" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold fs-5" to="/register">
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


// // src/layout/Header.js
// import { Link } from "react-router-dom";

// function Header() {
//     return (
//         // 🟢 Earlier: Just a plain div with centered links
//         // ✅ Now: Using Bootstrap navbar for better layout and design
//         <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom border-body">
//             <div className="container-fluid">
//                 {/* 🟢 Earlier: Just a Link with "Home" text */}
//                 {/* ✅ Now: Styled as navbar-brand */}
//                 <Link className="navbar-brand" to="/">
//                    A-Links
//                 </Link>

//                 {/* ✅ Toggle button for responsive navbar */}
//                 <button
//                     className="navbar-toggler"
//                     type="button"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#navbarSupportedContent"
//                     aria-controls="navbarSupportedContent"
//                     aria-expanded="false"
//                     aria-label="Toggle navigation"
//                 >
//                     <span className="navbar-toggler-icon" />
//                 </button>

//                 {/* ✅ Navbar Links section */}
//                 <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                     {/* 🟢 Earlier: simple <br> based layout */}
//                     {/* ✅ Now: Proper nav list */}
//                     <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                         <li className="nav-item">
//                             <Link className="nav-link active" aria-current="page" to="/">
//                                 Home
//                             </Link>
//                         </li>
//                         <li className="nav-item">
//                             <Link className="nav-link active" aria-current="page" to="/login">
//                                 Login
//                             </Link>
//                         </li>
//                         <li className="nav-item">
//                             <Link className="nav-link" to="/register">
//                                 Register
//                             </Link>
//                         </li>
//                     </ul>
//                 </div>
//             </div>
//         </nav>
//     );
// }

// export default Header;




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
