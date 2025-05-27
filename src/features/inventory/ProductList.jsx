// src/features/inventory/ProductList.jsx

const ProductList = ({ products, onEdit, onDelete }) => {
  if (products.length === 0)
    return <p className="text-gray-500 text-center">No products added yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 border">Name</th>
            <th className="px-3 py-2 border">Category</th>
            <th className="px-3 py-2 border">Price</th>
            <th className="px-3 py-2 border">Stock</th>
            <th className="px-3 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="text-center border-t">
              <td className="px-3 py-2 border">{p.name}</td>
              <td className="px-3 py-2 border">{p.category}</td>
              <td className="px-3 py-2 border">₱ {p.price.toFixed(2)}</td>
              <td className="px-3 py-2 border">{p.stockQuantity}</td>
              <td className="px-3 py-2 border">
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
