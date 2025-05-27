// src/features/inventory/ProductForm.jsx
import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  category: "",
  price: "",
  stockQuantity: "",
  barcode: "",
};

const ProductForm = ({ onSubmit, initialData, onCancel }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stockQuantity" ? +value : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price)
      return alert("Fill all required fields.");
    onSubmit(form);
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="border rounded px-3 py-2 w-full"
      />
      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="border rounded px-3 py-2 w-full"
      />
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        className="border rounded px-3 py-2 w-full"
      />
      <input
        type="number"
        name="stockQuantity"
        value={form.stockQuantity}
        onChange={handleChange}
        placeholder="Stock Quantity"
        className="border rounded px-3 py-2 w-full"
      />
      <input
        type="text"
        name="barcode"
        value={form.barcode}
        onChange={handleChange}
        placeholder="Barcode (optional)"
        className="border rounded px-3 py-2 w-full"
      />

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {initialData ? "Update" : "Add Product"}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
