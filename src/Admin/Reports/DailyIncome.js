import { useEffect, useState } from "react";
import { BarChartBig } from "lucide-react";
import axios from "axios";

function DailyIncome() {
  const [income, setIncome] = useState(0);

  const fetchDailyIncome = async () => {
    try {
      const res = await axios.get("/dailyIncome");
      const get = res.data.total_income;
      setIncome(get);
    } catch (error) {
      console.error("Error fetching daily income:", error);
    }
  };

  useEffect(() => {
    fetchDailyIncome();
  }, []);

  const formattedIncome = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(income);

  return (
    <>
      <div className="bg-slate-50 py-2 px-2 shadow-lg relative dashboard-icon text-center">
        <div className="flex items-center gap-2 mb-2 justify-center">
          <BarChartBig size={40} color="#50a94b" />
          <p className="text-3xl font-medium drop-shadow-sm">
            {formattedIncome}
          </p>
        </div>
        <p className="text-sm text-white font-medium rounded-lg bg-[#50a94b]">
          Daily Income
        </p>
      </div>
    </>
  );
}

export default DailyIncome;
