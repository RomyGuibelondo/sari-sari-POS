import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InventoryPage from "./features/inventory/InventoryPage";
import POSPage from "./features/pos/POSPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          🏪 Sari-Sari POS
        </h1>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-6">
          <Link
            to="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            🧾 Inventory
          </Link>
          <Link
            to="/pos"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            💰 POS
          </Link>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<InventoryPage />} />
          <Route path="/pos" element={<POSPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
