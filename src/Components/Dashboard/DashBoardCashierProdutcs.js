import React, { useEffect, useState } from "react";
import axios from "axios";
import noData from "../../Assets/images/no-data.png";
import noCat from "../../Assets/images/no-cat.png";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import Isotope from "isotope-layout";
import DashBoardCashierAddtoCart from "./DashBoardCashierAddtoCart";

const ITEMS_PER_PAGE = 21; // Number of items to display per page

function DashBoardCashierProdutcs({ user }) {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [getProducts, setGetProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isotope, setIsotope] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/allProducts");
      const allProduct = res.data;
      setGetProducts(allProduct);
      setFilteredProducts(allProduct); // Set initially filtered products to all products
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      if (!isotope) {
        setIsotope(
          new Isotope(".filter-section", {
            itemSelector: ".filter-item",
            layoutMode: "fitRows",
          })
        );
      } else {
        isotope.reloadItems();
        isotope.arrange();
      }
    }
  }, [filteredProducts, currentPage, isotope]);

  const handleFilter = (filterValue) => {
    if (filterValue === "*") {
      setFilteredProducts(getProducts);
    } else {
      const filtered = getProducts.filter(
        (product) => product.category_name === filterValue.slice(1)
      );
      setFilteredProducts(filtered);
    }
    setCurrentPage(1); // Reset to first page whenever a filter is applied
  };

  const uniqueCategories = [
    ...new Set(getProducts.map((product) => product.category_name)),
  ];

  const handleAddToCart = (productId) => {
    if (!selectedProductIds.includes(productId)) {
      setSelectedProductIds([...selectedProductIds, productId]);
    } else {
      setSelectedProductIds(
        selectedProductIds.filter((id) => id !== productId)
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const getPaginationGroup = () => {
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      <div id="container">
        <div className="prod-bg">
          <div className="w-full flex gap-5">
            <div className="xxl:w-3/4 w-1/2">
              {filteredProducts.length > 0 ? (
                <div className="">
                  <motion.div
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView={"show"}
                    viewport={{ once: true, amount: 0.3 }}
                    className="filter-section w-full">
                    {currentProducts.map((products, index) => (
                      <div
                        key={index}
                        className={`shadow-lg filter-item mr-3 mb-3 bg-white ${products.category_name}`}>
                        <div className="text-center" style={{ width: "170px" }}>
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: "170px",
                              height: "190px",
                              background: products.category_color,
                            }}>
                            <img
                              src={`/assets/product-image/${products.image_filename}`}
                              alt={products.prod_name}
                              className="filter p-2 prod-img"></img>
                          </div>
                          <div className="text-holder pt-2 pb-3 px-2">
                            <p className="uppercase font-semibold text-sm">
                              {products.prod_name}
                            </p>
                            <p className="font-medium italic text-base">
                              SRP: {products.prod_price}
                            </p>
                          </div>
                          <div className="p-1">
                            <button
                              key={products.prod_id}
                              className={`text-white bg-[#436850] hover:bg-[#12372a] font-bold text-sm py-2 px-2 rounded focus:outline-none focus:shadow-outline w-full uppercase ${
                                selectedProductIds.includes(products.prod_id)
                                  ? "bg-gray-500"
                                  : ""
                              }`}
                              onClick={() => handleAddToCart(products.prod_id)}>
                              {selectedProductIds.includes(products.prod_id)
                                ? "Remove from Cart"
                                : "Add to Cart"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  {/* Pagination controls */}
                  <motion.div
                    variants={fadeIn("right", 0.8)}
                    initial="hidden"
                    whileInView={"show"}
                    viewport={{ once: true, amount: 0.4 }}
                    className="flex justify-center mt-4 bg-[#436850] p-2 shadow-xl">
                    <button
                      className={`mx-1 px-3 py-1 border rounded ${
                        currentPage === 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handlePageChange(1)}>
                      1
                    </button>
                    {currentPage > 4 && <span className="mx-1">...</span>}
                    {getPaginationGroup().map((item, index) => (
                      <button
                        key={index}
                        className={`mx-1 px-3 py-1 border rounded ${
                          item === currentPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handlePageChange(item)}>
                        {item}
                      </button>
                    ))}
                    {currentPage < totalPages - 3 && (
                      <span className="mx-1">...</span>
                    )}
                    {totalPages > 1 && (
                      <button
                        className={`mx-1 px-3 py-1 border rounded ${
                          currentPage === totalPages
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                      </button>
                    )}
                  </motion.div>
                </div>
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
                  <p className="text-5xl pb-5 uppercase font-semibold">
                    No Product Displayed
                  </p>
                </motion.div>
              )}
            </div>
            <motion.div
              variants={fadeIn("left", 0.4)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: true, amount: 0.4 }}
              className="xxl:w-1/4 w-1/2 bg-[#cbc9c9] p-3 shadow-xl">
              <div className="shadow-lg border-solid border-2 border-lime-700 pt-1 px-2 pb-5 h-fit bg-[#fff]">
                <h3 className="text-center mb-2">Categories</h3>
                {getProducts.length > 0 ? (
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-1 text-sm rounded focus:outline-none focus:shadow-outline w-36 uppercase button"
                      onClick={() => handleFilter("*")}>
                      All
                    </button>
                    {uniqueCategories.map((categoryName, index) => (
                      <button
                        key={index}
                        className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-1 text-sm rounded focus:outline-none focus:shadow-outline w-36 uppercase button"
                        onClick={() => handleFilter(`.${categoryName}`)}>
                        {categoryName}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center flex-col w-full">
                    <img
                      src={noCat}
                      alt="no-data"
                      style={{ width: "400px" }}
                      className="no-data"
                    />
                    <p className="text-4xl pb-5 uppercase font-semibold">
                      No Category Found
                    </p>
                  </div>
                )}
              </div>
              <DashBoardCashierAddtoCart
                selectedProductIds={selectedProductIds}
                user={user}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoardCashierProdutcs;
