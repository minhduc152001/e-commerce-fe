import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Simulated product data
  const products = [{ id: 1, name: "Product 1", price: "$10" }];

  const handleSignOut = () => {
    setIsAuthenticated(false); // Simulate sign-out
    alert("Signed out!");
  };

  const handleViewProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="p-4 max-w-[420px] mx-auto">
      {/* Navigation Menu */}
      <nav className="flex justify-between items-center mb-4">
        <Link to="/" className="text-xl font-bold">
          E-Commerce
        </Link>
        <div className="space-x-4">
          <Link to="/cart" className="text-blue-500 hover:underline">
            Cart
          </Link>
          <Link to="/checkout" className="text-blue-500 hover:underline">
            Checkout
          </Link>
          <Link to="/order-info" className="text-blue-500 hover:underline">
            Orders
          </Link>
        </div>
      </nav>

      {/* Authentication Section */}
      <div className="flex justify-between items-center mb-6">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <img
              src="https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png"
              alt="User Avatar"
              className="rounded-full w-10 h-10"
            />
            <button
              onClick={handleSignOut}
              className="text-red-500 hover:underline"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </Link>
            <Link to="/sign-up" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Products Section */}
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>{product.price}</p>
            </div>
            <button
              onClick={() => handleViewProduct(product.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
