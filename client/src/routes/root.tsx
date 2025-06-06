import Footer from "@/components/navigation/Footer.tsx";
import Navbar from "@/components/navigation/Navbar";
import {Outlet} from "react-router";

export default function Root() {
    return (
        <div className="layout-page">
            <div>
                <Navbar />
            </div>
            <div className="main">
                <Outlet />
            </div>
            <div>
                <Footer />
            </div>
        </div>

    )
}
