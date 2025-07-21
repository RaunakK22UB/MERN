import App from "../App";
import Footer from "./Footer";
import Header from "./Header";

function AppLayout({ children }) {
    return (
        <>
        <div className="d-flex flex-column" style={{ height: '100vh', overflow: 'hidden' }}>
            <Header />

            { children }

            <Footer/>
        </div>
        </>
    );
}

export default AppLayout;
