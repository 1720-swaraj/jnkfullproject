import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./SectionPage.css";

export default function SectionPage() {
  const { sectionId } = useParams();   // ✅ get id from URL
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchContent();
  }, [sectionId]); // ✅ run when id changes

  const fetchContent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/content/section/${sectionId}`
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div className="container">
    <h2 className="sectionTitle">Section Content</h2>

    <div className="cardGrid">
      {data.length === 0 ? (
        <p>No Data Found</p>
      ) : (
        data.map(item => (
          <div key={item.contentId} className="card">

            <img
              src={
                item.contentPersonImage
                  ? `http://localhost:8080/api/images/${item.contentPersonImage}`
                  : "https://via.placeholder.com/150"
              }
              className="cardImg"
            />

            <h3>{item.contentPersonName}</h3>
            <p className="role">{item.contentRole}</p>
            <p className="desc">{item.contentDescription}</p>

          </div>
        ))
      )}
    </div>
  </div>
);
}