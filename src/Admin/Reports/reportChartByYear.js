import React, { useState, useEffect } from "react";
import noData from "../../Assets/images/no-data.png";
import { Line } from "react-chartjs-2";
import { SearchIcon } from "lucide-react";
import axios from "axios";

function ReportChartByYear() {
  const [totalIncome, setTotalIncome] = useState([]);
  const [getDate, setGetDate] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with current year

  useEffect(() => {
    // Fetch data for the initial render, you might want to set a default year here
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      // Make API request with the selected year as a parameter
      const res = await axios.get("/searchDateChartByYear", {
        params: {
          year: selectedYear,
        },
      });

      const data = res.data;
      const incomeData = data.map((item) => item.total_income);
      const incomeDate = data.map((item) => {
        // Get month names from numeric values
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return monthNames[item.month - 1]; // Adjust index since months are 1-indexed
      });
      setTotalIncome(incomeData);
      setGetDate(incomeDate);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  // Handle search by year
  const handleSearch = () => {
    fetchChartData();
  };

  const data = {
    labels: getDate,
    datasets: [
      {
        label: "Income",
        data: totalIncome,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Month's in Year Chart",
      },
    },
  };

  return (
    <div className="bg-slate-50 p-5 shadow-lg h-full">
      <div className="flex gap-5">
        <input
          type="number"
          className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          placeholder="Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="text-white text-sm bg-[#436850] hover:bg-[#12372a] font-medium py-1 px-2 rounded focus:outline-none focus:shadow-outline flex items-center gap-2 uppercase">
          <SearchIcon />
          <span>Search</span>
        </button>
      </div>
      {totalIncome.length > 0 ? (
        <Line options={options} data={data} />
      ) : (
        <div className="w-full justify-center mt-8 flex">
          <img
            src={noData}
            alt="no-data"
            style={{ width: "500px" }}
            className="no-data"
          />
        </div>
      )}
    </div>
  );
}

export default ReportChartByYear;
