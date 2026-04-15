import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="bg-neutral-50 border-b border-neutral-200 px-4 sm:px-8 lg:px-12 py-4 sm:py-6">
                <Header />
            </div>
            <main className="flex-1 bg-[#f2e5e5] px-4">
                <Outlet />
            </main>
            <div className="mt-0">
                <Footer />
            </div>
        </div>
    );
}
export default MainLayout;