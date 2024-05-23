import { useState, useEffect } from "react";
import noData from "../../Assets/images/no-data.png";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { SearchIcon } from "lucide-react";
import axios from "axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function ReportChart() {
  const [totalIncome, setTotalIncome] = useState([]);
  const [getDate, setGetDate] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showChart, setShowChart] = useState(false); // State to control chart visibility

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await axios.get("/chartReport");
        const getData = res.data;
        const incomeData = getData.map((item) => item.total_income);
        const incomeDate = getData.map((item) => {
          const date = new Date(item.DATE);
          return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
        });
        setTotalIncome(incomeData);
        setGetDate(incomeDate);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchChart();
  }, []);

  // Handle searching by date range
  const handleSearch = async () => {
    try {
      const res = await axios.get("/searchDateChart", {
        params: {
          startDate: fromDate,
          endDate: toDate,
        },
      });

      const getData = res.data;
      const incomeData = getData.map((item) => item.total_income);
      const incomeDate = getData.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      });

      setTotalIncome(incomeData);
      setGetDate(incomeDate);
      setShowChart(true); // Show chart after search
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  // for Chart
  const labels = getDate;

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Income",
        data: totalIncome, // Replace with your own data array
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
        text: "Search By Date Chart",
      },
    },
  };

  return (
    <div className="bg-slate-50 p-5 shadow-lg h-full">
      <div>
        <div className="flex gap-5">
          <input
            type="date"
            className="appearance-none block  bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="appearance-none block  bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="text-white text-sm bg-[#436850] hover:bg-[#12372a] font-medium py-1 px-2 rounded focus:outline-none focus:shadow-outline flex items-center gap-2 uppercase">
            <SearchIcon />
            <span>Search</span>
          </button>
        </div>
      </div>
      {showChart ? (
        <Line options={options} data={data} /> // Conditionally render the chart
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

export default ReportChart;
