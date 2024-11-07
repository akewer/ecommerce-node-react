import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ControlSidebar from "./ControlSidebar"

function BackOffice(prop) {
    return<>
    <div className='wrapper'>
        <Sidebar />
        <Navbar />
        <div className='content-wrapper p-2'>
            {prop.children}
        </div>      
        <Footer />
        <ControlSidebar />
    </div>
    </>
}
export default BackOffice;
