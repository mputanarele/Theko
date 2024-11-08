const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "inventory_system",
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error("Database connection error: ", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Register user endpoint
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password: ", err);
      return res.status(500).json({ error: "Error hashing password" });
    }

    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err, results) => {
        if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

// Login user endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ message: "Login successful", token });
    });
  });
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ error: "Failed to authenticate token" });
    req.userId = decoded.id;
    next();
  });
};

// Get products endpoint
app.get("/api/products", verifyToken, (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching products: ", err);
      return res.status(500).json({ error: "Error fetching products" });
    }
    res.json(results);
  });
});

// Add product endpoint
app.post("/api/products", verifyToken, (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  if (!name || !description || !category || !price || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)",
    [name, description, category, price, quantity],
    (err, results) => {
      if (err) {
        console.error("Error adding product: ", err);
        return res.status(500).json({ error: "Error adding product" });
      }
      res.status(201).json({
        message: "Product added successfully",
        productId: results.insertId,
      });
    }
  );
});

// Update product endpoint
app.put("/api/products/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, quantity } = req.body;
  if (!name || !description || !category || !price || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?",
    [name, description, category, price, quantity, id],
    (err, results) => {
      if (err) {
        console.error("Error updating product: ", err);
        return res.status(500).json({ error: "Error updating product" });
      }
      res.json({ message: "Product updated successfully" });
    }
  );
});

// Delete product endpoint
app.delete("/api/products/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM products WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error deleting product: ", err);
      return res.status(500).json({ error: "Error deleting product" });
    }

    res.json({ message: "Product deleted successfully" });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
