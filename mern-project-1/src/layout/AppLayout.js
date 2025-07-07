import App from "../App";
import Footer from "./Footer";
import Header from "./Header";

function AppLayout({ children }) {
    return (
        <>
        <div className="d-flex flex-column min-vh-100">
            <Header />

            { children }

            <Footer/>
        </div>
        </>
    );
}

export default AppLayout;
