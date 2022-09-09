import Navbar from "./Navbar/Navbar";

interface LayoutProps {
    children: JSX.Element;
}

function Layout({children}: LayoutProps) {
    return (
        <>
            <Navbar/>
            {children}
        </>
    )
}

export default Layout;