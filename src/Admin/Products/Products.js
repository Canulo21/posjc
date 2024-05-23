import { useEffect, useState } from "react";
import ProductCategory from "./ProductCategory";
import AddProduct from "./AddProduct";
import AllProducts from "./AllProducts";
import axios from "axios";

function Products() {
  const [categoryName, setCategoryName] = useState([]);
  const [getProducts, setGetProducts] = useState([]);
  const [getProdId, setGetProdId] = useState("");
  const [needStock, setNeedStock] = useState("");

  const fetchCategory = async () => {
    try {
      const res = await axios.get("/category");
      const getCategory = res.data;
      setCategoryName(getCategory);
    } catch (err) {}
  };

  const fetchAllProducts = async () => {
    const res = await axios.get("/allProducts");
    const AllProducts = res.data;
    setGetProducts(AllProducts);
  };

  const handleEditProduct = (productId) => {
    setGetProdId(productId);
  };

  const handleUpdateData = () => {
    setGetProdId(0);
  };

  const fetchReStock = async () => {
    const res = await axios.get("/reStock");
    const get = res.data;
    setNeedStock(get);
  };

  useEffect(() => {
    fetchReStock();
  }, []);

  return (
    <>
      <div id="container" className="relative">
        <div className="prod-bg">
          <div className="grid grid-cols-1 xxl:grid-cols-5 gap-5">
            <div className="col-span-1 xxl:col-span-3">
              <AddProduct
                fetchCategory={fetchCategory}
                categoryName={categoryName}
                getProdId={getProdId}
                handleUpdateData={handleUpdateData}
                fetchAllProducts={fetchAllProducts}
                fetchReStock={fetchReStock}
              />
            </div>
            <div className="col-span-1 xxl:col-span-2">
              <ProductCategory />
            </div>
          </div>
          <div className="mt-5">
            <AllProducts
              fetchAllProducts={fetchAllProducts}
              getProducts={getProducts}
              onEditProduct={handleEditProduct}
              needStock={needStock}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
