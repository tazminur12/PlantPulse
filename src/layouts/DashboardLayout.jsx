import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaLeaf, FaUserAlt } from "react-icons/fa";
import { useState } from "react";
import useAuth from "../hooks/useAuth"; // ✅ make sure this hook returns { user, logOut }

const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logOut } = useAuth(); // ✅ get user info and logout function

    const handleLogout = async () => {
        await logOut();
        navigate("/"); // redirect to home
    };

    return (
        <div className="min-h-screen flex bg-base-200">
            {/* Sidebar */}
            <div className={`bg-white shadow-lg w-64 p-4 hidden md:flex flex-col justify-between`}>
                <div>
                    <h2
                        onClick={() => navigate("/")}
                        className="text-2xl font-bold text-primary mb-6 cursor-pointer hover:underline"
                    >
                        🌿 PlantPulse
                    </h2>
                    <nav className="space-y-4">
                        <NavLink to="/dashboard" className="flex items-center gap-3 p-2 rounded hover:bg-primary hover:text-white">
                            <FaHome /> Dashboard
                        </NavLink>
                        <NavLink to="/dashboard/all" className="flex items-center gap-3 p-2 rounded hover:bg-primary hover:text-white">
                            <FaLeaf /> All Items
                        </NavLink>
                        <NavLink to="/dashboard/add" className="flex items-center gap-3 p-2 rounded hover:bg-primary hover:text-white">
                            <FaPlus /> Add Item
                        </NavLink>
                        <NavLink to="/dashboard/my" className="flex items-center gap-3 p-2 rounded hover:bg-primary hover:text-white">
                            <FaUserAlt /> My Items
                        </NavLink>

                    </nav>
                </div>
                {user && (
                    <div className="mt-10 flex items-center gap-3">
                        <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
                        <button onClick={handleLogout} className="btn btn-sm btn-error">Logout</button>
                    </div>
                )}
            </div>

            {/* Mobile Drawer Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button onClick={() => setIsOpen(!isOpen)} className="btn btn-primary">
                    ☰ Menu
                </button>
                {isOpen && (
                    <div className="absolute top-12 bg-white p-4 rounded shadow-lg w-56 space-y-3">
                        <NavLink to="/dashboard" className="block" onClick={() => setIsOpen(false)}>🏠 Dashboard</NavLink>
                        <NavLink to="/dashboard/all" className="block" onClick={() => setIsOpen(false)}>🌱 All Items</NavLink>
                        <NavLink to="/dashboard/add" className="block" onClick={() => setIsOpen(false)}>➕ Add Item</NavLink>
                        <NavLink to="/dashboard/my" className="block" onClick={() => setIsOpen(false)}>👤 My Items</NavLink>
                        {user && (
                            <button onClick={handleLogout} className="btn btn-sm btn-error w-full mt-2">Logout</button>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
