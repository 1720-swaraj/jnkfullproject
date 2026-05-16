import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AnimatedCursor from "./AnimatedCursor";
import AdminSettings from "./AdminSettings";
import { FaUserCircle } from "react-icons/fa";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaBars,
  FaTimes,
  FaUsers,
  FaLayerGroup,
  FaFileAlt,
  FaSignOutAlt,
  FaCog 
} from "react-icons/fa";
import {
  FaDownload,
  FaFilePdf,
  FaFileExcel,
  FaFileImage,
  FaFileWord,
   FaFileArchive

} from "react-icons/fa";

export default function AdminDashboard() {
const [downloads, setDownloads] = useState([]);
const [downloadFiles, setDownloadFiles] = useState([]);
const [downloadFileName, setDownloadFileName] =
useState("");

const [downloadDescription, setDownloadDescription] =
useState("");


const [downloadSearch, setDownloadSearch] =
useState("");

const [downloadPage, setDownloadPage] =
useState(1);

const [selectedDownloadFile, setSelectedDownloadFile] = useState(null);

const [deleteSingleFileData, setDeleteSingleFileData] = useState(null);
const downloadPerPage = 5;

const fetchDownloads = async () => {

  try {

    const res = await axios.get(
      "http://localhost:8080/api/download/all"
    );

    setDownloads(res.data);

  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchDownloads();
}, []);

const filteredDownloads = downloads.filter(d =>
  (d.downloadFileName || "")
    .toLowerCase()
    .includes(downloadSearch.toLowerCase()) ||

  (d.downloadDescription || "")
    .toLowerCase()
    .includes(downloadSearch.toLowerCase())
);

const downloadLast =
  downloadPage * downloadPerPage;

const downloadFirst =
  downloadLast - downloadPerPage;

const currentDownloads =
  filteredDownloads.slice(
    downloadFirst,
    downloadLast
  );

const downloadTotalPages =
  Math.ceil(
    filteredDownloads.length / downloadPerPage
  );

  const highlightDownload = (text) => {

  text = text || "";

  if (!downloadSearch) return text;

  return text
    .split(
      new RegExp(`(${downloadSearch})`, "gi")
    )
    .map((p, i) =>

      p.toLowerCase() ===
      downloadSearch.toLowerCase()

        ? <mark key={i}>{p}</mark>

        : p
    );
};
const removeDownloadFile = (index) => {

  setDownloadFiles(prev =>
    prev.filter((_, i) => i !== index)
  );

};

const deleteSingleFile = async () => {

  try {

    await axios.delete(
      `http://localhost:8080/api/download/deleteFile/${deleteSingleFileData.downloadId}`,
      {
        data: {
          fileName: deleteSingleFileData.fileName
        }
      }
    );

    toast.success("File Deleted ✅");

    // CHECK UPDATED DATA
    const res = await axios.get(
      "http://localhost:8080/api/download/all"
    );

    const updatedDownload = res.data.find(
      d => d.downloadId === deleteSingleFileData.downloadId
    );

    // IF NO FILE LEFT → DELETE WHOLE DOC
    if (
      !updatedDownload ||
      !updatedDownload.downloadDocument ||
      updatedDownload.downloadDocument.trim() === ""
    ) {

      await axios.delete(
        `http://localhost:8080/api/download/deleteDoc/${deleteSingleFileData.downloadId}`
      );

      toast.success("Empty Document Removed ✅");
    }

    setDeleteSingleFileData(null);

    fetchDownloads();

  } catch (err) {

    toast.error("Delete Failed ❌");

  }
};
const deleteDocument = async (id) => {

  try {

    await axios.delete(
      `http://localhost:8080/api/download/${id}`
    );

    toast.success("Document Deleted ✅");

    fetchDownloads();

  } catch (err) {

    console.log(err);

    toast.error("Delete Failed ❌");
  }
};
const downloadSingleFile = (file) => {

  window.open(
    `http://localhost:8080/downloads/${file}`,
    "_blank"
  );

};
const addDownload = async () => {

  try {

   const formData = new FormData();

formData.append(
  "downloadFileName",
  downloadFileName
);

formData.append(
  "downloadDescription",
  downloadDescription
);

downloadFiles.forEach((file) => {
  formData.append("files", file);
});

  await axios.post(
  "http://localhost:8080/api/download/add",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    timeout: 300000
  }
);
    toast.success("Files Uploaded ✅");
    setDownloadFiles([]);

    setDownloadFileName("");
    setDownloadDescription("");
    setDownloadFiles([]);

    fetchDownloads();

  } catch (err) {

    toast.error("Upload Failed ❌");
  }
};

const getFileIcon = (file) => {

  const ext =
    file.split(".").pop().toLowerCase();

  if (
    ["png","jpg","jpeg","gif","webp"]
    .includes(ext)
  ) {
    return <FaFileImage />;
  }

  if (ext === "pdf") {
    return <FaFilePdf />;
  }

  if (
    ["xls","xlsx","csv"]
    .includes(ext)
  ) {
    return <FaFileExcel />;
  }

  if (
    ["doc","docx"]
    .includes(ext)
  ) {
    return <FaFileWord />;
  }

  // ZIP / RAR
  if (
    ["zip","rar","7z"]
    .includes(ext)
  ) {
    return <FaFileArchive />;
  }

  return <FaFileAlt />;
};

// ✅ MULTI SELECT STATES
const [showBulkUserDelete, setShowBulkUserDelete] = useState(false);
const deleteSelectedUsers = async () => {
  try {
    await Promise.all(
      selectedUsers.map(id =>
        axios.delete(`http://localhost:8080/api/user/delete/${id}`)
      )
    );

    toast.success(`Deleted ${selectedUsers.length} users ✅`);

    setSelectedUsers([]);
    setShowBulkUserDelete(false);
    fetchUsers();

  } catch (err) {
    toast.error("Bulk delete failed ❌");
  }
};
const [selectedUsers, setSelectedUsers] = useState([]);
const [selectedSections, setSelectedSections] = useState([]);
const [selectedContents, setSelectedContents] = useState([]);
const [admin, setAdmin] = useState(null);
const handleUserSelect = (id) => {
  setSelectedUsers(prev =>
    prev.includes(id)
      ? prev.filter(i => i !== id)
      : [...prev, id]
  );
};

// ✅ SELECT ALL USERS
const handleSelectAllUsers = () => {
  if (selectedUsers.length === currentUsers.length) {
    setSelectedUsers([]);
  } else {
    setSelectedUsers(currentUsers.map(u => u.userId));
  }
};
useEffect(() => {
  try {
    const data = localStorage.getItem("admin");
    if (data) {
      setAdmin(JSON.parse(data));
    }
  } catch (e) {
    console.error("Invalid JSON");
    localStorage.removeItem("admin");
  }
}, []);
    const [deleteContentId, setDeleteContentId] = useState(null);
const fileInputRef = useRef();  
const [editContent, setEditContent] = useState(null);
const [editImage, setEditImage] = useState(null);
const [editPreview, setEditPreview] = useState(null);


  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("users");

  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const sidebarRef = useRef();
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
// 🔥 CONTENT STATE
  const [contents, setContents] = useState([]);
//i have add for content
  const [form, setForm] = useState({
    sectionId: "",
    contentType: "",
    contentPersonName: "",
    contentRole: "",
    contentDescription: ""
  });

  const [contentImage, setContentImage] = useState(null);



  const [sectionName, setSectionName] = useState("");
  const [editSection, setEditSection] = useState(null);
// 🔵 CONTENT SEARCH + PAGINATION
const [contentSearch, setContentSearch] = useState("");
const [contentPage, setContentPage] = useState(1);
const contentPerPage = 5;
const filteredContent = contents.filter(c =>
  (c.sectionName || "").toLowerCase().includes(contentSearch.toLowerCase()) ||
  (c.contentType || "").toLowerCase().includes(contentSearch.toLowerCase()) ||
  (c.contentPersonName || "").toLowerCase().includes(contentSearch.toLowerCase()) ||
  (c.contentRole || "").toLowerCase().includes(contentSearch.toLowerCase())
);
const contentLast = contentPage * contentPerPage;
const contentFirst = contentLast - contentPerPage;
const currentContent = filteredContent.slice(contentFirst, contentLast);

const contentTotalPages = Math.ceil(filteredContent.length / contentPerPage);
  // AUTH CHECK
  useEffect(() => {
    if (!localStorage.getItem("admin")) navigate("/admin");
  }, []);

  // FETCH USERS
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8080/api/user/getAllUsers");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // CLOSE SIDEBAR OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // DELETE
  const confirmDelete = async () => {
    await axios.delete(`http://localhost:8080/api/user/delete/${deleteId}`);
    toast.success("Deleted");
    setDeleteId(null);
    fetchUsers();
  };

  // EDIT
  const handleEdit = (user) => {
    setEditUser(user);
    setPreview(`http://localhost:8080/api/images/${user.imagePath}`);
  };

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const updateUser = async () => {
    const formData = new FormData();

    formData.append("userId", editUser.userId);
    formData.append("fullName", editUser.fullName);
    formData.append("email", editUser.email);
    formData.append("mobileNumber", editUser.mobileNumber);
    formData.append("city", editUser.city);
    formData.append("gender", editUser.gender || "");
    formData.append("address", editUser.address || "");

    if (image) formData.append("image", image);

    await axios.post("http://localhost:8080/api/user/updateUser", formData);

    toast.success("Updated Successfully");
    setEditUser(null);
    fetchUsers();
  };

  // SEARCH
  const filtered = users.filter(u =>
    (u.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.city || "").toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / usersPerPage);

  // HIGHLIGHT
  const highlight = (text) => {
    text = text || "";
    if (!search) return text;
    return text.split(new RegExp(`(${search})`, "gi")).map((p, i) =>
      p.toLowerCase() === search.toLowerCase() ? <mark key={i}>{p}</mark> : p
    );
  };

  // COPY
  const copy = () => {
    navigator.clipboard.writeText(
      filtered.map(u => `${u.userId} ${u.fullName} ${u.email}`).join("\n")
    );
    toast.success("Copied!");
  };
  const highlightContent = (text) => {
  text = text || "";
  if (!contentSearch) return text;

  return text.split(new RegExp(`(${contentSearch})`, "gi")).map((p, i) =>
    p.toLowerCase() === contentSearch.toLowerCase()
      ? <mark key={i}>{p}</mark>
      : p
  );
};

  // CSV
  const exportCSV = () => {
    const csv = [
      ["ID", "Name", "Email", "Mobile", "City"],
      ...filtered.map(u => [u.userId, u.fullName, u.email, u.mobileNumber, u.city])
    ].map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.csv";
    a.click();
  };

  // EXCEL
  const exportExcel = () => {
    const data = [
      ["ID", "Name", "Email", "Mobile", "City"],
      ...filtered.map(u => [u.userId, u.fullName, u.email, u.mobileNumber, u.city])
    ].map(r => r.join("\t")).join("\n");

    const blob = new Blob([data], {
      type: "application/vnd.ms-excel"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.xls";
    a.click();
  };

  // PDF
  const exportPDF = () => {
    const win = window.open("", "", "width=800,height=600");
    win.document.write("<h2>User List</h2>");
    filtered.forEach(u =>
      win.document.write(`<p>${u.fullName} - ${u.email}</p>`)
    );
    win.print();
  };


const exportContentCSV = () => {
  const csv = [
    ["ID", "Section", "Type", "Name", "Role"],
    ...filteredContent.map(c => [
      c.contentId,
      c.sectionName,
      c.contentType,
      c.contentPersonName,
      c.contentRole
    ])
  ].map(r => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "content.csv";
  a.click();
};
const exportContentExcel = () => {
  const data = [
    ["ID", "Section", "Type", "Name", "Role"],
    ...filteredContent.map(c => [
      c.contentId,
      c.sectionName,
      c.contentType,
      c.contentPersonName,
      c.contentRole
    ])
  ].map(r => r.join("\t")).join("\n");

  const blob = new Blob([data], {
    type: "application/vnd.ms-excel"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "content.xls";
  a.click();
};
const exportContentPDF = () => {
  const win = window.open("", "", "width=800,height=600");

  win.document.write("<h2>Content List</h2>");

  filteredContent.forEach(c => {
    win.document.write(`
      <p>
        ${c.contentId} - ${c.sectionName} - ${c.contentType} - 
        ${c.contentPersonName} - ${c.contentRole}
      </p>
    `);
  });

  win.print();
};





  // FETCH SECTIONS
const fetchSections = async () => {
  const res = await axios.get("http://localhost:8080/api/section/all");
  setSections(res.data);
};

useEffect(() => {
  fetchSections();
}, []);


//i have add for content
const fetchContent = async () => {
  const res = await axios.get("http://localhost:8080/api/content/all");
  setContents(res.data);
};

useEffect(() => {
  fetchContent();
}, []);

// ADD
const addSection = async () => {

  // 🔴 VALIDATION
  if (!sectionName || sectionName.trim() === "") {
    toast.error("Section name is required ❗");
    return;
  }

  try {
    await axios.post("http://localhost:8080/api/section/add", {
      sectionName: sectionName.trim()
    });

    toast.success("Section Added Successfully✅");

    setSectionName("");
    fetchSections();

  } catch (err) {
    toast.error("Failed to add section ❌");
  }
};

// DELETE
const deleteSection = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/api/section/${id}`);

    toast.success("Section Deleted 🗑️");

    fetchSections();
  } catch (err) {
    toast.error("Delete failed ❌");
  }
};

const updateSection = async () => {
  try {
    await axios.put(
      `http://localhost:8080/api/section/update/${editSection.sectionId}`,
      editSection
    );

    toast.success("Section Updated ✏️");

    setEditSection(null);
    fetchSections();
  } catch (err) {
    toast.error("Update failed ❌");
  }
};
// ✅ HANDLE FORM INPUT
const handleForm = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};
const handleEditContentChange = (e) => {
  setEditContent({
    ...editContent,
    [e.target.name]: e.target.value
  });
};
const handleEditImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setEditImage(file);
  setEditPreview(URL.createObjectURL(file));
};
const handleDownloadFilesChange = (e) => {

  const selectedFiles = Array.from(e.target.files);

  setDownloadFiles((prevFiles) => [
    ...prevFiles,
    ...selectedFiles
  ]);

};
// ✅ ADD CONTENT
const addContent = async () => {
  if (!form.sectionId || !form.contentType.trim() || !form.contentPersonName.trim()) {
    toast.error("Section, content type, and person name are required");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("sectionId", form.sectionId);
    formData.append("contentType", form.contentType);
    formData.append("contentPersonName", form.contentPersonName);
    formData.append("contentRole", form.contentRole);
    formData.append("contentDescription", form.contentDescription);

    if (contentImage) {
      formData.append("image", contentImage);
    }

    await axios.post("http://localhost:8080/api/content/add", formData);

    toast.success("Content Added ✅");

    // reset form
    setForm({
      sectionId: "",
      contentType: "",
      contentPersonName: "",
      contentRole: "",
      contentDescription: ""
    });

    setContentImage(null);
    // ✅ CLEAR FILE INPUT (IMPORTANT LINE)
if (fileInputRef.current) {
  fileInputRef.current.value = "";
}
  
    fetchContent();

  } catch (err) {
    toast.error("Failed ❌");
  }
};

// ✅ UPDATE CONTENT
const updateContent = async () => {
  try {
    if (!editContent.sectionId) {
      toast.error("Section is required ❗");
      return;
    }

    const formData = new FormData();

    formData.append("contentId", editContent.contentId);
    formData.append("sectionId", editContent.sectionId);
    formData.append("contentType", editContent.contentType || "");
    formData.append("contentPersonName", editContent.contentPersonName || "");
    formData.append("contentRole", editContent.contentRole || "");
    formData.append("contentDescription", editContent.contentDescription || "");

    if (editImage) {
      formData.append("image", editImage);
    }

    // 🔥 DEBUG (VERY IMPORTANT)
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    await axios.put("http://localhost:8080/api/content/update", formData);

    toast.success("Content Updated ✏️");

    setEditContent(null);
    setEditImage(null);
    setEditPreview(null);

    fetchContent();

  } catch (err) {
    console.error(err.response?.data || err);
    toast.error("Update failed ❌");
  }
};

const [showLogoutModal, setShowLogoutModal] = useState(false);
const handleLogout = () => {
  localStorage.removeItem("admin");
  navigate("/admin");
};
// ✅ DELETE CONTENT CONFIRM FUNCTION (ADD HERE)
const confirmContentDelete = async () => {
  try {
    await axios.delete(`http://localhost:8080/api/content/${deleteContentId}`);

    toast.success("Content Deleted 🗑️");

    setDeleteContentId(null); // close modal
    fetchContent();

  } catch (err) {
    toast.error("Delete failed ❌");
  }
};



  return (

     <> <AnimatedCursor />
    

    <div className="dashboard">

      {/* TOPBAR */}
      <div className="topbar">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        <h2>Admin Dashboard</h2>
<button
  className="logoutTop"
  onClick={() => setShowLogoutModal(true)}
>
  <FaSignOutAlt /> Logout
</button>
      </div>

      <div className="layout">

        {/* SIDEBAR */}
       <div ref={sidebarRef} className={sidebarOpen ? "sidebar open" : "sidebar"}>
<div className="sidebarHeader">

  {admin?.adminImage ? (
    <img
      src={`http://localhost:8080/api/images/${admin.adminImage}`}
      className="sidebarProfileImg"
      alt="Admin"
    />
  ) : (
    <FaUserCircle className="sidebarIcon" />
  )}

  <h3 className="adminName">
    {admin?.adminName || "Admin"}
  </h3>

</div>
  <button
    className={activePage === "users" ? "active" : ""}
    onClick={() => setActivePage("users")}
  >
    <FaUsers /> Users
  </button>

  <button
    className={activePage === "section" ? "active" : ""}
    onClick={() => setActivePage("section")}
  >
    <FaLayerGroup /> Section
  </button>

  <button
    className={activePage === "content" ? "active" : ""}
    onClick={() => setActivePage("content")}
  >
    <FaFileAlt /> Content
  </button>
  {/* ✅ ADD HERE for download */}
  <button
  className={
    activePage === "downloads"
      ? "active"
      : ""
  }
  onClick={() =>
    setActivePage("downloads")
  }
>
  <FaDownload /> Downloads
</button>
{/* ✅ ADD HERE */}
  <button
    className={activePage === "settings" ? "active" : ""}
    onClick={() => setActivePage("settings")}
  >
    <FaCog /> Settings
  </button>

</div>


        {/* CONTENT */}
        <div className="content">


          

          {activePage === "users" && (
            <div className="tableCard">

              {/* TOP BAR */}
              <div className="tableTopBar">

                <div className="exportBtns">
                  <button onClick={copy}>Copy</button>
                  <button onClick={exportCSV}>CSV</button>
                  <button onClick={exportExcel}>Excel</button>
                  <button onClick={exportPDF}>PDF</button>
                </div>

                <input
                  className="searchBox"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* TABLE */}
              <div className="tableWrapper">
                {selectedUsers.length > 0 && (
  <button
    className="bulkDeleteBtn"
    onClick={() => setShowBulkUserDelete(true)}
  >
    Delete Selected ({selectedUsers.length})
  </button>
)}
              <table>
                <thead>
                 
                  <tr>
                    {/* CHECKBOX FIRST */}
    <th>
      <input
        type="checkbox"
        onChange={handleSelectAllUsers}
        checked={
          currentUsers.length > 0 &&
          selectedUsers.length === currentUsers.length
        }
      />
    </th>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentUsers.map(u => (
                    
                    <tr key={u.userId}>
                      <td>
  <input
    type="checkbox"
    checked={selectedUsers.includes(u.userId)}
    onChange={() => handleUserSelect(u.userId)}
  />
</td>
                      <td>{u.userId}</td>

                      <td>
                        <img
                          src={`http://localhost:8080/api/images/${u.imagePath}`}
                          className="tableImg"
                        />
                      </td>

                      <td>{highlight(u.fullName)}</td>
                      <td>{highlight(u.email)}</td>
                      <td>{u.mobileNumber}</td>
                      <td>{highlight(u.city)}</td>

                      <td className="actionCell">
                        <button className="btn editBtn" onClick={() => handleEdit(u)}>
                          <FaEdit /> 
                        </button>

                        <button className="btn deleteBtn" onClick={() => setDeleteId(u.userId)}>
                          <FaTrash /> 
                        </button>

                        <button className="btn viewBtn" onClick={() => setSelectedUser(u)}>
                          <FaEye /> 
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
</div>

              {/* PAGINATION */}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={currentPage === i + 1 ? "activePage" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

            </div>
          )}




{activePage === "section" && (
  <div className="tableCard">

  <h2 className="sectionTitle">Section Management</h2>

  {/* ADD SECTION */}
  <div className="sectionForm">
    <input
      className="sectionInput"
      value={sectionName}
      onChange={(e) => setSectionName(e.target.value)}
      placeholder="Enter Section Name" required
    />

    <button className="addBtn" onClick={addSection}>
      Add Section
    </button>
  </div>

  {/* TABLE */}
  <div className="tableWrapper">
  <table className="sectionTable">
    <thead>
      <tr>
        <th>ID</th>
        <th>Section Name</th>
        <th>Created On</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {sections.map(s => (
        <tr key={s.sectionId}>
          <td>{s.sectionId}</td>

          <td>
            {editSection?.sectionId === s.sectionId ? (
              <input
                className="editInput"
                value={editSection.sectionName}
                onChange={(e) =>
                  setEditSection({
                    ...editSection,
                    sectionName: e.target.value
                  })
                }
              />
            ) : (
              s.sectionName
            )}
          </td>

          <td>{new Date(s.createdOn).toLocaleString()}</td>

          <td className="actionCell">
            {editSection?.sectionId === s.sectionId ? (
              <>
                <button className="saveBtn" onClick={updateSection}>Save</button>
                <button className="cancelBtn" onClick={() => setEditSection(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="editBtn" onClick={() => setEditSection({ ...s })}>
                  <FaEdit /> 
                </button>
                <button className="deleteBtn" onClick={() => deleteSection(s.sectionId)}>
                   <FaTrash /> 
                  
                </button>
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
)}


      
{activePage === "content" && (
  <div className="contentPage">

    {/* LEFT SIDE FORM */}
    <div className="contentForm">
 <h2 className="formTitle">Add Content</h2>
      <select name="sectionId" value={form.sectionId} onChange={handleForm}>
        <option value="">Select Section</option>
        {sections.map(s => (
          <option key={s.sectionId} value={s.sectionId}>
            {s.sectionName}
          </option>
        ))}
      </select>

      <input
        name="contentType"
        placeholder="Content Type"
        value={form.contentType}
        onChange={handleForm}
      />

      <input
        name="contentPersonName"
        placeholder="Person Name"
        value={form.contentPersonName}
        onChange={handleForm}
      />

      <input
        name="contentRole"
        placeholder="Role"
        value={form.contentRole}
        onChange={handleForm}
      />

      <textarea
        name="contentDescription"
        placeholder="Description"
        value={form.contentDescription}
        onChange={handleForm}
      />

      <input type="file"   ref={fileInputRef}  onChange={(e) => setContentImage(e.target.files[0] || null)} />

      <button className="addBtn" onClick={addContent}>
        Add Content
      </button>
    </div> 

   {/* RIGHT SIDE TABLE */}
<div className="contentTable">

  {/* 🔍 SEARCH BAR */}
  <div className="tableTopBar">

  <div className="exportBtns">
    <button onClick={exportContentCSV}>CSV</button>
    <button onClick={exportContentExcel}>Excel</button>
    <button onClick={exportContentPDF}>PDF</button>
  </div>

  <input
    className="searchBox"
    placeholder="Search content..."
    value={contentSearch}
    onChange={(e) => {
      setContentSearch(e.target.value);
      setContentPage(1);
    }}
  />

</div>

  <div className="tableWrapper">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Section</th>
          <th>Type</th>
          <th>Name</th>
          <th>Role</th>
          <th>Image</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {currentContent.map(c => (
          <tr key={c.contentId}>
            <td>{c.contentId}</td>

           <td>{highlightContent(c.sectionName)}</td>
<td>{highlightContent(c.contentType)}</td>
<td>{highlightContent(c.contentPersonName)}</td>
<td>{highlightContent(c.contentRole)}</td>
            <td>
              <img
                src={
                  c.contentPersonImage
                    ? `http://localhost:8080/api/images/${c.contentPersonImage}`
                    : "https://via.placeholder.com/50"
                }
                className="tableImg"
              />
            </td>

            <td className="actionCell">
              <button className="editBtn" onClick={() => {
                setEditContent({
                  contentId: c.contentId,
                  sectionId: c.sectionId ? String(c.sectionId) : "",
                  contentType: c.contentType || "",
                  contentPersonName: c.contentPersonName || "",
                  contentRole: c.contentRole || "",
                  contentDescription: c.contentDescription || ""
                });

                setEditPreview(
                  c.contentPersonImage
                    ? `http://localhost:8080/api/images/${c.contentPersonImage}`
                    : null
                );
              }}>
                <FaEdit /> 
              </button>

              <button
                className="deleteBtn"
                onClick={() => setDeleteContentId(c.contentId)}
              >
                <FaTrash /> 
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* 📄 PAGINATION */}
  <div className="pagination">
    {Array.from({ length: contentTotalPages }, (_, i) => (
      <button
        key={i}
        className={contentPage === i + 1 ? "activePage" : ""}
        onClick={() => setContentPage(i + 1)}
      >
        {i + 1}
      </button>
    ))}
  </div>

</div>
  </div>
)}

{activePage === "downloads" && (

<div className="downloadPage">

  {/* LEFT FORM */}
  <div className="downloadForm">

    <h2 className="formTitle">
      Upload Files
    </h2>

   <input
  type="file"
  multiple
  onChange={handleDownloadFilesChange}
/>
<div className="selectedFiles">

  {downloadFiles.map((file, index) => (

    <div key={index} className="fileItem">

      <span>{file.name}</span>

      <button
        type="button"
        onClick={() => removeDownloadFile(index)}
      >
        Remove
      </button>

    </div>

  ))}

</div>
<input
  type="text"
  placeholder="Enter File Title"
  value={downloadFileName}
  onChange={(e) =>
    setDownloadFileName(e.target.value)
  }
/>
    <textarea
      placeholder="Description"
      value={downloadDescription}
      onChange={(e) =>
        setDownloadDescription(e.target.value)
      }
    />

   
    <button
      className="addBtn"
      onClick={addDownload}
    >
      Upload Files
    </button>

  </div>

  {/* RIGHT TABLE */}
  <div className="downloadTable">

    <div className="tableTopBar">

      <input
        className="searchBox"
        placeholder="Search files..."
        value={downloadSearch}
        onChange={(e) => {
          setDownloadSearch(
            e.target.value
          );

          setDownloadPage(1);
        }}
      />

    </div>

    <div className="tableWrapper">

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>File Name</th>
            <th>Description</th>
            <th>Files</th>
            <th>Created</th>
            <th>Action</th>
           
          </tr>
        </thead>

        <tbody>

          {currentDownloads.map(d => (

            <tr key={d.downloadId}>

              <td>{d.downloadId}</td>

              <td>
                {highlightDownload(
                  d.downloadFileName
                )}
              </td>

              <td style={{minWidth:"150px"}}>
  {highlightDownload(d.downloadDescription)}
</td>

<td>

  <div className="downloadFiles">

    {d.downloadDocument
      ?.split(",")
      .filter(file => file.trim() !== "")
      .map((file, index) => (

      <div
        key={index}
        className="singleFileCard"
      >

        <div className="fileLeft">

          {getFileIcon(file)}

          <span>
            {file.substring(
              file.lastIndexOf("_") + 1
            )}
          </span>

        </div>

        <div className="fileActions">

          {/* DOWNLOAD
          <button
            className="downloadMiniBtn"
            onClick={() =>
              downloadSingleFile(file)
            }
          >
            Download
          </button> */}

          {/* EDIT */}
          <button
            className="editMiniBtn"
            onClick={() =>
              setSelectedDownloadFile({
                downloadId: d.downloadId,
                oldFile: file
              })
            }
          >
            <FaEdit />
          </button>

          {/* DELETE */}
          <button
            className="deleteMiniBtn"
            onClick={() =>
              setDeleteSingleFileData({
                downloadId: d.downloadId,
                fileName: file
              })
            }
          >
            <FaTrash />
          </button>

        </div>

      </div>

    ))}

  </div>

</td>

              <td>
                {new Date(
                  d.createdOn
                ).toLocaleString()}
              </td>
<td>

  <button
  className="deleteBtn"
  onClick={() => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all documents?"
    );

    if (confirmDelete) {
      deleteDocument(d.downloadId);
    } else {
      toast.info("Delete cancelled ❌");
    }
  }}
>
  Delete AllDocument
</button>

</td>
             

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    {/* PAGINATION */}
    <div className="pagination">

      {Array.from(
        {
          length: downloadTotalPages
        },
        (_, i) => (

          <button
            key={i}
            className={
              downloadPage === i + 1
                ? "activePage"
                : ""
            }
            onClick={() =>
              setDownloadPage(i + 1)
            }
          >
            {i + 1}
          </button>

      ))}

    </div>

  </div>

</div>
)}

  {/* ✅ ADD HERE */}
  {activePage === "settings" && (
    <AdminSettings />
  )}






        </div>
      </div>

      {/* VIEW MODAL user*/}
     {selectedUser && (
  <div className="modal">
    <div className="modalContent">

      {/* CLOSE ICON */}
      <span className="closeIcon" onClick={() => setSelectedUser(null)}>
        &times;
      </span>

      <img
        src={`http://localhost:8080/api/images/${selectedUser.imagePath}`}
        className="profileImg"
      />

      <p><b>Name:</b> {selectedUser.fullName}</p>
      <p><b>Email:</b> {selectedUser.email}</p>
      <p><b>Mobile:</b> {selectedUser.mobileNumber}</p>
      <p><b>City:</b> {selectedUser.city}</p>

      <button onClick={() => setSelectedUser(null)}>Close</button>
    </div>
  </div>
)}
      {/* EDIT MODAL user*/}
     {editUser && (
  <div className="modal">
    <div className="modalContent">

      {/* CLOSE ICON */}
      <span className="closeIcon" onClick={() => setEditUser(null)}>
        &times;
      </span>

      <img src={preview} className="profileImgTop" />

      <input name="fullName" value={editUser.fullName} onChange={handleChange} />
      <input name="email" value={editUser.email} onChange={handleChange} />
      <input name="mobileNumber" value={editUser.mobileNumber} onChange={handleChange} />
      <input name="city" value={editUser.city} onChange={handleChange} />
      <input name="gender" value={editUser.gender || ""} onChange={handleChange} />
      <input name="address" value={editUser.address || ""} onChange={handleChange} />

      <input type="file" onChange={handleImage} />

      <button onClick={updateUser}>Update</button>
      <button onClick={() => setEditUser(null)}>Cancel</button>

    </div>
  </div>
)}
{showLogoutModal && (
  <div className="modal">
    <div className="modalContent">
      <p>Are you sure you want to logout?</p>

      <button onClick={handleLogout}>Yes</button>
      <button onClick={() => setShowLogoutModal(false)}>No</button>
    </div>
  </div>
)}
{showBulkUserDelete && (
  <div className="modal">
    <div className="modalContent">

      <p>
        Are you sure you want to delete these {selectedUsers.length} users?
      </p>

      <button onClick={deleteSelectedUsers}>Yes</button>
      <button onClick={() => setShowBulkUserDelete(false)}>
        Cancel
      </button>

    </div>
  </div>
)}
 {/* USER DELETE MODAL */}
    {deleteId && (
      <div className="modal">
        <div className="modalContent">
          <p>Delete user?</p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={() => setDeleteId(null)}>No</button>
        </div>
      </div>
    )}

    {/* ✅ CONTENT DELETE MODAL (ADD HERE) */}
    {deleteContentId && (
      <div className="modal">
        <div className="modalContent">

          <p>Are you sure?</p>

          <button onClick={confirmContentDelete}>Yes</button>
          <button onClick={() => setDeleteContentId(null)}>
            Cancel
          </button>

        </div>
      </div>
    )}
    
{/* ✅ EDIT CONTENT MODAL */}
{editContent && (
  <div className="modal">
    <div className="modalContent">

      <span className="closeIcon" onClick={() => setEditContent(null)}>
        &times;
      </span>

      {/* IMAGE PREVIEW */}
      {editPreview && (
        <img src={editPreview} className="profileImgTop" />
      )}

      {/* FORM */}
      <select
        name="sectionId"
        value={editContent.sectionId}
        onChange={handleEditContentChange}
      >
        <option value="">Select Section</option>
        {sections.map(s => (
          <option key={s.sectionId} value={s.sectionId}>
            {s.sectionName}
          </option>
        ))}
      </select>

      <input
        name="contentType"
        value={editContent.contentType}
        onChange={handleEditContentChange}
      />

      <input
        name="contentPersonName"
        value={editContent.contentPersonName}
        onChange={handleEditContentChange}
      />

      <input
        name="contentRole"
        value={editContent.contentRole}
        onChange={handleEditContentChange}
      />

      <textarea
        name="contentDescription"
        value={editContent.contentDescription}
        onChange={handleEditContentChange}
      />

      <input type="file" onChange={handleEditImage} />

      <button onClick={updateContent}>Update</button>
      <button onClick={() => setEditContent(null)}>Cancel</button>

    </div>
  </div>
)}
{/* ✅ EDIT Download MODAL */}

{selectedDownloadFile && (

<div className="modal">

  <div className="modalContent">

    <h3>Edit File</h3>

    <input
      type="file"
      onChange={(e) => {

        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();

        formData.append(
          "oldFile",
          selectedDownloadFile.oldFile
        );

        formData.append(
          "newFile",
          file
        );

        axios.put(
          `http://localhost:8080/api/download/updateSingleFile/${selectedDownloadFile.downloadId}`,
          formData
        )
        .then(() => {

          toast.success("File Updated ✅");

          setSelectedDownloadFile(null);

          fetchDownloads();

        })
        .catch(() => {

          toast.error("Update Failed ❌");

        });

      }}
    />

    <button
      onClick={() =>
        setSelectedDownloadFile(null)
      }
    >
      Cancel
    </button>

  </div>

</div>

)}
{deleteSingleFileData && (

<div className="modal">

  <div className="modalContent">

    <p>
      Delete this file?
    </p>

    <button
      onClick={deleteSingleFile}
    >
      Yes
    </button>

    <button
      onClick={() =>
        setDeleteSingleFileData(null)
      }
    >
      Cancel
    </button>

  </div>

</div>

)}

  </div>
  </>
);
  
 



  
}
