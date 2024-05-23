import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { fadeIn } from "../../variants";
import noData from "../../Assets/images/no-data.png";
import {
  ArrowBigLeft,
  ArrowBigRight,
  Edit2,
  SearchIcon,
  Trash2,
} from "lucide-react";
import axios from "axios";

function AllProducts({
  fetchAllProducts,
  getProducts,
  onEditProduct,
  needStock,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = getProducts
    .filter((product) =>
      product.prod_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleDeleteProduct = async (prod_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/deleteProduct/${prod_id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Product has been deleted.",
              icon: "success",
            });
            fetchAllProducts();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Delete Failed",
              text: error.response
                ? error.response.data.error
                : "An unexpected error occurred. Please try again later.",
            });
          });
      }
    });
  };

  const handleEdit = (productId) => {
    onEditProduct(productId);
  };

  return (
    <>
      <motion.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: true, amount: 0.3 }}
        className="border-solid border-2 border-teal-700 py-1 px-6 shadow-xl text-center h-full">
        <h2>Products</h2>
        <div className="mb-4 flex items-center gap-2 justify-end">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1"
          />
        </div>
        {currentProducts.length > 0 ? (
          <table className="table-auto mt-2 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5">
            <thead>
              <tr>
                <th className="border border-slate-300 p-2">Product ID</th>
                <th className="border border-slate-300 p-2">Name</th>
                <th className="border border-slate-300 p-2">Category</th>
                <th className="border border-slate-300 p-2">Price</th>
                <th className="border border-slate-300 p-2">Quantity</th>
                <th className="border border-slate-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr key={index}>
                  <td className="border border-slate-300 p-2 uppercase font-bold">
                    {product.prod_id}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase font-bold">
                    {product.prod_name}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase font-bold">
                    {product.category_name}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase font-bold">
                    {product.prod_price}
                  </td>
                  <td
                    className={`border border-slate-300 p-2 uppercase font-bold  ${
                      product.re_stock >= product.quantity
                        ? "text-red-600 text-2xl"
                        : "text-green-700"
                    }`}>
                    {product.quantity}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase font-bold">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#a93737]"
                        onClick={() => {
                          handleDeleteProduct(product.prod_id);
                        }}>
                        <Trash2 />
                        <span>Delete</span>
                      </button>
                      <button
                        className="bg-[#436850] hover:bg-[#12372a] text-white py-2 px-4 rounded-md flex items-center gap-2"
                        onClick={() => handleEdit(product.prod_id)}>
                        <Edit2 />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <motion.div
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.4 }}
            className="flex justify-center items-center flex-col">
            <img
              src={noData}
              alt="no-data"
              style={{ width: "500px" }}
              className="no-data"
            />
            <p className="text-2xl pb-5 uppercase font-semibold">
              No Product Displayed
            </p>
          </motion.div>
        )}
        <div className="flex justify-center mt-4 mb-2 gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l flex gap-2">
            <ArrowBigLeft />
            Prev
          </button>
          {Array.from({
            length: Math.ceil(getProducts.length / productsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`${
                currentPage === index + 1
                  ? "bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-700"
              } text-white font-bold py-2 px-4 rounded`}>
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(getProducts.length / productsPerPage)
            }
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r flex gap-2">
            Next
            <ArrowBigRight />
          </button>
        </div>
      </motion.div>

      {needStock.length ? (
        <motion.div
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.4 }}
          className="border-solid border-2 border-teal-700 pt-1 pb-3 px-6 shadow-xl text-center h-full w-full mt-5">
          <h3>Prodcuts Need to Restock</h3>
          {needStock.map((stock, index) => (
            <div
              key={index}
              className=" flex justify-center text-2xl mt-2 text-red-600 ">
              <p className="uppercase font-semibold">{stock.prod_name} -</p>
              <p>- {stock.quantity} pices left</p>
            </div>
          ))}
        </motion.div>
      ) : null}
    </>
  );
}

export default AllProducts;
