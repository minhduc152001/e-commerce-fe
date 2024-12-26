import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listProductsAPI } from "../api/axios";
import OtherProducts from "../components/OtherProducts";
import { TProduct } from "../constants/type";
import { generateRandomNumber } from "../utils/random";
import LoadingPage from "./LoadingPage";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<
    (TProduct & { randomSold: number })[]
  >([]);
  const [visibleAnotherProductText, setVisibleAnotherProductText] =
    useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await listProductsAPI();
        setProducts(
          products.map((other) => ({
            ...other,
            randomSold: generateRandomNumber(4000, 8000),
          }))
        );
      } catch (error) {
        toast.error("Có lỗi xảy ra. Hãy thử lại");
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setInterval(() => {
      setVisibleAnotherProductText((prev) => !prev);
    }, 1000);
  }, []);

  const innerWidth = window.innerWidth <= 440 ? window.innerWidth : 440;
  const [screenWidth, setScreenWidth] = useState(innerWidth);
  useEffect(() => {
    const handleResize = () =>
      setScreenWidth(window.innerWidth <= 440 ? window.innerWidth : 440);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="p-4 max-w-[440px] w-full mx-auto">
      {/* Products Section */}
      <h2 className="text-xl font-bold mb-4">Trang chủ</h2>
      <OtherProducts
        anotherProducts={products}
        screenWidth={screenWidth}
        visibleAnotherProductText={visibleAnotherProductText}
      />
    </div>
  );
};

export default HomePage;
