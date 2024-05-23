import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import ReportChart from "./ReportChart";
import ReportChartByYear from "./reportChartByYear";
import OrderLogs from "./OrderLogs";

function Reports() {
  return (
    <>
      <div id="container">
        <div className="grid grid-cols-1 xxl:grid-cols-2 gap-10">
          <motion.div
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}
            className="col-span-1">
            <ReportChart />
          </motion.div>
          <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}
            className="col-span-1">
            <ReportChartByYear />
          </motion.div>
        </div>
        <motion.div
          variants={fadeIn("up", 0.6)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10">
          <OrderLogs />
        </motion.div>
      </div>
    </>
  );
}

export default Reports;
