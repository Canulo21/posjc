const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "react_pos",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/product-image");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get the file extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Generate a unique suffix
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Set filename as fieldname-timestamp-suffix.extension
  },
});

const upload = multer({
  storage: storage,
});

// Serve static files from the 'src/assets/product-image' directory
app.use("/assets/product-image", express.static("src/assets/product-image"));

//** For Users  **//

// Login API endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const query =
    "SELECT * FROM users WHERE username = ? AND status = 'accepted'";
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Update isActive to true
      const updateQuery = "UPDATE users SET isActive = true WHERE id = ?";
      db.query(updateQuery, [user.id], (updateErr, updateResults) => {
        if (updateErr) {
          console.error("Error updating isActive:", updateErr);
          return res.status(500).json({ error: "Internal server error" });
        }
        // Check if the user is an admin
        const isAdmin = user.role === "Admin";
        const getUserId = user.id;

        res.json({
          message: "Login successful",
          user: {
            id: getUserId,
            username: user.username,
            fname: user.fname,
            lname: user.lname,
            role: user.role,
            isAdmin: isAdmin,
          },
        });
      });
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

// Logout API endpoint
app.post("/logout", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const updateQuery = "UPDATE users SET isActive = false WHERE id = ?";
  db.query(updateQuery, [userId], (err, result) => {
    if (err) {
      console.error("Error updating isActive status:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json({ message: "Logged out successfully" });
  });
});

// Users Regitration
app.post("/register", async (req, res) => {
  const { fname, mname, lname, role, status, isActive, username, password } =
    req.body;

  if (!fname || !role || !lname || !username || !password) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  try {
    // Check if the username already exists in the database
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ Message: "Error" });
        }

        if (results.length > 0) {
          // If username already exists, return an error
          return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

        const query =
          "INSERT INTO users (fname, mname, lname, role, status, isActive, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(
          query,
          [
            fname,
            mname,
            lname,
            role,
            status,
            isActive,
            username,
            hashedPassword,
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ Message: "Error" });
            }
            return res.status(200).json({ Status: "Success" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    return res.status(500).json({ Message: "Error" });
  }
});

// get users
app.get("/viewUsers", (req, res) => {
  const query = "SELECT * FROM users WHERE status = 'accepted' ORDER BY lname";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

// get users that are pendeing
app.get("/pendingUsers", (req, res) => {
  const query = "SELECT * FROM users WHERE STATUS = 'pending'";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

//accept pending user
app.put("/acceptUser/:id", (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;

  const query = "UPDATE users SET status = ? WHERE id = ?";

  db.query(query, ["accepted", userId], (err, result) => {
    if (err) {
      console.error("Error updating user status:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ updated: true, result });
  });
});

// remove user
app.delete("/deleteUser/:id", (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      res.status(200).json({ message: "Data deleted successfully" });
    }
  });
});

// get users that are Active
app.get("/activeUsers", (req, res) => {
  const query = "SELECT * FROM users WHERE isActive = True";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

//** End For Users  **//

// -----------------------------------------------------------

//** For Products  **//
app.get("/category", (req, res) => {
  const query = "SELECT * FROM product_category ORDER BY category_name";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

app.post("/addCategory", (req, res) => {
  const { category_name, category_color } = req.body;

  if (!category_name || !category_color) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  const queryMaxCategoryId =
    "SELECT MAX(category_id) AS max_category_id FROM product_category";
  db.query(queryMaxCategoryId, (err, result) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    let newCategoryId = 100; // Default start value
    if (result && result[0] && result[0].max_category_id !== null) {
      newCategoryId = parseInt(result[0].max_category_id) + 1;
    }

    const queryInsertCategory =
      "INSERT INTO product_category(category_id, category_name, category_color) VALUES (?, ?, ?)";
    db.query(
      queryInsertCategory,
      [newCategoryId, category_name, category_color],
      (err, result) => {
        if (err) {
          return res.status(500).json({ Message: "Error" });
        }
        return res.status(200).json({ Status: "Success" });
      }
    );
  });
});

// view Category
app.get("/viewCategory/:id", (req, res) => {
  const category_id = req.params.id;

  const query = `SELECT * FROM product_category WHERE category_id = ?`;

  db.query(query, [category_id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "Category not found" });
      } else {
        // Send the member data back to the client
        res.status(200).json(result[0]);
      }
    }
  });
});

// update category
app.put("/updateCategory/:id", (req, res) => {
  const category_id = req.params.id;
  const { data } = req.body;
  const { category_name, category_color } = data;

  if (!category_name || !category_color) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  const query =
    "UPDATE product_category SET category_name=?, category_color=? WHERE category_id=?";

  db.query(
    query,
    [category_name, category_color, category_id],
    (queryError, result) => {
      if (queryError) {
        console.error("updateError", queryError);
        return res.status(500).json({
          error: "Bad Request",
          details: queryError.message,
        });
      }
      if (!result.affectedRows) {
        return res.status(404).json({
          error: "Not found.",
        });
      }

      return res.json({ updated: true, result });
    }
  );
});

// remove category

app.delete("/deleteCategory/:id", (req, res) => {
  const cat_id = req.params.id;

  const query = "DELETE FROM product_category WHERE category_id = ?";
  db.query(query, [cat_id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      res.status(200).json({ message: "Data deleted successfully" });
    }
  });
});

// table for my all Products
app.get("/allProducts", (req, res) => {
  const query =
    "SELECT products.prod_id, products.prod_name, products.prod_price, products.image_filename, product_category.category_name, product_category.category_color, product_quantity.quantity, product_quantity.re_stock FROM products INNER JOIN product_category ON products.category_id = product_category.category_id INNER JOIN product_quantity ON products.prod_id = product_quantity.prod_id ORDER BY products.prod_name";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

// view product with id
app.get("/viewProduct/:id", (req, res) => {
  const id = req.params.id;

  const query = `SELECT products.prod_id, products.prod_name, products.prod_price, products.image_filename, product_category.category_name, product_quantity.quantity, product_quantity.re_stock FROM products INNER JOIN product_category ON products.category_id = product_category.category_id INNER JOIN product_quantity ON products.prod_id = product_quantity.prod_id WHERE products.prod_id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "Products not found" });
      } else {
        // Send the member data back to the client
        res.status(200).json(result[0]);
      }
    }
  });
});

// add Products
app.post("/addProduct", upload.single("image"), (req, res) => {
  const { prod_name, category_name, prod_price, quantity, re_stock } = req.body;
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send("Image is required");
  }

  const image_filename = req.file.filename;

  // Check if any field is empty
  if (
    !prod_name ||
    !category_name ||
    !prod_price ||
    !quantity ||
    !image_filename ||
    !re_stock
  ) {
    return res.status(400).send("All fields are required");
  }

  // Check if prod_name already exists
  db.query(
    "SELECT * FROM products WHERE prod_name = ?",
    [prod_name],
    (error, results) => {
      if (error) {
        console.error("Error checking existing product:", error);
        return res.status(500).send("Internal server error");
      }

      if (results.length > 0) {
        // Product with the same name already exists

        return res
          .status(400)
          .send("Product with the same name already exists");
      }

      // If prod_name doesn't exist and all fields are filled, proceed with adding the product
      db.query(
        "SELECT category_id FROM product_category WHERE category_name = ?",
        [category_name],
        (error, results) => {
          if (error) {
            console.error("Error retrieving category ID:", error);
            return res.status(500).send("Internal server error");
          }

          if (results.length === 0) {
            return res.status(404).send("Category not found");
          }

          const category_id = results[0].category_id;
          const imageFilename = req.file.filename; // Get the filename of the uploaded image

          // Insert data into products table
          db.query(
            "INSERT INTO products (prod_name, category_id, prod_price, image_filename) VALUES (?, ?, ?, ?)",
            [prod_name, category_id, prod_price, imageFilename],
            (error, results) => {
              if (error) {
                console.error("Error inserting into products table:", error);
                return res.status(500).send("Internal server error");
              }

              const prod_id = results.insertId;

              // Insert data into product_quantity table
              db.query(
                "INSERT INTO product_quantity (prod_id, quantity, re_stock) VALUES (?, ?, ?)",
                [prod_id, quantity, re_stock],
                (error, results) => {
                  if (error) {
                    console.error(
                      "Error inserting into product_quantity table:",
                      error
                    );
                    return res.status(500).send("Internal server error");
                  }

                  res.status(200).send("Product added successfully");
                }
              );
            }
          );
        }
      );
    }
  );
});

// update category
app.put("/updateProduct/:id", upload.single("image"), (req, res) => {
  const prod_id = req.params.id;
  const { prod_name, category_name, prod_price, quantity, re_stock } = req.body;

  // Check if prod_name already exists excluding the current product
  db.query(
    "SELECT * FROM products WHERE prod_name = ? AND prod_id != ?",
    [prod_name, prod_id],
    (error, results) => {
      if (error) {
        console.error("Error checking existing product:", error);
        return res.status(500).send("Internal server error");
      }

      if (results.length > 0) {
        // Product with the same name already exists

        return res
          .status(400)
          .send("Product with the same name already exists");
      }

      // Check if any field is empty
      if (
        !prod_name ||
        !category_name ||
        !prod_price ||
        !quantity ||
        !re_stock
      ) {
        return res.status(400).send("All fields are required");
      }

      // Retrieve category_id for the provided category_name
      db.query(
        "SELECT category_id FROM product_category WHERE category_name = ?",
        [category_name],
        (error, results) => {
          if (error) {
            console.error("Error retrieving category ID:", error);
            return res.status(500).send("Internal server error");
          }

          if (results.length === 0) {
            return res.status(404).send("Category not found");
          }

          const category_id = results[0].category_id;

          // Check if a new image was uploaded
          let imageFilename = null;
          if (req.file) {
            imageFilename = req.file.filename;
          }

          // Update product details
          const updateQuery = imageFilename
            ? "UPDATE products SET prod_name = ?, category_id = ?, prod_price = ?, image_filename = ? WHERE prod_id = ?"
            : "UPDATE products SET prod_name = ?, category_id = ?, prod_price = ? WHERE prod_id = ?";

          const updateParams = imageFilename
            ? [prod_name, category_id, prod_price, imageFilename, prod_id]
            : [prod_name, category_id, prod_price, prod_id];

          db.query(updateQuery, updateParams, (error, results) => {
            if (error) {
              console.error("Error updating product:", error);
              return res.status(500).send("Internal server error");
            }

            // Update product quantity
            db.query(
              "UPDATE product_quantity SET quantity = ? , re_stock=? WHERE prod_id = ?",
              [quantity, re_stock, prod_id],
              (error, results) => {
                if (error) {
                  console.error("Error updating product quantity:", error);
                  return res.status(500).send("Internal server error");
                }

                res.status(200).send("Product updated successfully");
              }
            );
          });
        }
      );
    }
  );
});

// remove Prodcuts
app.delete("/deleteProduct/:id", (req, res) => {
  const prod_id = req.params.id;

  const query = "DELETE FROM products WHERE prod_id = ?";
  db.query(query, [prod_id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      res.status(200).json({ message: "Data deleted successfully" });
    }
  });
});

// if quantiy > re_stock
app.get("/reStock", (req, res) => {
  const query =
    "SELECT products.prod_name, product_quantity.re_stock, product_quantity.quantity  FROM products INNER JOIN product_quantity ON products.prod_id = product_quantity.prod_id WHERE product_quantity.re_stock >= product_quantity.quantity";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

//** End For Products  **//

// for Discounts
app.get("/viewDiscount", (req, res) => {
  const query = "SELECT * FROM order_discount";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

app.get("/viewDiscountPost", (req, res) => {
  const query = "SELECT * FROM order_discount WHERE status='Post'";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

// view Discount
app.get("/viewDiscount/:id", (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM order_discount WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "Discount not found" });
      } else {
        // Send the member data back to the client
        res.status(200).json(result[0]);
      }
    }
  });
});

// add discount
app.post("/addDiscount", (req, res) => {
  const { title, discount, status } = req.body;
  const query =
    "INSERT INTO order_discount (title, discount, status) VALUES (?, ?, ?)";

  if (!title || !discount) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  db.query(query, [title, discount, status], (err, result) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.status(200).json({ Status: "Success" });
  });
});

// remove discount
app.delete("/deleteDiscount/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM order_discount WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      res.status(200).json({ message: "Data deleted successfully" });
    }
  });
});

// update discount
app.put("/updateDiscount/:id", (req, res) => {
  const id = req.params.id;
  const { data } = req.body;
  const { title, discount, status } = data;

  if (!title || !discount) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  const query =
    "UPDATE order_discount SET title=?, discount=?, status=? WHERE id=?";

  db.query(query, [title, discount, status, id], (queryError, result) => {
    if (queryError) {
      console.error("updateError", queryError);
      return res.status(500).json({
        error: "Bad Request",
        details: queryError.message,
      });
    }
    if (!result.affectedRows) {
      return res.status(404).json({
        error: "Not found.",
      });
    }

    return res.json({ updated: true, result });
  });
});

// end For Discount

// start for order report
app.post("/report", (req, res) => {
  try {
    const orderData = req.body;

    // Construct a new Date object using components from the original date string
    const dateComponents = orderData.date.split("/");
    const formattedDate = new Date(
      parseInt(dateComponents[2]), // Year
      parseInt(dateComponents[0]) - 1, // Month (subtract 1 because months are 0-indexed)
      parseInt(dateComponents[1]), // Day
      12,
      0,
      0 // Set the time to noon to avoid timezone issues
    );

    // Format the date as 'YYYY-MM-DD'
    const formattedDateString = formattedDate.toISOString().split("T")[0];

    // Insert the order data into the MySQL database
    db.query(
      "INSERT INTO orders SET ?",
      {
        date: formattedDateString,
        time: orderData.time,
        discounted_total: orderData.discountedTotal,
        selected_discount_category: orderData.selectedDiscountCategory,
        total_discount: orderData.totalDiscount,
        fname: orderData.fname, // Add fname
        lname: orderData.lname, // Add lname
      },
      (error, results) => {
        if (error) {
          console.error("Error saving order:", error);
          res.status(500).json({ error: "Failed to save order" });
          return;
        }

        // Get the ID of the inserted order
        const orderId = results.insertId;

        // Insert order items into the MySQL database
        const items = orderData.items.map((item) => [
          orderId,
          item.name,
          item.quantity,
          item.price,
          item.prod_id, // Include prod_id when constructing items array
        ]);

        db.query(
          "INSERT INTO order_items (order_id, name, quantity, price, prod_id) VALUES ?",
          [items],
          (error, results) => {
            if (error) {
              console.error("Error saving order items:", error);
              res.status(500).json({ error: "Failed to save order items" });
              return;
            }

            // Update product_quantity table to deduct purchased quantity
            orderData.items.forEach((item) => {
              db.query(
                "UPDATE product_quantity SET quantity = quantity - ? WHERE prod_id = ?",
                [item.quantity, item.prod_id],
                (error, results) => {
                  if (error) {
                    console.error("Error updating product quantity:", error);
                    return;
                  }
                }
              );
            });

            res
              .status(201)
              .json({ message: "Order and items saved successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// end

// income
app.get("/chartReport", (req, res) => {
  const query =
    "SELECT DATE(DATE) AS DATE, SUM(discounted_total) AS total_income FROM orders GROUP BY DATE(DATE)";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

// filter by date
app.get("/searchDateChart", (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const query = `
    SELECT DATE(date) AS date,
           SUM(discounted_total) AS total_income
    FROM orders
    WHERE date >= ? AND date <= ?
    GROUP BY DATE(date)
  `;

  // Execute the query with the provided start and end dates
  db.query(query, [startDate, endDate], (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

// filter by year
app.get("/searchDateChartByYear", (req, res) => {
  const year = req.query.year; // Assuming year is passed as a query parameter

  // SQL query to fetch total income for each month of the specified year
  const query = `
    SELECT 
      YEAR(date) AS year,
      MONTH(date) AS month,
      SUM(discounted_total) AS total_income
    FROM orders
    WHERE YEAR(date) = ?
    GROUP BY YEAR(date), MONTH(date)
  `;

  // Execute the query with the provided year
  db.query(query, [year], (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

app.get("/dailyIncome", (req, res) => {
  const query = `
    SELECT DATE(date) AS date, SUM(discounted_total) AS total_income
    FROM orders
    WHERE DATE(date) = CURDATE()
    GROUP BY DATE(date)
  `;
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(
      data[0] || {
        date: new Date().toISOString().split("T")[0],
        total_income: 0,
      }
    );
  });
});

app.get("/weeklyIncome", (req, res) => {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((today - firstDayOfYear) / 86400000 + firstDayOfYear.getDay() + 1) / 7
  );

  const query = `
    SELECT YEARWEEK(date, 1) AS week, SUM(discounted_total) AS total_income
    FROM orders
    WHERE YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1)
    GROUP BY YEARWEEK(date, 1)
  `;
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(
      data[0] || {
        week: `${today.getFullYear()}-${weekNumber}`,
        total_income: 0,
      }
    );
  });
});

app.get("/monthlyIncome", (req, res) => {
  const query = `
    SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(discounted_total) AS total_income
    FROM orders
    WHERE DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
    GROUP BY DATE_FORMAT(date, '%Y-%m')
  `;
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(
      data[0] || {
        month: new Date().toISOString().slice(0, 7),
        total_income: 0,
      }
    );
  });
});

// most sales items
app.get("/mostSold", (req, res) => {
  const query =
    "SELECT prod_id, NAME, SUM(quantity) AS total_sold FROM order_items GROUP BY prod_id, NAME ORDER BY total_sold DESC LIMIT 5";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

app.get("/lessSold", (req, res) => {
  const query =
    "SELECT prod_id, NAME, SUM(quantity) AS total_sold FROM order_items GROUP BY prod_id, NAME ORDER BY total_sold ASC LIMIT 5";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

// get report for sales
app.get("/reportSalesLogs", (req, res) => {
  const query = `
   SELECT 
    NO,
    name, 
    quantity, 
    total_price, 
    discounted_price, 
    date 
FROM (
    SELECT 
        ROW_NUMBER() OVER (ORDER BY a.id ASC) AS NO,
        a.name, 
        a.quantity, 
        (a.quantity * a.price) AS total_price, 
        ROUND(((a.quantity * a.price) * (100 - b.total_discount) / 100), 2) AS discounted_price, 
        b.date 
    FROM 
        order_items AS a 
    INNER JOIN 
        orders AS b ON a.order_id = b.id 
) AS numbered_data
ORDER BY 
    NO DESC
  `;

  // Execute the query with the provided year
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

// get cashier sales
app.get("/cashierDailyIncome", (req, res) => {
  const cashierName = req.query.cashierName; // Assuming you're passing the cashier's name as a query parameter
  const query = `
    SELECT DATE(DATE) AS DATE, 
           SUM(discounted_total) AS total_income, 
           CONCAT(fname, ' ', lname) AS Cashier
    FROM orders
    WHERE DATE(DATE) = CURDATE() AND CONCAT(fname, ' ', lname) = ?
    GROUP BY DATE(DATE), Cashier
  `;
  db.query(query, [cashierName], (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(
      data[0] || {
        date: new Date().toISOString().split("T")[0],
        total_income: 0,
      }
    );
  });
});

app.get("/cashierWeeklyIncome", (req, res) => {
  const cashierName = req.query.cashierName;
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((today - firstDayOfYear) / 86400000 + firstDayOfYear.getDay() + 1) / 7
  );

  const query = `
    SELECT YEARWEEK(DATE, 1) AS WEEK, SUM(discounted_total) AS total_income
    FROM orders
    WHERE YEARWEEK(DATE, 1) = YEARWEEK(CURDATE(), 1)
    AND CONCAT(fname, ' ', lname) = ?
    GROUP BY YEARWEEK(DATE, 1)
  `;
  db.query(query, [cashierName], (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(
      data[0] || {
        week: `${today.getFullYear()}-${weekNumber}`,
        total_income: 0,
      }
    );
  });
});

app.get("/cashierMonthlyIncome", (req, res) => {
  const cashierName = req.query.cashierName;
  const query = `
    SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(discounted_total) AS total_income
    FROM orders
    WHERE DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
     AND CONCAT(fname, ' ', lname) = ?
    GROUP BY DATE_FORMAT(date, '%Y-%m')
  `;
  db.query(query, [cashierName], (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(
      data[0] || {
        month: new Date().toISOString().slice(0, 7),
        total_income: 0,
      }
    );
  });
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
