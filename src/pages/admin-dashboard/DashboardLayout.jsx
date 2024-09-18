import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };
    return (
        <div>
            <Sidebar isOpen={sidebarOpen} />
            <main className="main-content position-ab max-height-vh-100 h-100 border-radius-lg " >
                <Navbar />
                <div className="container-fluid py-4">
                    <Outlet />
                    <Footer />
                </div>
            </main>



        </div>
    )
}

export default DashboardLayout