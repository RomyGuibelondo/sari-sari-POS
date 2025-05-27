import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [editId, setEditId] = useState(null);

  const productsRef = collection(db, "products");

  useEffect(() => {
    const q = query(productsRef, orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const addOrUpdateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) return;

    if (editId) {
      // ✅ Update
      const docRef = doc(db, "products", editId);
      await updateDoc(docRef, {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
      });
      setEditId(null);
    } else {
      // ➕ Add
      await addDoc(productsRef, {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
      });
    }

    setNewProduct({ name: "", price: "", quantity: "" });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
    setEditId(product.id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        🧃 Inventory Manager
      </h1>

      {/* Product Form */}
      <form
        onSubmit={addOrUpdateProduct}
        className="bg-white p-4 rounded-xl shadow-md mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          {editId ? "✏️ Update Product" : "➕ Add Product"}
        </button>
      </form>

      {/* Product List */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">₱{product.price}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-sm text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryPage;
