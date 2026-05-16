// import './App.css'
// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import Header from "./components/Header";
// import TopSection from "./components/TopSection";
// import Navbar from "./components/Navbar";
// import Heading from "./components/Heading";
// import FormSection from "./components/FormSection";
// import Footer from "./components/Footer";
// import AdminDashboard from "./components/AdminDashboard";
// import AdminPage from "./components/AdminPage";
// import SectionPage from "./components/SectionPage";

// function HomePage() {
//   return (
//     <>
//       <TopSection />
//       <Heading />
//       <FormSection />
//     </>
//   );
// }

// function Layout() {
//   const location = useLocation();

//   // ✅ FIXED
//   const isDashboard = location.pathname.startsWith("/dashboard");

//   return (
//     <>
//       {!isDashboard && <Header />}

//       {!isDashboard && (
//         <div className="container">
//           <Navbar />
//         </div>
//       )}

//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/admin" element={<AdminPage />} />
//         <Route path="/dashboard" element={<AdminDashboard />} />
      
//         <Route path="/section/:sectionId" element={<SectionPage />} />
//       </Routes>

//       {!isDashboard && <Footer />}
//     </>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Layout />

//       {/* ✅ ONLY ONE GLOBAL TOAST */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//         theme="colored"
//       />
//     </BrowserRouter>
//   );
// }
// export default App;



import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import {
  ToastContainer
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import {
  useEffect,
  useState
} from "react";

import Header from "./components/Header";
import TopSection from "./components/TopSection";
import Navbar from "./components/Navbar";
import Heading from "./components/Heading";
import FormSection from "./components/FormSection";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import AdminPage from "./components/AdminPage";
import SectionPage from "./components/SectionPage";
import Download from "./components/Download";
/* ✅ IMPORT LOADER */

import Loader from "./components/Loader";

function HomePage() {

  return (
    <>
      <TopSection />
      <Heading />
      <FormSection />
    </>
  );
}

function Layout() {

  const location = useLocation();

  /* ✅ Loader State */

  const [loading, setLoading] =
    useState(true);

  /* ✅ Loader For Every Page */

  useEffect(() => {

    setLoading(true);

    const timer = setTimeout(() => {

      setLoading(false);

    }, 1000);

    return () => clearTimeout(timer);

  }, [location.pathname]);

  /* ✅ Dashboard Check */

  const isDashboard =
    location.pathname.startsWith("/dashboard");

  /* ✅ SHOW LOADER */

  if (loading) {
    return <Loader />;
  }

  return (
    <>

      {!isDashboard && <Header />}

      {!isDashboard && (
        <div className="container">
          <Navbar />
        </div>
      )}

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/admin"
          element={<AdminPage />}
        />

  <Route path="/downloads" element={<Download />} />

        <Route
          path="/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/section/:sectionId"
          element={<SectionPage />}
        />

      </Routes>

      {!isDashboard && <Footer />}

    </>
  );
}

function App() {

  return (
    <BrowserRouter>

      <Layout />

      {/* ✅ GLOBAL TOAST */}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

    </BrowserRouter>
  );
}

export default App;