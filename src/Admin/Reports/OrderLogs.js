import { useState, useEffect } from "react";
import noData from "../../Assets/images/no-data.png";
import axios from "axios";
import { Filter } from "lucide-react";

const ITEMS_PER_PAGE = 30;

function OrderLogs() {
  const [getLogs, setGetLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("/reportSalesLogs");
      const data = res.data;
      setGetLogs(data);
      setFilteredLogs(data); // Set filtered logs to the fetched data initially
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilter = () => {
    const filtered = getLogs.filter((log) => {
      const logDate = new Date(log.date);
      const start = startDate ? new Date(startDate) : new Date("1970-01-01");
      const end = endDate ? new Date(endDate) : new Date();
      return logDate >= start && logDate <= end;
    });
    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedLogs = filteredLogs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    return pageNumbers.map((number) => {
      if (
        number === 1 ||
        number === totalPages ||
        (number >= currentPage - 4 && number <= currentPage + 4)
      ) {
        return (
          <button
            key={number}
            onClick={() => handleClick(number)}
            className={`mx-1 font-bold py-2 px-4 rounded text-white ${
              currentPage === number ? "bg-blue-700" : "bg-blue-500 "
            }`}>
            {number}
          </button>
        );
      } else if (number === currentPage - 5 || number === currentPage + 5) {
        return <span key={number}>...</span>;
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div>
        <h2 className="text-center">Order Logs</h2>
        <div className="flex justify-center my-4">
          <div className="mr-2">
            <label htmlFor="startDate">From: </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2"
            />
          </div>
          <div className="ml-2">
            <label htmlFor="endDate">To: </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2"
            />
          </div>
          <button
            onClick={handleFilter}
            className="ml-4 bg-blue-500 text-white py-2 px-4 rounded flex items-center gap-2">
            <Filter />
            Filter
          </button>
        </div>
        {selectedLogs.length > 0 ? (
          <div>
            <table className="table-auto mt-2 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5 text-center">
              <thead>
                <tr>
                  <th className="border border-slate-300 p-2">No.</th>
                  <th className="border border-slate-300 p-2">Product</th>
                  <th className="border border-slate-300 p-2">Quantity</th>
                  <th className="border border-slate-300 p-2">Price</th>
                  <th className="border border-slate-300 p-2">
                    Discounted Price
                  </th>
                  <th className="border border-slate-300 p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedLogs.map((d, index) => (
                  <tr key={index}>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {d.NO}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {d.name}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {d.quantity}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {d.total_price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {d.discounted_price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {new Date(d.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-4">
              {renderPageNumbers()}
            </div>
          </div>
        ) : (
          <div className="justify-center flex">
            <img className="no-data" src={noData} alt="no-data"></img>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderLogs;
