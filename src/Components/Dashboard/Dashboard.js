import React from "react";
import ProductReStockReport from "../../Admin/Products/ProductReStockReport";
import ActiveUserReport from "../../Admin/UserNav/ActiveUserReport";
import PendingUserReport from "../../Admin/UserNav/PendingUserReport";
import ActiveDiscountsReport from "../../Admin/Discount/ActiveDiscountsReport";
import DailyIncome from "../../Admin/Reports/DailyIncome";
import WeeklyIncome from "../../Admin/Reports/WeeklyIncome";
import MonthlyIncome from "../../Admin/Reports/MonthlyIncome";
import MostSaleProducts from "../../Admin/Reports/MostSaleProducts";
import LessSalesProducts from "../../Admin/Reports/LessSalesProducts";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import ReportChartByYear from "../../Admin/Reports/reportChartByYear";

function Dashboard() {
  return (
    <>
      <div id="container">
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="col-span-1">
            <ActiveUserReport />
          </div>
          <div className="col-span-1">
            <PendingUserReport />
          </div>
          <div className="col-span-1">
            <ProductReStockReport />
          </div>
          <div className="col-span-1">
            <ActiveDiscountsReport />
          </div>
        </motion.div>
        <motion.div
          variants={fadeIn("right", 0.6)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          <div className="col-span-1">
            <DailyIncome />
          </div>
          <div className="col-span-1">
            <WeeklyIncome />
          </div>
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <MonthlyIncome />
          </div>
        </motion.div>
        <div
          className="w-full flex flex-col xxl:flex-row gap-5 mt-5"
          style={{ alignItems: "normal" }}>
          <motion.div
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full xxl:w-3/4 dashboard-icon">
            <ReportChartByYear />
          </motion.div>
          <div className="w-full xxl:w-1/4">
            <div className="h-full flex flex-col xxl:flex-col ssl:flex-row  gap-5">
              <motion.div
                variants={fadeIn("up", 1)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: true, amount: 0.3 }}
                className="w-full h-1/2">
                <MostSaleProducts />
              </motion.div>
              <motion.div
                variants={fadeIn("up", 1.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: true, amount: 0.3 }}
                className="w-full h-1/2">
                <LessSalesProducts />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
