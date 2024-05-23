import { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import axios from "axios";

function ActiveUserReport() {
  const [activeUser, setActiveUser] = useState(0);

  const fetchActiveUser = () => {
    try {
      axios.get("/activeUsers").then((res) => {
        const pendingData = res.data.length;
        setActiveUser(pendingData);
      });
    } catch (err) {}
  };

  useEffect(() => {
    fetchActiveUser();
  }, []);

  return (
    <>
      <div className="bg-slate-50 py-2 px-2 shadow-lg dashboard-icon text-center">
        <div className="flex items-center gap-2 mb-2 justify-center">
          <UserCheck size={50} color="#2463b3" />
          <p className="text-5xl font-semibold drop-shadow-sm">{activeUser}</p>
        </div>
        <p className="text-sm text-white font-medium bg-[#2463b3] rounded-lg">
          Active Users
        </p>
      </div>
    </>
  );
}

export default ActiveUserReport;
