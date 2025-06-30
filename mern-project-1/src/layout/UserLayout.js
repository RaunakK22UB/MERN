// src/layout/UserLayout.js
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

// ✅ This layout wraps logged-in views with a consistent header and footer
function UserLayout({ children }) {
  return (
    <>
      {/* Top Navbar for logged-in users */}
      <UserHeader />

      {/* Page content (like Dashboard, Error, etc.) */}
      {children}

      {/* Bottom Footer */}
      <UserFooter />
    </>
  );
}

export default UserLayout;
