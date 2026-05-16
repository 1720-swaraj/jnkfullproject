import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {

  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const location = useLocation();
  const menuRef = useRef();

  // ✅ FETCH SECTIONS
  useEffect(() => {
    axios.get("http://localhost:8080/api/section/all")
      .then(res => setSections(res.data))
      .catch(err => console.log(err));
  }, []);

  // ✅ CLOSE MENU ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // ✅ CLOSE MENU ON LINK CLICK
  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo">My<span>App</span></div>

      {/* MENU ICON */}
      <div className="menuIcon" onClick={() => setOpen(!open)}>
        {open ? <FaTimes /> : <FaBars />}
      </div>

      {/* NAV LINKS */}
      <div ref={menuRef} className={`navLinks ${open ? "active" : ""}`}>

        <Link to="/" onClick={handleLinkClick}
          className={location.pathname === "/" ? "activeLink" : ""}>
          Home
        </Link>

        {sections.map(sec => (
          <Link
            key={sec.sectionId}
            to={`/section/${sec.sectionId}`}
            onClick={handleLinkClick}
            className={
              location.pathname === `/section/${sec.sectionId}`
                ? "activeLink"
                : ""
            }
          >
            {sec.sectionName}
          </Link>
        ))}

        <Link to="/admin"
          onClick={handleLinkClick}
          className={location.pathname === "/admin" ? "activeLink" : ""}>
          Admin
        </Link>
        <Link
  to="/downloads"
  onClick={handleLinkClick}
  className={
    location.pathname === "/downloads"
      ? "activeLink"
      : ""
  }
>
  Downloads
</Link>

      </div>
    </nav>
  );
}