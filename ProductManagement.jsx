import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // Description field
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch products on initial load
  useEffect(() => {
    axios.get("http://localhost:3000/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Add a new product
  const handleAddProduct = () => {
    if (!name || !description || !category || !price || !quantity) {
      alert("All fields are required!");
      return;
    }

    axios.post("http://localhost:3000/api/products", { name, description, category, price, quantity })
      .then((response) => {
        alert(response.data.message);
        setProducts([...products, { id: response.data.productId, name, description, category, price, quantity }]);
        setName("");
        setDescription(""); // Reset description
        setCategory("");
        setPrice("");
        setQuantity("");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  // Edit a product
  const handleEditProduct = () => {
    if (!name || !description || !category || !price || !quantity || !editId) {
      alert("All fields are required and product must be selected for editing!");
      return;
    }

    axios.put(`http://localhost:3000/api/products/${editId}`, { name, description, category, price, quantity })
      .then((response) => {
        alert(response.data.message);
        const updatedProducts = products.map(product =>
          product.id === editId ? { ...product, name, description, category, price, quantity } : product
        );
        setProducts(updatedProducts);
        setEditId(null);
        setName("");
        setDescription(""); // Reset description
        setCategory("");
        setPrice("");
        setQuantity("");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  // Delete a product
  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios.delete(`http://localhost:3000/api/products/${id}`)
        .then((response) => {
          alert(response.data.message);
          setProducts(products.filter((product) => product.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    }
  };

  // Handle selecting a product for editing
  const handleSelectProduct = (product) => {
    setName(product.name);
    setDescription(product.description); // Set description for editing
    setCategory(product.category);
    setPrice(product.price);
    setQuantity(product.quantity);
    setEditId(product.id);
  };

  return (
    <div>
      <h2>Product Management</h2>

      {/* Add Product Form */}
      <div>
        <h3>Add New Product</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Description input
        />
        <input
          type="text"
          placeholder="Product Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}  // Category input
        />
        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Product Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {/* Edit Product Form */}
      {editId && (
        <div>
          <h3>Edit Product</h3>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}  // Edit description
          />
          <input
            type="text"
            placeholder="Product Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}  // Edit category
          />
          <input
            type="number"
            placeholder="Product Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Product Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button onClick={handleEditProduct}>Update Product</button>
        </div>
      )}

      {/* Products List Table */}
      <div>
        <h3>Product List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th> {/* Display Description */}
              <th>Category</th>  {/* Display Category */}
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>  {/* Actions column for Edit/Delete */}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td> {/* Show description */}
                <td>{product.category}</td> {/* Show category */}
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => handleSelectProduct(product)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
