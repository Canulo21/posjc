import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import { Check, Trash2 } from "lucide-react";
import noData from "../../Assets/images/no-pending.png";

function PendingUser({ fetchPendingUser, fetchUser }) {
  const handleAccepted = async (userId) => {
    try {
      await axios.put(`/acceptUser/${userId}`, {
        status: "accepted",
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Accepted",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.reload();
      fetchPendingUser();
    } catch (err) {}
  };

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
            fetchPendingUser();
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

  useEffect(() => {
    fetchPendingUser();
  }, []);

  return (
    <>
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: true, amount: 0.3 }}
        className="border-solid border-2 border-teal-700 py-1 px-6 shadow-xl text-center h-full">
        <h2>Pending Registered Users</h2>
        {fetchUser.length > 0 ? (
          <table className="table-auto mt-2 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5">
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
                <th className="border border-slate-300 p-2 text-sm">Status</th>
                <th className="border border-slate-300 p-2 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {fetchUser.map((d, index) => (
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
                  <td className="border border-slate-300 p-2 uppercase font-bold">
                    {d.role}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase font-bold text-red-700">
                    {d.status}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase font-bold">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-[#2296c5] text-white hover:text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#0a3a4e]"
                        onClick={() => handleAccepted(d.id)}>
                        <Check />
                        <span>Accept</span>
                      </button>
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
        ) : (
          <motion.div
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.4 }}
            className="flex justify-center items-center flex-col">
            <img
              src={noData}
              alt="no-data"
              style={{ width: "200px" }}
              className="no-data py-5"
            />
            <p className="text-2xl pb-5 uppercase font-semibold">
              No Pending Users
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

export default PendingUser;
