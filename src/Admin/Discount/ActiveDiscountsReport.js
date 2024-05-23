import { useState, useEffect } from "react";
import { PercentIcon } from "lucide-react";
import axios from "axios";

function ActiveDiscountsReport() {
  const [getActive, setGetActive] = useState(0);
  const fetchDiscount = async () => {
    try {
      const res = await axios.get("/viewDiscountPost");
      const allDiscount = res.data.length;
      setGetActive(allDiscount);
    } catch (err) {
      console.error("Error fetching discounts:", err);
    }
  };

  useEffect(() => {
    fetchDiscount();
  }, []);
  return (
    <>
      <div className="bg-slate-50 py-2 px-2 shadow-lg relative dashboard-icon text-center">
        <div className="flex items-center gap-2 mb-2 justify-center">
          <PercentIcon size={50} color="#c51c1c" />
          <p className="text-5xl font-semibold drop-shadow-sm">{getActive}</p>
        </div>
        <p className="text-sm text-white font-medium rounded-lg bg-[#c51c1c]">
          Active Discounts Promo
        </p>
      </div>
    </>
  );
}

export default ActiveDiscountsReport;
