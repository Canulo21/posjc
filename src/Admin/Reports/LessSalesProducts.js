import { useEffect, useState } from "react";
import { TrendingDownIcon } from "lucide-react";
import axios from "axios";

function LessSalesProducts() {
  const [less, setLess] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLessSalesProducts = async () => {
    try {
      const res = await axios.get("/lessSold");
      const get = res.data;
      setLess(get);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessSalesProducts();
  }, []);

  return (
    <>
      <div className="bg-slate-50 py-2 px-2 shadow-lg relative dashboard-icon text-center h-full flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <h5>Less Sold Items</h5>
          <TrendingDownIcon size={40} color="#c51c1c" />
        </div>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : less.length > 0 ? (
          less.map((m, index) => (
            <div
              key={index}
              className="bg-[#d7dce3] mt-2 p-2 hover:bg-[#bdc5d1] cursor-pointer">
              <p className="text-base font-medium drop-shadow-sm uppercase text-left">
                {m.NAME}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-4">No items to display</div>
        )}
      </div>
    </>
  );
}

export default LessSalesProducts;
