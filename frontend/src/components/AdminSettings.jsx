import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminSetting.css";
import {
  FaUserCircle,
  FaCamera,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,

} from "react-icons/fa";

export default function AdminSettings() {

  const [admin, setAdmin] = useState(null);
  const [form, setForm] = useState({
    adminName: "",
    adminEmail: "",
    adminPhoneNo: "",
    adminAddress: ""
    
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const data = localStorage.getItem("admin");
    if (!data) return;

    const parsed = JSON.parse(data);
    setAdmin(parsed);

    setForm({
      adminName: parsed.adminName || "",
      adminEmail: parsed.adminEmail || "",
      adminPhoneNo: parsed.adminPhoneNo || "",
      adminAddress: parsed.adminAddress || ""
    });

    if (parsed.adminImage) {
      setPreview(`http://localhost:8080/api/images/${parsed.adminImage}`);
    }
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateAdmin = async () => {
    try {
      const formData = new FormData();

      formData.append("adminId", admin.adminId);
      formData.append("adminName", form.adminName);
      formData.append("adminEmail", form.adminEmail);
      formData.append("adminPhoneNo", form.adminPhoneNo);
      formData.append("adminAddress", form.adminAddress);

      if (image) formData.append("image", image);

      const res = await axios.put(
        "http://localhost:8080/api/admin/update",
        formData
      );

      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      toast.success("Profile Updated ✅");

    } catch {
      toast.error("Update failed ❌");
    }
  };

  return (
    <div className="settingsPage">

      {/* 🔥 PROFILE HEADER */}
      <div className="profileHeader">

        <div className="avatarBox">
          {preview ? (
            <img src={preview} alt="admin" />
          ) : (
            <FaUserCircle />
          )}

          <div className="cameraIcon" onClick={() => fileRef.current.click()}>
            <FaCamera />
          </div>

          <input type="file" ref={fileRef} onChange={handleImage} hidden />
        </div>

        <div className="profileInfo">
          <h3>{form.adminName || "Admin Name"}</h3>
          <p>{form.adminEmail}</p>
        </div>

      </div>

      {/* 🔥 SETTINGS LIST */}
      <div className="settingsList">

        <div className="sectionTitle">Account</div>

        <div className="settingItem">
          <FaUserCircle />
          <input
            value={form.adminName}
            onChange={(e) => setForm({...form, adminName: e.target.value})}
            placeholder="Name"
          />
         
        </div>

        <div className="settingItem">
          <FaEnvelope />
          <input
            value={form.adminEmail}
            onChange={(e) => setForm({...form, adminEmail: e.target.value})}
            placeholder="Email"
          />
          
        </div>

        <div className="sectionTitle">Contact</div>

        <div className="settingItem">
          <FaPhone />
          <input
            value={form.adminPhoneNo}
            onChange={(e) => setForm({...form, adminPhoneNo: e.target.value})}
            placeholder="Phone"
          />
          
        </div>

        <div className="settingItem">
          <FaMapMarkerAlt />
          <input
            value={form.adminAddress}
            onChange={(e) => setForm({...form, adminAddress: e.target.value})}
            placeholder="Address"
          />
         
        </div>

      </div>

      {/* 🔥 SAVE BUTTON */}
      <button className="saveBtn" onClick={updateAdmin}>
        Save Changes
      </button>

    </div>
  );
}