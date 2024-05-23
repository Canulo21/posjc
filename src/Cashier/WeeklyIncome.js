import { useEffect, useState } from "react";
import { BarChartBig } from "lucide-react";
import axios from "axios";

function WeeklyIncome({ user }) {
  const [income, setIncome] = useState(null); // Use null instead of 0 for initial state
  const [loading, setLoading] = useState(true);

  const fetchWeeklyIncome = async () => {
    try {
      const res = await axios.get("/cashierWeeklyIncome", {
        params: { cashierName: `${user.fname} ${user.lname}` }, // Correct syntax for concatenating first name and last name
      });
      const get = res.data.total_income;
      setIncome(get);
    } catch (error) {
      console.error("Error fetching daily income:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyIncome();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (income === null) {
    return <p>No data available</p>;
  }

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
          <BarChartBig size={40} color="#a58200" />
          <p className="text-3xl font-medium drop-shadow-sm">
            {formattedIncome}
          </p>
        </div>
        <p className="text-sm text-white font-medium bg-[#a58200] rounded-lg">
          Weekly Income
        </p>
      </div>
    </>
  );
}

export default WeeklyIncome;
