import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    adminEmail: "",
    adminPassword: ""
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/admin/login",
        null,
        { params: loginData }
      );

      toast.success(res?.data?.message || "Login Successful ✅");

      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Login Failed ❌");
    }
  };

  return (
    <form className="modernForm" onSubmit={handleSubmit}>

      <div className="inputGroup">
        <FaEnvelope className="icon" />
        <input
          type="email"
          name="adminEmail"
          placeholder="Enter Email"
          onChange={handleChange}
          required
        />
      </div>

      <div className="inputGroup">
        <FaLock className="icon" />
        <input
          type="password"
          name="adminPassword"
          placeholder="Enter Password"
          onChange={handleChange}
          required
        />
      </div>

      <button className="primaryBtn">Login</button>

    </form>
  );
}