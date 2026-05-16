import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AllUsers.css";

export default function AllUsers() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/user/getAllUsers");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users ❌");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/user/delete/${id}`);
      toast.success("User Deleted ✅");
      fetchUsers();
    } catch (err) {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <div className="usersPage">

      <h2>All Users</h2>

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Height</th>
              <th>Weight</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.userId}>
                <td>{u.userId}</td>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.height}</td>
                <td>{u.weight}</td>
                <td>
                  <button onClick={() => deleteUser(u.userId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}