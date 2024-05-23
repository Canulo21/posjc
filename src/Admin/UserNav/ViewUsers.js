import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import { Trash2 } from "lucide-react";
import PendingUser from "./PendingUser";
import ActiveUsers from "./ActiveUsers";

function ViewUsers() {
  const [getUsers, setGetUsers] = useState([]);
  const [fetchUser, setFetchUser] = useState([]);
  const [activeUser, setActiveUser] = useState([]);

  const fetchActiveUser = () => {
    try {
      axios.get("/activeUsers").then((res) => {
        const pendingData = res.data;
        setActiveUser(pendingData);
      });
    } catch (err) {}
  };

  const fetchPendingUser = () => {
    try {
      axios.get("/pendingUsers").then((res) => {
        const pendingData = res.data;
        setFetchUser(pendingData);
      });
    } catch (err) {}
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("/viewUsers");
      const userData = res.data;
      setGetUsers(userData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/deleteUser/${userId}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            fetchData();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Delete Failed",
              text: error.response
                ? error.response.data.error
                : "An unexpected error occurred. Please try again later.",
            });
          });
      }
    });
  };

  return (
    <>
      <div id="container">
        <div className="bg-user">
          <div className="grid grid-cols-1 xxl:grid-cols-5 mt-5 gap-5">
            <div className="col-span-1 xxl:col-span-3 h-full">
              <PendingUser
                fetchPendingUser={fetchPendingUser}
                fetchUser={fetchUser}
              />
            </div>
            <div className="col-span-1 xxl:col-span-2 h-full">
              <ActiveUsers
                fetchActiveUser={fetchActiveUser}
                activeUser={activeUser}
              />
            </div>
          </div>
          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}
            className="border-solid border-2 border-teal-700 py-5 px-6 shadow-xl text-center w-full mt-5">
            <h2>All Users</h2>
            <table className="table-auto mt-5 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5">
              <thead>
                <tr>
                  <th className="border border-slate-300 p-2 text-sm">
                    First Name
                  </th>
                  <th className="border border-slate-300 p-2 text-sm">
                    Middle Name
                  </th>
                  <th className="border border-slate-300 p-2 text-sm">
                    Last Name
                  </th>
                  <th className="border border-slate-300 p-2 text-sm">Role</th>
                  <th className="border border-slate-300 p-2 text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {getUsers.map((d, index) => (
                  <tr key={index}>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {d.fname}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {d.mname}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {d.lname}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold text-lime-600">
                      {d.role}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#a93737]"
                          onClick={() => handleDelete(d.id)}>
                          <Trash2 />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ViewUsers;
