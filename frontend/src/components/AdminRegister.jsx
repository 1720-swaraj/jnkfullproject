import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser, FaPhone, FaHome,
  FaEnvelope, FaLock, FaImage
} from "react-icons/fa";

export default function AdminRegister() {

  const [formData, setFormData] = useState({
    adminName: "",
    adminPhoneNo: "",
    adminAddress: "",
    adminEmail: "",
    adminPassword: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Image required ❌");
      return;
    }

    const data = new FormData();

    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    data.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/admin/register",
        data
      );

      toast.success(res?.data?.message || "Registered ✅");

      setFormData({
        adminName: "",
        adminPhoneNo: "",
        adminAddress: "",
        adminEmail: "",
        adminPassword: ""
      });

      setPreview(null);
      setImage(null);
      fileRef.current.value = "";

    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed ❌");
    }
  };

  return (
    <form className="modernForm" onSubmit={handleSubmit}>

      <div className="inputGroup">
        <FaUser className="icon" />
        <input name="adminName" value={formData.adminName} onChange={handleChange} placeholder="Full Name" required />
      </div>

      <div className="inputGroup">
        <FaPhone className="icon" />
        <input name="adminPhoneNo" value={formData.adminPhoneNo} onChange={handleChange} placeholder="Phone" required />
      </div>

      <div className="inputGroup">
        <FaHome className="icon" />
        <textarea name="adminAddress" value={formData.adminAddress} onChange={handleChange} placeholder="Address" required />
      </div>

      <div className="inputGroup">
        <FaEnvelope className="icon" />
        <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} placeholder="Email" required />
      </div>

      <div className="inputGroup">
        <FaLock className="icon" />
        <input type="password" name="adminPassword" value={formData.adminPassword} onChange={handleChange} placeholder="Password" required />
      </div>

      <div className="fileUpload">
        <FaImage />
        <input type="file" onChange={handleImageChange} ref={fileRef} />
      </div>

      {preview && <img src={preview} className="previewImg" />}

      <button className="primaryBtn">Register</button>

    </form>
  );
}