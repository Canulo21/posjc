import { useEffect, useState } from "react";
import { TrendingUpIcon } from "lucide-react";
import axios from "axios";

function MostSaleProducts() {
  const [most, setMost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMostSaleProducts = async () => {
    try {
      const res = await axios.get("/mostSold");
      const get = res.data;
      setMost(get);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMostSaleProducts();
  }, []);

  return (
    <div className="bg-slate-50 py-2 px-2 shadow-lg relative dashboard-icon text-center h-full flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <h5>Most Sold Items</h5>
        <TrendingUpIcon size={40} color="#2463b3" />
      </div>
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : most.length > 0 ? (
        most.map((m, index) => (
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
  );
}

export default MostSaleProducts;
