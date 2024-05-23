import { useState, useEffect, useRef } from "react";
import "./Navigation.css";
import { NavLink } from "react-router-dom";
import { Menu, Percent, SquareX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../Assets/images/logo.png";
import { User, LayoutDashboard, LineChart, ShoppingBag } from "lucide-react";

function Navigation({ onLogout, isAdmin }) {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const buttonRef = useRef(null);
  const sidebarRef = useRef(null);

  const onToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        toggle &&
        buttonRef.current &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        // Clicked outside the button and sidebar
        setToggle(false); // Close the sidebar if clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggle]);

  const handleLogout = () => {
    Swal.fire({
      icon: "success",
      title: "Logout Successful!",
      showConfirmButton: false,
      timer: 1500,
    });
    onLogout(); // Call the onLogout function from prop
    navigate("/");
    setToggle(false); // Close sidebar after logging out
  };

  return (
    <>
      <button
        onClick={onToggle}
        className={`hamburger${toggle ? " active" : ""}`}
        ref={buttonRef}>
        <div className="icon-holder">{toggle ? <SquareX /> : <Menu />}</div>
      </button>
      <div className={`sidebar${toggle ? " active" : ""}`} ref={sidebarRef}>
        <div className="logo flex justify-center mt-16 mb-16">
          <NavLink to={"/dashboard"}>
            <img
              src={logo}
              className="drop-shadow-lg"
              alt="logo"
              style={{ width: "250px" }}
            />
          </NavLink>
        </div>
        {isAdmin ? (
          <>
            <NavLink to={"/dashboard"}>
              <LayoutDashboard />
              Dashboard
            </NavLink>
            <NavLink to={"/users"}>
              <User />
              Users
            </NavLink>
            <NavLink to={"/products"}>
              <ShoppingBag />
              Products
            </NavLink>
            <NavLink to={"/discount"}>
              <Percent />
              Discounts
            </NavLink>
            <NavLink to={"/reports"}>
              <LineChart />
              Reports
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to={"/dashboard"}>
              <LayoutDashboard />
              Dashboard
            </NavLink>
            <NavLink to={"/reports"}>
              <LineChart />
              Reports
            </NavLink>
          </>
        )}
        <div className="mr-1 ml-1 holder-logout">
          <button
            className="pt-3 pb-3 pl-5 pr-5 bg-[#58a399] text-white w-full uppercase flex items-center"
            onClick={handleLogout}>
            <span className="w-full text-xl">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Navigation;
