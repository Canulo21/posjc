import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MinusIcon, PlusIcon, ShoppingBasketIcon } from "lucide-react";

function DashBoardCashierAddtoCart({ selectedProductIds, user }) {
  const [getDiscount, setGetDiscount] = useState([]);
  const [getTheDiscount, setGetTheDiscount] = useState(0);
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [selectedDiscountCategory, setSelectedDiscountCategory] = useState("");

  const fname = user.fname;
  const lname = user.lname;

  const fetchProducts = async () => {
    try {
      if (selectedProductIds.length === 0) {
        setProducts([]); // Reset products if no product is selected
        return;
      }

      const productRequests = selectedProductIds.map((productId) =>
        axios.get(`/viewProduct/${productId}`)
      );

      const responses = await Promise.all(productRequests);

      const productsData = responses.map((res) => res.data);

      // Initialize product quantities with default value of 0
      const initialProductQuantities = selectedProductIds.reduce(
        (acc, productId) => {
          acc[productId] = 1;
          return acc;
        },
        {}
      );

      setProducts(productsData);
      setProductQuantities(initialProductQuantities);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedProductIds]);

  const handleInput = async (e, productId) => {
    const quantity = parseInt(e.target.value);
    setProductQuantities({ ...productQuantities, [productId]: quantity });
  };

  const handleMinus = (productId) => {
    const currentQuantity = productQuantities[productId];
    if (currentQuantity > 1) {
      setProductQuantities({
        ...productQuantities,
        [productId]: currentQuantity - 1,
      });
    }
  };

  const handlePlus = (productId) => {
    const currentQuantity = productQuantities[productId];
    const product = products.find((p) => p.prod_id === productId);
    if (currentQuantity < product.quantity) {
      setProductQuantities({
        ...productQuantities,
        [productId]: currentQuantity + 1,
      });
    }
  };

  // for discount
  const fetchDiscount = async () => {
    try {
      const res = await axios.get("/viewDiscountPost");
      const allDiscount = res.data;
      setGetDiscount(allDiscount);
    } catch (err) {
      console.error("Error fetching discounts:", err);
    }
  };

  useEffect(() => {
    fetchDiscount();
  }, []);

  const handleDiscountCategoryChange = (e) => {
    const selectedTitle = e.target.value;
    const selectedDiscount = getDiscount.find(
      (discount) => discount.title === selectedTitle
    );
    setSelectedDiscountCategory(selectedTitle);
    if (selectedDiscount) {
      setGetTheDiscount(selectedDiscount.discount);
    } else {
      setGetTheDiscount(0); // Reset to 0 if 'None' is selected or no discount found
    }
  };

  const totalPrice = products.reduce((total, product) => {
    return total + product.prod_price * productQuantities[product.prod_id];
  }, 0);

  const totalPriceWDiscount = totalPrice - (totalPrice * getTheDiscount) / 100;

  // for placeOrder

  const handlePlacedOrder = async () => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US");
      const formattedTime = currentDate.toLocaleTimeString("en-US");

      // Map products with quantities and prod_ids
      const items = products.map((product) => ({
        name: product.prod_name,
        quantity: productQuantities[product.prod_id],
        price: product.prod_price,
        prod_id: product.prod_id, // Include prod_id
      }));

      const receiptItems = items.map(
        (item) =>
          `<p>${item.name} ${item.price} x ${item.quantity} = ${(
            item.price * item.quantity
          ).toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
          })}</p>`
      );

      Swal.fire({
        title: "Receipt",
        html: `
          <div class="time-wrap">
            <p>Date: ${formattedDate}</p>
            <p>Time: ${formattedTime}</p>
          </div>
      
          <hr>
          <div class="item-wrap">
            ${receiptItems.join("")}
          </div>

          <hr>
          <div class="price-wrap">
            <p>Total: ${totalPriceWDiscount}</p>
            <p>Discount: ${getTheDiscount}%</p>
            <p>Discounted Total: ${totalPriceWDiscount}</p>
          </div>
            <hr>
          <div class="under-wrap">
            <p>Cashier:  ${fname} ${lname} </p>
          </div>
            <hr>
      
        `,
        confirmButtonText: "Done",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post("/report", {
              date: formattedDate,
              time: formattedTime,
              items,
              selectedDiscountCategory,
              totalDiscount: getTheDiscount,
              discountedTotal: totalPriceWDiscount,
              fname: fname,
              lname: lname,
            })
            .then((response) => {
              if (response.status === 201) {
                // Show success message after successful order placement
                Swal.fire({
                  icon: "success",
                  title: "Order Placed Successfully!",
                  showConfirmButton: false,
                  timer: 1500,
                });

                // Clear the cart after placing order
                setProducts([]);
                setProductQuantities({});
                setSelectedDiscountCategory("");
                setGetTheDiscount(0);

                setTimeout(() => {
                  document.location.reload();
                }, 500);
              } else {
                console.error("Failed to save order:", response.data.error);
              }
            })
            .catch((error) => {
              if (error.response) {
                Swal.fire({
                  icon: "error",
                  title: "Oppssss ...",
                  text: error.response.data
                    ? error.response.data
                    : "An unexpected error occurred. Please try again later.",
                });
              }
            });
        }
      });
    } catch (error) {
      if (error.response) {
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

  return (
    <>
      <div className="shadow-lg border-solid border-2 border-lime-700 pt-1 px-2 pb-5 h-fit mt-5 bg-[#fff]">
        <h3 className="text-center mb-5">Add to Cart</h3>
        {products.length > 0 ? (
          <div>
            <table className="w-full add-cart">
              <thead>
                <tr>
                  <th className="text-center pb-3">Item</th>
                  <th className="text-center pb-3">Quantity</th>
                  <th className="text-center pb-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={index}
                    className="text-center uppercase font-semibold">
                    <td>{product.prod_name}</td>
                    <td className="counter flex gap-2 justify-center">
                      <button
                        className="bg-red-500 hover:bg-[#a93737] text-white px-1"
                        onClick={() => handleMinus(product.prod_id)}>
                        <MinusIcon />
                      </button>
                      <input
                        className="w-10 border-2 border-solid border-slate-400 text-center"
                        type="number"
                        value={productQuantities[product.prod_id]}
                        onChange={(e) => handleInput(e, product.prod_id)}
                        min="1"
                        max={product.quantity} // Set the max attribute dynamically
                      />
                      <button
                        className="bg-blue-500 hover:bg-[#2e5491]  text-white px-1"
                        onClick={() => handlePlus(product.prod_id)}>
                        <PlusIcon />
                      </button>
                    </td>
                    <td>
                      P{product.prod_price} x{" "}
                      {productQuantities[product.prod_id]}
                      <span className="px-2">=</span>
                      {(
                        product.prod_price * productQuantities[product.prod_id]
                      ).toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="discount-wrap  border-solid border-y-2 border-lime-700 mt-5 pb-3">
              <div className="mt-3">
                <label className="text-sm font-bold block text-left uppercase mb-1 italic">
                  Discount Category
                </label>
                <select
                  className="appearance-none block uppercase w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight font-semibold focus:outline-none focus:bg-white focus:border-gray-500"
                  name="status"
                  value={selectedDiscountCategory}
                  onChange={handleDiscountCategoryChange}>
                  <option value={""}>None</option>
                  {getDiscount.map((discount, index) => (
                    <option key={index} value={discount.title}>
                      {discount.title} - {discount.discount}%
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="total-wraper mt-5">
              <p className="text-2xl font-semibold">
                Total:{" "}
                {totalPrice.toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </p>
              <p className="text-2xl font-semibold pt-2">
                Discounted Total:{" "}
                {totalPriceWDiscount.toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </p>
            </div>
            <div>
              <button
                className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full uppercase flex justify-center gap-2"
                onClick={handlePlacedOrder}>
                <ShoppingBasketIcon />
                Placed Order
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-center text-3xl italic opacity-40">
              No Order Yet. . .
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default DashBoardCashierAddtoCart;
