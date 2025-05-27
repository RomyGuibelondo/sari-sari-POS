import { useState } from "react";
import "tailwindcss";
import "./App.css";
import InventoryPage from "./features/inventory/InventoryPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-3xl font-bold underline text-center text-green-600">
        Sari-Sari POS is alive! 🎉
        <InventoryPage />
      </h1>
    </>
  );
}

export default App;
