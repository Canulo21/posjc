import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import emptyBox from "../../Assets/product-image/empty-box.png";
import Swal from "sweetalert2";
import axios from "axios";
import { UploadIcon, X } from "lucide-react";

function AddProduct({
  fetchCategory,
  categoryName,
  getProdId,
  handleUpdateData,
  fetchAllProducts,
  fetchReStock,
}) {
  const [prodCat, setProdCat] = useState("");
  const [prodQuant, setProdQuant] = useState(0);
  const [prodReStock, setProdReStock] = useState(0);
  const [formData, setFormData] = useState({
    prod_name: "",
    prod_price: 0,
    image: null, // New state to store the selected image file
  });
  const [imageUrl, setImageUrl] = useState(null); // State to store URL of the uploaded image

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleProdQuant = (e) => {
    setProdQuant(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      quantity: e.target.value,
    }));
  };

  const handleProdCat = (e) => {
    setProdCat(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      category_name: e.target.value,
    }));
  };

  const handleProdReStock = (e) => {
    setProdReStock(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      re_stock: e.target.value,
    }));
  };

  const handleInsertData = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", formData);
      const formDataToSend = new FormData(); // Create a FormData object to send both text and image data
      formDataToSend.append("prod_name", formData.prod_name);
      formDataToSend.append("category_name", prodCat);
      formDataToSend.append("prod_price", formData.prod_price);
      formDataToSend.append("quantity", prodQuant);
      formDataToSend.append("re_stock", prodReStock);
      formDataToSend.append("image", formData.image); // Append the image file to FormData

      const response = await axios.post("/addProduct", formDataToSend);

      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Succesfully Added",
          showConfirmButton: false,
          timer: 1500,
        });

        setFormData({
          prod_name: "",
          prod_price: 0,
          image: null, // Reset image state after successful submission
        });
        setProdCat("");
        setProdQuant(0);
        setProdReStock(0);
        setImageUrl(null); // Reset imageUrl state

        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Oppssss ...",
          text: error.response.data
            ? error.response.data
            : "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  const handleCancel = () => {
    handleUpdateData();
    setFormData({
      prod_name: "",
      prod_price: 0,
      image: null, // Reset image state after successful submission
    });
    setProdCat("");
    setProdQuant(0);
    setImageUrl(null); // Reset imageUrl state
    setProdReStock(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] }); // Update the image state with the selected file
    const imageUrl = URL.createObjectURL(e.target.files[0]); // Create URL for the selected image
    setImageUrl(imageUrl); // Set imageUrl state to display the image
  };

  useEffect(() => {
    axios
      .get(`/viewProduct/${getProdId}`)
      .then((res) => {
        const getData = res.data;
        console.log("data here", getData);
        setFormData((prevFormData) => ({
          ...prevFormData,
          prod_name: getData.prod_name,
          prod_price: getData.prod_price,
          category_name: getData.category_name,
          quantity: getData.quantity,
          re_stock: getData.re_stock,
          // Only update the image field if it exists in the received data
          ...(getData.image_filename && { image: getData.image_filename }),
        }));
        setProdQuant(getData.quantity);
        setProdReStock(getData.re_stock);
        setProdCat(getData.category_name);
        const imageUrl = `/assets/product-image/${getData.image_filename}`;
        setImageUrl(imageUrl);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getProdId]);

  const handleUpdateDataProducts = async () => {
    try {
      const formDataToSend = new FormData(); // Create a FormData object to send both text and image data
      formDataToSend.append("prod_name", formData.prod_name);
      formDataToSend.append("category_name", prodCat);
      formDataToSend.append("prod_price", formData.prod_price);
      formDataToSend.append("quantity", prodQuant);
      formDataToSend.append("re_stock", prodReStock);
      if (formData.image) {
        // If there's a new image, append it to FormData
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.put(
        `/updateProduct/${getProdId}`,
        formDataToSend
      );
      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Updated Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchAllProducts();
        fetchReStock();
        setFormData({
          prod_name: "",
          prod_price: 0,
          image: null,
        });
        setProdCat("");
        setProdQuant(0);
        setProdReStock(0);
        setImageUrl(null); // Reset imageUrl state
      }
    } catch (err) {
      console.error("Error updating product:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  return (
    <>
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: true, amount: 0.3 }}
        className="border-solid border-2 border-teal-700 pt-1 pb-5 px-6 shadow-xl text-center h-full">
        {getProdId ? <h2>Update Product Item</h2> : <h2>Add Product Item</h2>}
        <form>
          <div className="mt-6">
            <div className="w-full">
              <label htmlFor="image" className="font-semibold text-lg italic ">
                Product Image
              </label>
              {imageUrl ? (
                <div className="flex justify-center mt-2">
                  <div className="w-40 h-40 bg-[#999696] shadow-lg">
                    <img
                      src={imageUrl}
                      alt="Product"
                      className="max-w-full p-2 h-auto prod-img"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mt-2">
                  <div className="w-40 h-40 bg-[#999696] shadow-lg relative">
                    <img src={emptyBox} className="prod-img" alt="Empty Box" />
                    <p className="text-white absolute bottom-0 w-full text-center uppercase font-semibold pb-1">
                      upload image
                    </p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="appearance-none mt-5 mb-5"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="prod_name"
                className="font-semibold text-lg italic">
                Product Name
              </label>
              <input
                className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mt-2 mb-5"
                type="text"
                name="prod_name"
                value={formData.prod_name}
                onChange={handleInputChange}
                placeholder="eg. milo"
              />
            </div>
            <div className="grid grid-cols-4 gap-5">
              <div className="col-span-1">
                <label
                  htmlFor="category_name"
                  className="font-semibold text-lg italic">
                  Category
                </label>
                <select
                  className="appearance-none block uppercase w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mt-2"
                  name="category_name"
                  value={prodCat}
                  onChange={handleProdCat}>
                  <option value="">Select Category</option>
                  {categoryName.map((d, index) => (
                    <option
                      key={index}
                      value={d.category_name}
                      className="uppercase">
                      {d.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="prod_price"
                  className="font-semibold text-lg italic">
                  Price
                </label>
                <input
                  className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mt-2"
                  type="number"
                  name="prod_price"
                  value={formData.prod_price}
                  onChange={handleInputChange}
                  placeholder="Input Price . . ."
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="quantity"
                  className="font-semibold text-lg italic">
                  Quantity
                </label>
                <input
                  className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mt-2"
                  type="number"
                  name="quantity"
                  value={prodQuant}
                  onChange={handleProdQuant}
                  placeholder="Input Quantity..."
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="re-stock"
                  className="font-semibold text-lg italic">
                  Re-Stock Limiter
                </label>
                <input
                  className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mt-2"
                  type="number"
                  name="re-stock"
                  value={prodReStock}
                  onChange={handleProdReStock}
                  placeholder="Re-stock"
                />
              </div>
            </div>
            {getProdId ? (
              <div>
                <button
                  onClick={() => {
                    handleUpdateData();
                    handleUpdateDataProducts();
                  }}
                  className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full uppercase flex gap-2 justify-center"
                  type="button">
                  <UploadIcon />
                  update
                </button>
                <button
                  onClick={() => {
                    handleCancel();
                  }}
                  className="text-white bg-red-500 hover:bg-[#a93737] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full uppercase flex gap-2 justify-center"
                  type="button">
                  <X />
                  cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleInsertData}
                className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full uppercase flex justify-center gap-2"
                type="button">
                <UploadIcon />
                Save
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </>
  );
}

export default AddProduct;
