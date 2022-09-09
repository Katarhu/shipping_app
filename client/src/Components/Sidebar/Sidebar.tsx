import './Sidebar.scss';
import {memo} from "react";
import {NavLink} from "react-router-dom";
import {BiUser} from 'react-icons/bi';
import {IoIosChatbubbles} from 'react-icons/io';
import {GiChest} from 'react-icons/gi';
import {useNavbar} from "../../Context/NavbarContext";
import {useAppSelector} from "../../Hooks/redux";
import {getRole} from "../../Redux/reducers/auth/authSlice";
import {ImTruck} from 'react-icons/im';
import {MdOutlineAssignmentTurnedIn} from 'react-icons/md';

function Sidebar() {
    const {isNavbarOpen} = useNavbar();
    const role = useAppSelector(getRole);

    const activeStyles = {
        background: 'rgba(128, 128, 128, 0.25)',
    }

    return (
        <aside className={`aside ${isNavbarOpen ? 'toggled' : ''}`}>
            <ul className="aside__links">
                <li>
                    <NavLink to={"/loads"}
                             className="aside__link"
                             style={({isActive}) =>
                                 isActive ? activeStyles : {}
                             }>
                        <GiChest/> {role === 'SHIPPER' ? 'My loads' : 'Loads'}
                    </NavLink>
                </li>
                {role === 'DRIVER' &&
                    <li>
                        <NavLink to="/trucks"
                                 className="aside__link"
                                 style={({isActive}) =>
                                     isActive ? activeStyles : {}
                                 }>
                            <ImTruck/> My trucks
                        </NavLink>
                    </li>
                }
                {role === 'DRIVER' &&
                    <li>
                        <NavLink to="/assigned-loads"
                                 className="aside__link"
                                 style={({isActive}) =>
                                     isActive ? activeStyles : {}
                                 }>
                            <MdOutlineAssignmentTurnedIn/> Assigned loads
                        </NavLink>
                    </li>
                }
                <li>
                    <NavLink to="/chats"
                             className="aside__link"
                             style={({isActive}) =>
                                 isActive ? activeStyles : {}
                             }>
                        <IoIosChatbubbles/> Chats
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profile"
                             className="aside__link"
                             style={({isActive}) =>
                                 isActive ? activeStyles : {}
                             }>
                        <BiUser/> Profile
                    </NavLink>
                </li>
            </ul>
        </aside>
    )
}

export default memo(Sidebar);