import Props from "../interface/Props";
import Menu from "./menu";

const Layout = ({ children }: Props) => 
(
    <div className="container layout-container">
        <Menu />
        {children}
    </div>
);

export default Layout;