import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="bg-neutral-50 border-b border-neutral-200 px-4 sm:px-8 lg:px-12 py-4 sm:py-6">
                <Header />
            </div>
            <main className="flex-1 bg-white px-4 sm:px-8 lg:px-12">
                <Outlet />
            </main>
        </div>
    );
}
export default MainLayout;