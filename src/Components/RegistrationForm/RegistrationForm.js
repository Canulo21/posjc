import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

function RegistrationForm() {
  const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    role: "",
    status: "pending",
    isActive: false,
    username: "",
    password: "",
  });

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrors(validateValues(formData));
    try {
      await axios.post("/register", formData);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Registration Successful!",
        showConfirmButton: false,
        timer: 1500,
      });

      setFormData({
        fname: "",
        mname: "",
        lname: "",
        role: "",
        status: "pending",
        isActive: false,
        username: "",
        password: "",
      });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: err.response.data.error,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateValues = (inputValues) => {
    let errors = {};

    if (inputValues.fname.trim() === "") {
      errors.fname = "Provide First Name";
    }
    if (inputValues.lname.trim() === "") {
      errors.lname = "Provide Last Name";
    }
    if (inputValues.role.trim() === "") {
      errors.role = "Select Role";
    }
    if (inputValues.username.trim() === "") {
      errors.username = "Provide Username";
    }
    if (inputValues.password.trim() === "") {
      errors.password = "Provide Password";
    }

    return errors;
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

  return (
    <>
      <div className="bg">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={modalTransition}
          className="form px-8 pb-8 pt-10 shadow-2xl bg-[#edebe1]">
          <form onSubmit={handleRegistration}>
            <h1 className="mb-10">RegistrationForm</h1>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-1">
                <label className="font-semibold" htmlFor="fname">
                  First Name:
                </label>
                <input
                  className="p-1 w-full mt-2 px-2 py-1"
                  type="text"
                  id="fname"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                />
                {errors.fname && (
                  <p className="text-red-600 font-bold text-sm mt-3">
                    {errors.fname}
                  </p>
                )}
              </div>
              <div className="col-span-1">
                <label className="font-semibold" htmlFor="mname">
                  Middle Name:
                </label>
                <input
                  className="p-1 w-full mt-2 px-2 py-1"
                  type="text"
                  id="mname"
                  name="mname"
                  value={formData.mname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 mt-5">
              <div className="col-span-1">
                <label className="font-semibold" htmlFor="lname">
                  Last Name:
                </label>
                <input
                  className="p-1 w-full mt-2 px-2 py-1"
                  type="text"
                  id="lname"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                />
                {errors.lname && (
                  <p className="text-red-600 font-bold text-sm mt-3">
                    {errors.lname}
                  </p>
                )}
              </div>
              <div className="col-span-1">
                <label className="font-semibold" htmlFor="role">
                  Role:
                </label>
                <select
                  className="p-1 w-full mt-2 px-2 py-1"
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleChange(e)}>
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Cashier">Cashier</option>
                </select>
                {errors.role && (
                  <p className="text-red-600 font-bold text-sm mt-3">
                    {errors.role}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mt-10">
              <label className="font-semibold" htmlFor="username">
                User Name:
              </label>
              <input
                className="p-1 w-full mt-2 px-2 py-1"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-600 font-bold text-sm mt-3">
                  {errors.username}
                </p>
              )}
            </div>
            <div className="w-full mt-5">
              <label className="font-semibold" htmlFor="password">
                Password:
              </label>
              <input
                className="p-1 w-full mt-2 px-2 py-1"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-600 font-bold text-sm mt-3">
                  {errors.password}
                </p>
              )}
            </div>
            <button className="bg-[#B3C8CF] w-full text-white uppercase py-2 mt-5 hover:bg-[#707070]">
              Register
            </button>
            <div className="w-full text-right mt-5">
              <NavLink className="underline" to="/">
                Back to Login
              </NavLink>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default RegistrationForm;
