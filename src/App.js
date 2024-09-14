import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/forms/Login";
import Register from "./pages/forms/Register";
import DashboardLayout from "./pages/admin-dashboard/DashboardLayout";
import ProductsPage from "./pages/admin-dashboard/ProductsPage";
import ContactPage from "./pages/admin-dashboard/ContactPage";
import PartnerPage from "./pages/admin-dashboard/PartnerPage";
import UserPage from "./pages/admin-dashboard/UserPage";
import AwardPage from "./pages/admin-dashboard/AwardsPage";

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route path="partner" element={<PartnerPage />} />
          <Route path="product" element={<ProductsPage />} />
          <Route path="award" element={<AwardPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="user" element={user?.isSuperAdmin ? <UserPage /> : <Navigate to="/dashboard" />} />
        </Route>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;






// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/forms/Login";
// import Register from "./pages/forms/Register";
// import DashboardLayout from "./pages/admin-dashboard/DashboardLayout";
// import ProductsPage from "./pages/admin-dashboard/ProductsPage";
// import ContactPage from "./pages/admin-dashboard/ContactPage";
// import PartnerPage from "./pages/admin-dashboard/PartnerPage";
// import UserPage from "./pages/admin-dashboard/UserPage";

// function App() {
//   return (
//     <BrowserRouter >
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<DashboardLayout />}>
//           <Route path="partner" element={<PartnerPage />} />
//           <Route path="product" element={<ProductsPage />} />
//           <Route path="contact" element={<ContactPage />} />
//           <Route path="user" element={<UserPage />} />

//         </Route>
//         <Route path="/" element={<Login />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
