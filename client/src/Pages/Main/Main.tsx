import {useNavbar} from "../../Context/NavbarContext";
import Sidebar from "../../Components/Sidebar/Sidebar";
import './Main.scss';

function Main() {

    return (
        <div className="layout-container">
            <Sidebar/>
            <div className="main">
                <h1 className="main__title">Hello, welcome to shipment app, to navigate use side menu</h1>
            </div>
        </div>
    )
}

export default Main;