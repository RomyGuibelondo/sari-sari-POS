import { doc, updateDoc, getDoc } from "firebase/firestore"; // Make sure this is at the top
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [stockInputs, setStockInputs] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const getTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const clearCart = () => setCart([]);

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };
  const checkout = async () => {
    try {
      for (const item of cart) {
        const productRef = doc(db, "products", item.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock;

          if (currentStock >= item.quantity) {
            await updateDoc(productRef, {
              stock: currentStock - item.quantity,
            });
          } else {
            alert(`Not enough stock for ${item.name}`);
            return;
          }
        }
      }

      alert("✅ Checkout complete!");
      clearCart();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("❌ Failed to checkout. Try again.");
    }
  };
  const addStock = async (productId) => {
    const quantity = parseInt(stockInputs[productId]);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const currentStock = productSnap.data().stock || 0;
        await updateDoc(productRef, {
          stock: currentStock + quantity,
        });
        alert(
          `✅ Successfully added ${quantity} stock for ${
            productSnap.data().name
          }`
        );
      }
    } catch (error) {
      console.error("Add stock error:", error);
      alert("❌ Failed to add stock.");
    }
  };

  const handleStockInput = (productId, value) => {
    setStockInputs((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Cart Section */}
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">🧺 Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-400 italic">Cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {item.name} × {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₱{item.price} each — ₱{item.price * item.quantity}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 flex flex-col md:flex-row items-center gap-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <input
                    type="number"
                    min="1"
                    placeholder="Add stock"
                    className="border rounded px-2 py-1 w-24 text-sm"
                    onChange={(e) => handleStockInput(item.id, e.target.value)}
                  />
                  <button
                    onClick={() => addStock(item.id)}
                    className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
                  >
                    ➕ Add Stock
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <hr className="my-4" />

        <div className="flex justify-between text-lg font-semibold text-gray-700">
          <span>Total:</span>
          <span>₱{getTotal()}</span>
        </div>

        <button
          onClick={clearCart}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          🗑️ Clear Cart
        </button>
        <button
          onClick={checkout}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          ✅ Checkout
        </button>
      </div>
      {/* Product List */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold">{product.name}</h2>
            <p>₱{product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => addToCart(product)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                ➕ Add to Cart
              </button>

              {/* Add Stock Input and Button */}
              <input
                type="number"
                min="1"
                placeholder="Add stock"
                value={stockInputs[product.id] || ""}
                onChange={(e) => handleStockInput(product.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              <button
                onClick={() => addStock(product.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                ➕ Add Stock
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Product List */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-800">{product.name}</h2>
            <p className="text-gray-600 mb-1">₱{product.price}</p>
            <p className="text-sm text-gray-500 mb-2">
              Stock: {product.stock ?? 0}
            </p>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white w-full py-1 rounded hover:bg-blue-600"
            >
              ➕ Add to Cart
            </button>

            {/* Add Stock Section */}
            <div className="mt-4 space-y-2">
              <input
                type="number"
                min="1"
                placeholder="Stock qty"
                value={stockInputs[product.id] || ""}
                onChange={(e) => handleStockInput(product.id, e.target.value)}
                className="border rounded px-2 py-1 w-full text-sm"
              />
              <button
                onClick={() => addStock(product.id)}
                className="bg-green-500 text-white w-full py-1 rounded hover:bg-green-600"
              >
                ➕ Add Stock
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default POSPage;
