import {createContext, ReactNode, useContext, useState} from "react";

interface INavbarContext {
    isNavbarOpen: boolean;
    toggleNavbar: () => any;
}

interface NavbarProviderProps {
    children: ReactNode;
}

const NavbarContext = createContext({} as INavbarContext);

export function useNavbar() {
    return useContext(NavbarContext);
}


export function NavbarContextProvider({children}: NavbarProviderProps) {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    function toggleNavbar() {
        setIsNavbarOpen(isOpen => !isOpen);
    }

    return (
        <NavbarContext.Provider value={{
            toggleNavbar,
            isNavbarOpen
        }}>
            {children}
        </NavbarContext.Provider>
    )
}