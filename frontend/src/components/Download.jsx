import { useEffect, useState } from "react";
import axios from "axios";
import "./Download.css";

export default function Download() {

  const [downloads, setDownloads] = useState([]);
  const [search, setSearch] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchDownloads();
  }, []);

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

  // DOWNLOAD FILE
  const downloadFile = (file) => {

    window.open(
      `http://localhost:8080/downloads/${file}`,
      "_blank"
    );

  };

  // SEARCH FILTER
  const filteredDownloads = downloads.filter((d) =>

    (d.downloadFileName || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (d.downloadDescription || "")
      .toLowerCase()
      .includes(search.toLowerCase())

  );

  // PAGINATION
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentDownloads =
    filteredDownloads.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(
    filteredDownloads.length / itemsPerPage
  );

  // SEARCH HIGHLIGHT
  const highlightText = (text) => {

    text = text || "";

    if (!search) return text;

    return text
      .split(new RegExp(`(${search})`, "gi"))
      .map((part, index) =>

        part.toLowerCase() === search.toLowerCase()

          ? <mark key={index}>{part}</mark>

          : part
      );
  };

  return (

    <div className="downloadContainer">

      {/* TOP BAR */}
      <div className="downloadTopBar">

        <h1 className="downloadHeading">
          LIST OF DOCUMENTS
        </h1>

        <div className="searchSection">

          <label>Search:</label>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {

              setSearch(e.target.value);
              setCurrentPage(1);

            }}
          />

        </div>

      </div>

      {/* TABLE */}
      <div className="tableArea">

        <table className="downloadTable">

          <thead>

            <tr>
              <th>Document Name</th>
              <th>Description</th>
              <th>Files</th>
              <th>Created On</th>
            </tr>

          </thead>

          <tbody>

            {currentDownloads.length > 0 ? (

              currentDownloads.map((d) => (

                <tr key={d.downloadId}>

                  {/* DOCUMENT NAME */}
                  <td className="titleCell">
                    {highlightText(d.downloadFileName)}
                  </td>

                  {/* DESCRIPTION */}
                  <td className="descCell">
                    {highlightText(d.downloadDescription)}
                  </td>

                  {/* FILES */}
                  <td className="filesCell">

                    <div className="filesColumn">

                      {d.downloadDocument
                        ?.split(",")
                        .filter(file => file.trim() !== "")
                        .map((file, index) => {

                          // ORIGINAL FILE NAME
                          const originalName =
                            file.substring(
                              file.lastIndexOf("_") + 1
                            );

                          return (

                            <div
                              key={index}
                              className="fileRow"
                            >

                              {/* FILE NAME */}
                              <span className="fileName">
                                {originalName}
                              </span>

                              {/* DOWNLOAD BUTTON */}
                              <button
                                className="downloadBtn"
                                onClick={() =>
                                  downloadFile(file)
                                }
                              >
                                Download
                              </button>

                            </div>

                          );
                        })}

                    </div>

                  </td>

                  {/* DATE */}
                  <td className="dateCell">

                    {
                      d.createdOn
                        ? new Date(
                            d.createdOn
                          ).toLocaleDateString()
                        : "-"
                    }

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="4"
                  className="noData"
                >
                  No Documents Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div className="pagination">

        {Array.from(
          { length: totalPages },
          (_, i) => (

            <button
              key={i}
              className={
                currentPage === i + 1
                  ? "activePage"
                  : ""
              }
              onClick={() =>
                setCurrentPage(i + 1)
              }
            >
              {i + 1}
            </button>

        ))}

      </div>

    </div>
  );
}