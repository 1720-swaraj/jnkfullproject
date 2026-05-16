import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminRegister from "./AdminRegister";
import "./Admin.css";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // 🔒 Disable background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // ❌ Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  return (
    <div className="adminOverlay" onClick={() => navigate("/")}>
      <div
        className="adminModal"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* CLOSE */}
        <span className="closeBtn" onClick={() => navigate("/")}>
          ✕
        </span>

        <h2 className="adminTitle">Admin Panel</h2>

        {/* TOGGLE */}
        <div className="tabSwitch">
          <div className={`slider ${activeTab === "register" ? "move" : ""}`} />

          <button
            className={activeTab === "login" ? "activeTab" : ""}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>

          <button
            className={activeTab === "register" ? "activeTab" : ""}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        <div className="formArea">
          {activeTab === "login" ? <AdminLogin /> : <AdminRegister />}
        </div>
      </div>
    </div>
  );
}