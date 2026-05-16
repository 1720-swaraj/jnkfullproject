import { useState, useRef } from "react";
import "./FormSection.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaMobileAlt, FaEnvelope, FaCalendarAlt, FaVenusMars, FaCity, FaHome, FaImage } from "react-icons/fa";
export default function FormSection() {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ REF for file input
  const fileInputRef = useRef(null);

  // ✅ VALIDATION
  const validate = () => {
    if (!fullName.trim()) return "Full name required";
    if (!email.includes("@")) return "Invalid email";
    if (!/^[0-9]{10}$/.test(mobileNumber)) return "Mobile must be 10 digits";
    if (!dateOfBirth) return "Select date of birth";
    if (!gender) return "Select gender";
    if (!city.trim()) return "City required";
    if (!image) return "Image required";
    return "";
  };

  // ✅ HANDLE IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ API CALL
  const addUsers = async () => {

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const formData = new FormData();

    formData.append("fullName", fullName.trim());
    formData.append("email", email.trim());
    formData.append("mobileNumber", mobileNumber.trim());
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("gender", gender);
    formData.append("city", city.trim());
    formData.append("address", address.trim());
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:8080/api/user/addUser", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "User Registered Successfully ✅");

        console.log("User:", data.user);
        console.log("Image URL:", data.imageUrl);

        // ✅ RESET FORM
        setFullName("");
        setEmail("");
        setMobileNumber("");
        setDateOfBirth("");
        setGender("");
        setCity("");
        setAddress("");
        setImage(null);
        setPreview(null);

        // ✅ CLEAR FILE INPUT (FIXED)
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

      } else {
        toast.error(data.message || data);
      }

    } catch (e) {
      console.error(e);
      toast.error("Backend not reachable ❌");
    }
  };

  return (
    <div className="formContainer">

      {/* LEFT FORM */}
      <div className="formLeft">
        <h2>Registration Form</h2>

       {/* Full Name */}
<div className="formGroup">
  <label><FaUser /> Full Name</label>
  <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
</div>

{/* Mobile */}
<div className="formGroup">
  <label><FaMobileAlt /> Mobile</label>
  <input value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
</div>

{/* Email */}
<div className="formGroup">
  <label><FaEnvelope /> Email</label>
  <input value={email} onChange={(e) => setEmail(e.target.value)} />
</div>

{/* DOB */}
<div className="formGroup">
  <label><FaCalendarAlt /> Date of Birth</label>
  <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
</div>

{/* Gender */}
<div className="formGroup">
  <label><FaVenusMars /> Gender</label>
  <select value={gender} onChange={(e) => setGender(e.target.value)}>
    <option value="">Select</option>
    <option>Male</option>
    <option>Female</option>
  </select>
</div>

{/* City */}
<div className="formGroup">
  <label><FaCity /> City</label>
  <input value={city} onChange={(e) => setCity(e.target.value)} />
</div>

{/* Address */}
<div className="formGroup">
  <label><FaHome /> Address</label>
  <textarea value={address} onChange={(e) => setAddress(e.target.value)} />
</div>

{/* Image */}
<div className="formGroup">
  <label><FaImage /> Upload Image <span className="img_upload">*max 2MB</span></label>

  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    ref={fileInputRef}
  />
</div>
        {/* PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{ width: "120px", marginBottom: "10px", borderRadius: "8px" }}
          />
        )}

        <button className="submitBtn" onClick={addUsers}>
          Submit
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="formRight">

        <div className="infoCard">
          <h3>Contact Info</h3>
          <p>Fill the form to register user details.</p>

          <iframe
            src="https://www.youtube.com/embed/TuC7RgHevNE"
            title="YouTube tutorial"
            allowFullScreen
          ></iframe>
        </div>

        <div className="instructions">

  {/* ENGLISH */}
  <h4>How To Register?</h4>

  <p>1) Please fill up the form and click on submit button.</p>
  <p>2) Full Name and Mobile field is compulsory.</p>
  <p>
    By filling up the form, you agree with the terms and conditions of
    Janlok Pratishthan Sanghatana.
  </p>

  <hr />

  {/* MARATHI */}
  <h4>नोंदणी कशी करावी?</h4>

  <p>1) कृपया फॉर्म भरून सबमिट बटणावर क्लिक करा.</p>
  <p>2) पूर्ण नाव आणि मोबाईल नंबर आवश्यक आहे.</p>
  <p>
    फॉर्म भरून आपण जनलोक प्रतिष्ठान संघटना यांच्या अटी व शर्तींशी सहमत आहात.
  </p>

</div>

      </div>

    </div>
  );
}