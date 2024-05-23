import { useEffect, useState } from "react";
import { UserCogIcon } from "lucide-react";
import axios from "axios";

function PendingUserReport() {
  const [fetchUser, setFetchUser] = useState(0);
  const fetchPendingUser = () => {
    try {
      axios.get("/pendingUsers").then((res) => {
        const pendingData = res.data.length;
        setFetchUser(pendingData);
      });
    } catch (err) {}
  };

  useEffect(() => {
    fetchPendingUser();
  }, []);
  return (
    <>
      <div className="bg-slate-50 py-2 px-2 shadow-lg relative dashboard-icon text-center">
        <div className="flex items-center gap-2 mb-2 justify-center">
          <UserCogIcon size={50} color="#c51c1c" />
          <p className="text-5xl font-semibold drop-shadow-sm">{fetchUser}</p>
        </div>
        <p className="text-sm text-white font-medium rounded-lg bg-[#c51c1c]">
          Pending Users
        </p>
      </div>
    </>
  );
}

export default PendingUserReport;
