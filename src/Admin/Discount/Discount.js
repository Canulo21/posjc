import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import noDiscount from "../../Assets/images/no-discount.png";
import { fadeIn } from "../../variants";
import { Edit2, Percent, Trash2, UploadIcon, X } from "lucide-react";

function Discount() {
  const [getId, setGetId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [getData, setGetData] = useState([]);
  const [discountTitle, setDiscountTitle] = useState("");
  const [discountStatus, setDiscountStatus] = useState("");
  const [discountNumber, setDiscountNumber] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    discount: "",
  });

  const fetchDiscount = async () => {
    try {
      const res = await axios.get("/viewDiscount");
      const allDiscount = res.data;
      setGetData(allDiscount);
    } catch (err) {}
  };

  useEffect(() => {
    fetchDiscount();
  }, []);

  useEffect(() => {
    axios
      .get(`/viewDiscount/${getId}`)
      .then((res) => {
        const getData = res.data;
        setFormData(getData); // Update formData with the received data
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getId]);

  const handleInsertData = async (e) => {
    e.preventDefault();
    if (!discountTitle || !discountNumber || isNaN(discountNumber)) {
      Swal.fire({
        icon: "error",
        title: "Opsss ...",
        text: "Please enter a valid discount title and number.",
      });
      return;
    }

    try {
      const res = await axios.post("/addDiscount", {
        title: discountTitle,
        discount: parseFloat(discountNumber),
        status: discountStatus,
      });

      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Succesfully Added",
          showConfirmButton: false,
          timer: 1500,
        });

        setDiscountTitle("");
        setDiscountStatus("");
        setDiscountNumber(0);
        fetchDiscount();
      }
    } catch (err) {
      // Error handling
      Swal.fire({
        icon: "error",
        title: "Opsss ...",
        text: err.response
          ? err.response.data.error
          : "An unexpected error occurred. Please try again later.",
      });
    }
  };

  const handleDelete = async (id) => {
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
          .delete(`/deleteDiscount/${id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Discount has been deleted.",
              icon: "success",
            });
            fetchDiscount();
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

  const closeModal = () => {
    setShowModal(false);
    setShowEditModal(false);
  };

  const handleInputTitle = (e) => {
    e.preventDefault();
    setDiscountTitle(e.target.value);
  };

  const handleInputDiscount = (e) => {
    e.preventDefault();
    setDiscountNumber(e.target.value);
  };

  const handleStatus = (e) => {
    e.preventDefault();
    setDiscountStatus(e.target.value);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const modalTransition = {
    type: "spring",
    stiffness: 260,
    damping: 20,
  };

  // update modal

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = await axios.put(`/updateDiscount/${getId}`, {
        data: formData,
      });
      if (updatedFormData.data.updated) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Updated Successful!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchDiscount();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div id="container">
        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}>
          <h1 className="text-center">Discount Table</h1>
        </motion.div>

        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md font-bold flex items-center gap-2 mt-2 mb-3 ml-2 hover:bg-[#2e5491] float-right"
            onClick={() => setShowModal(true)}>
            <Percent />
            Add Discount
          </button>
          {getData.length > 0 ? (
            <table className="table-auto mt-2 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5">
              <thead>
                <tr>
                  <th className="border border-slate-300 p-2">Title</th>
                  <th className="border border-slate-300 p-2">Discount</th>
                  <th className="border border-slate-300 p-2">Status</th>
                  <th className="border border-slate-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {getData.map((d, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {d.title}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {d.discount}%
                    </td>
                    <td
                      className={`border border-slate-300 p-2 uppercase font-bold text-2xl ${
                        d.status === "Hold" ? "text-red-600 " : "text-green-700"
                      }`}>
                      {d.status}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#a93737]"
                          onClick={() => handleDelete(d.id)}>
                          <Trash2 />
                          <span>Delete</span>
                        </button>
                        <button
                          className="bg-[#436850] hover:bg-[#12372a] text-white py-2 px-4 rounded-md flex items-center gap-2"
                          onClick={() => {
                            setShowEditModal(true);
                            setGetId(d.id);
                          }}>
                          <Edit2 />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center">
              <img src={noDiscount} alt="no-discount" className="no-data"></img>
            </div>
          )}
        </motion.div>
      </div>

      {/* for Add Discount Modal */}
      {showModal ? (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={modalTransition}
          className="modal-form">
          <form className="bg-[#fafafa] shadow-md rounded px-8 pt-6 pb-6 mb-4 w-1/3">
            <button
              onClick={closeModal}
              className="float-right pt-2 pb-2 pl-5 pr-5 bg-[#436850] hover:bg-[#12372A] text-white rounded-md">
              <X />
            </button>
            <div className="mt-10">
              <label className="text-xl font-bold block text-center uppercase">
                Title
              </label>
              <div className=" w-full mt-5">
                <input
                  className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="title"
                  value={discountTitle}
                  onChange={handleInputTitle}
                  placeholder="eg. Senior Citizen"></input>
              </div>
              <div className="mt-5">
                <label className="text-xl font-bold block text-center uppercase mb-5">
                  Discount
                </label>
                <input
                  type="number"
                  name="discount"
                  value={discountNumber}
                  onChange={handleInputDiscount}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>
              <div className="mt-5">
                <label className="text-xl font-bold block text-center uppercase mb-5">
                  Status
                </label>
                <select
                  className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="status"
                  value={discountStatus}
                  onChange={handleStatus}>
                  <option value="Hold">Hold</option>
                  <option value="Post">Post</option>
                </select>
              </div>
              <button
                className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full uppercase flex gap-2 justify-center"
                type="button"
                onClick={handleInsertData}>
                <UploadIcon />
                Save
              </button>
            </div>
          </form>
        </motion.div>
      ) : null}

      {/* for Add Discount Modal */}
      {showEditModal ? (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={modalTransition}
          className="modal-form">
          <form className="bg-[#fafafa] shadow-md rounded px-8 pt-6 pb-6 mb-4 w-1/3">
            <button
              onClick={closeModal}
              className="float-right pt-2 pb-2 pl-5 pr-5 bg-[#436850] hover:bg-[#12372A] text-white rounded-md">
              <X />
            </button>
            <div className="mt-10">
              <label className="text-xl font-bold block text-center uppercase">
                Title
              </label>
              <div className=" w-full mt-5">
                <input
                  className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleUpdateChange}
                  placeholder="eg. Senior Citizen"></input>
              </div>
              <div className="mt-5">
                <label className="text-xl font-bold block text-center uppercase mb-5">
                  Discount
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleUpdateChange}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>
              <div className="mt-5">
                <label className="text-xl font-bold block text-center uppercase mb-5">
                  Status
                </label>
                <select
                  className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="status"
                  value={formData.status}
                  onChange={handleUpdateChange}>
                  <option value="Hold">Hold</option>
                  <option value="Post">Post</option>
                </select>
              </div>
              <button
                className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full uppercase flex gap-2 justify-center"
                type="button"
                onClick={handleUpdateData}>
                <UploadIcon />
                Update
              </button>
            </div>
          </form>
        </motion.div>
      ) : null}
    </>
  );
}

export default Discount;
