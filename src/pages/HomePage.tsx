import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TProduct } from "../constants/type";
import { listProductsAPI } from "../api/axios";
import { toast } from "react-toastify";
import { formatPrice } from "../utils/format";
import { calcNetPrice } from "../utils/calc";

const HomePage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<TProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await listProductsAPI();
        setProducts(products);
      } catch (error) {
        toast.error("Có lỗi xảy ra. Hãy thử lại");
      }
    };
    fetchProducts();
  }, []);

  const handleViewProduct = (id: string) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="p-4 max-w-[420px] mx-auto">
      {/* Products Section */}
      <h2 className="text-xl font-bold mb-4">Trang chủ</h2>
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 border rounded-lg flex justify-between items-center gap-1"
          >
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="flex gap-3">
                <div className="line-through text-red-900">
                  {formatPrice(product.price)}
                </div>
                <div className="font-bold text-yellow-500">
                  {formatPrice(
                    calcNetPrice(product.price, product.discountPercentage)
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleViewProduct(product.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Xem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
