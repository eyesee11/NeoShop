"use client";

import { useState, useEffect } from "react";
import { Product, ProductFormData } from "@/types/product";
import { useToast } from "@/components/ToastProvider";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    inventory: 0,
  });
  const { success, error } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "inventory"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get API key from user prompt (should be stored securely in production)
    const apiKey = prompt("Enter Admin API Key:");
    if (!apiKey) {
      error("API key is required");
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        success(`✅ Product "${formData.name}" added successfully!`);
        setFormData({
          name: "",
          description: "",
          price: 0,
          category: "",
          inventory: 0,
        });
        setShowAddForm(false);
        fetchProducts();
      } else {
        error("Failed to add product. Please try again.");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      error("An error occurred while adding the product.");
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Get API key from user prompt (should be stored securely in production)
    const apiKey = prompt("Enter Admin API Key:");
    if (!apiKey) {
      error("API key is required");
      return;
    }

    try {
      const response = await fetch(
        `/api/products/update/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        success(`✅ Product "${formData.name}" updated successfully!`);
        setEditingProduct(null);
        setFormData({
          name: "",
          description: "",
          price: 0,
          category: "",
          inventory: 0,
        });
        fetchProducts();
      } else {
        error("Failed to update product. Please try again.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      error("An error occurred while updating the product.");
    }
  };

  const startEditing = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      inventory: product.inventory,
    });
    setShowAddForm(false);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      inventory: 0,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-4xl font-black animate-pulse">
            Loading Admin Panel...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 border-4 border-black p-8 bg-gradient-to-r from-pink-200 to-purple-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-5xl font-black uppercase mb-2">Admin Panel</h1>
        <p className="text-lg font-bold">Manage your product inventory</p>
      </div>

      {/* Add Product Button */}
      <div className="mb-8">
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProduct(null);
            setFormData({
              name: "",
              description: "",
              price: 0,
              category: "",
              inventory: 0,
            });
          }}
          className="px-6 py-3 border-4 border-black font-bold uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gradient-to-r from-green-300 to-blue-300"
        >
          ➕ Add New Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingProduct) && (
        <div className="mb-8 border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase mb-6">
            {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          <form
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            className="space-y-4"
          >
            <div>
              <label className="block font-bold mb-2 uppercase text-sm">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 uppercase text-sm">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Inventory
                </label>
                <input
                  type="number"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-3 border-4 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-green-300"
              >
                {editingProduct ? "✅ Update Product" : "➕ Add Product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  cancelEditing();
                }}
                className="px-6 py-3 border-4 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gray-300"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="border-4 border-black p-6 bg-white/90 backdrop-blur-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-black uppercase mb-6">
          📦 All Products ({products.length})
        </h2>

        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border-4 border-black p-4 bg-gradient-to-r from-blue-50 to-purple-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-black mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm font-bold">
                    <span>💰 ${product.price}</span>
                    <span>📦 {product.inventory} in stock</span>
                    <span>🏷️ {product.category}</span>
                    <span>
                      🔄 Updated:{" "}
                      {new Date(product.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => startEditing(product)}
                  className="ml-4 px-4 py-2 border-4 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-yellow-300"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rendering Info */}
      <div className="mt-8 p-4 border-4 border-black bg-pink-100/80 backdrop-blur-sm">
        <p className="text-sm font-bold">
          ℹ️ <strong>Rendering Info:</strong> This admin panel uses{" "}
          <span className="bg-yellow-300 px-2 py-1">
            Client-Side Rendering (CSR)
          </span>
          to fetch and update products dynamically. All API routes are protected
          with API key authentication.
        </p>
      </div>
    </div>
  );
}
