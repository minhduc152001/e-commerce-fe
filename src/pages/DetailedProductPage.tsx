import { EyeFilled, HeartFilled, MinusOutlined } from "@ant-design/icons";
import { Avatar, Button, Carousel, Image, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { formatPrice, formatShortNumber } from "../utils/format";
import ImageFeedbackShow from "../components/ImageFeedbackShow";
import CreateOrder from "../components/CreateOrder";
import Footer from "../components/Footer";
import { TProduct, TReview } from "../constants/type";
import {
  getProductAPI,
  listReviewsByProductAPI,
  listTiersByProductAPI,
} from "../api/axios";
import { toast } from "react-toastify";
import { TProductTier } from "../types/type";
import LoadingPage from "./LoadingPage";

const DetailedProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<TProduct>();
  const [reviews, setReviews] = useState<TReview[]>();
  const [displayingReviews, setDisplayingReviews] = useState(reviews);
  const [productTiers, setProductTiers] = useState<TProductTier[]>();

  let currentSaleEndTime = Number(localStorage.getItem("saleEndTime")) || null;
  const nextSaleEndTime = Date.now() + (2 * 60 * 60 + 15 * 60) * 1000; // 2 hours & 36 minutes for flash sale
  if (!currentSaleEndTime || currentSaleEndTime < Date.now()) {
    localStorage.setItem("saleEndTime", nextSaleEndTime.toString());
    currentSaleEndTime = nextSaleEndTime;
  }

  const [timeLeft, setTimeLeft] = useState(
    (currentSaleEndTime - Date.now()) / 1000
  );
  const [visibleProductImage, setVisibleProductImage] = useState(false);
  const randomNumbers = [768, 819, 810, 799, 789, 801, 796];
  const [watchingPeopleCount, setWatchingPeopleCount] = useState<number>(
    randomNumbers[0]
  );

  // const shopSectionRef = useRef<HTMLDivElement>(null);
  const feedbackSectionRef = useRef<HTMLDivElement>(null);
  const orderSectionRef = useRef<HTMLDivElement>(null);

  const handleScroll = (sectionRef: React.RefObject<HTMLDivElement>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const FilledStarCustom = (
    <img
      src="../../assets/svg/star.svg"
      className="w-[21px] h-[21px]"
      alt="fill-star"
    />
  );
  const EmptyStarCustom = (
    <img
      src="../../assets/svg/emptyStar.svg"
      className="w-[21px] h-[21px]"
      alt="empty-star"
    />
  );
  const HalfStarCustom = (
    <img
      src="../../assets/svg/halfStar.svg"
      className="w-[21px] h-[21px]"
      alt="haft-star"
    />
  );

  const generateStars = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const maxStars = 5;

    for (let i = 1; i <= maxStars; i++) {
      if (rating >= i) {
        // Full star
        stars.push(FilledStarCustom);
      } else if (rating > i - 1 && rating < i) {
        // Half star
        stars.push(HalfStarCustom);
      } else {
        // Empty star
        stars.push(EmptyStarCustom);
      }
    }

    return stars;
  };

  const ratingCount = reviews?.length || 0;
  const productRating =
    reviews && ratingCount
      ? reviews.reduce((cur, acc) => cur + acc.rating, 0) / ratingCount
      : "Chưa có đánh giá";

  const sizeImageTableData = product?.sizes?.map(
    ({ height, weight, sizeName }, key) => ({
      key,
      sizeName,
      weight,
      height,
    })
  );
  const sizeImageTableColumns = [
    {
      title: "Size",
      dataIndex: "sizeName",
      key: "sizeName",
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Chiều cao",
      dataIndex: "height",
      key: "height",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const product = await getProductAPI(id);
        setProduct(product);

        const reviews = await listReviewsByProductAPI(id);
        setReviews(reviews);
        setDisplayingReviews(reviews);

        const tiers = await listTiersByProductAPI(id);
        setProductTiers(tiers);
      } catch (error) {
        toast.error("Có lỗi xảy ra. Hãy thử lại");
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRandomNumber =
        randomNumbers[Math.floor(Math.random() * randomNumbers.length)];
      setWatchingPeopleCount(newRandomNumber);
    }, 2000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    if (seconds < 0) {
      return {
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: remainingSeconds.toString().padStart(2, "0"),
    };
  };
  const time = formatTime(timeLeft);

  if (!product) return <LoadingPage />;

  const productImages = [];
  const mainProductImage = product.productImage;
  mainProductImage && productImages.push(mainProductImage);
  productImages.push(...(product.attributes?.map((attr) => attr.image) || []));

  return (
    <div className="mx-auto">
      {/* Product Images */}
      <div>
        <div className="space-x-2">
          <Carousel arrows infinite={true} draggable dots>
            {productImages.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Product Thumbnail ${index + 1}`}
                width={420}
                height={457}
                preview={false}
              />
            ))}
          </Carousel>
        </div>
      </div>

      {/* Flash sale */}
      <div className="bg-flash-sale h-[61px] text-white">
        <div className="flex">
          <div className="top-[6px] left-[17px] w-6 h-[26px] relative coupon-transform">
            <img
              className="w-full h-full"
              src="../../assets/svg/coupon.svg"
              alt=""
            />
          </div>

          <div className="relative top-[6px] left-[30px] text-[21px] font-bold">
            {formatPrice(
              (product.price * (100 - product.discountPercentage)) / 100
            )}
          </div>

          {/* text FLASH SALE */}
          <div className="relative w-[123px] h-[25.5px] left-[175px] top-[3px]">
            <div className="text-white text-[17px] font-bold text-left">
              FLASH SALE
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Initial price */}
          <div className="relative w-16 h-[21px] left-[17px] top-[5px]">
            <div className="text-[rgba(145,4,52,0.95)] text-sm text-center line-through border-solid">
              <div className="bg-[rgb(196,188,188)]">
                {formatPrice(product.price)}
              </div>
            </div>
          </div>

          {/* How much percentage that saves */}
          <div className="relative w-[130px] h-[19.5px] left-[20px] top-[5px]">
            <div className="text-[rgba(247,247,247,1)] text-[13px] text-center">
              Tiết kiệm tới {"  " + product.discountPercentage}%
            </div>
          </div>

          {/* Kết thúc sau */}
          <div className="relative h-[19.5px] left-7 top-[5px]">
            <div className="text-[rgba(255,243,243,1)] text-[13px] font-bold text-left">
              Kết thúc sau
            </div>
          </div>

          {/* Time countdown */}
          <div className="relative h-[19.5px] left-[40px] bottom-[4px]">
            <div className="text-[20px] pointer-events-none flex gap-2">
              <div className="countdown-item">
                <div>{time.hours}</div>
              </div>
              <div className="countdown-item">
                <div>{time.minutes}</div>
              </div>
              <div className="countdown-item">
                <div>{time.seconds}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 py-1">
        {/* How many people watching */}
        <div>
          <div className="flex gap-2 items-center">
            <EyeFilled />
            <div className="text-[13px]">Đang có</div>
            <div className="text-[rgba(169,27,27,1)] text-xl relative bottom-0.5">
              {watchingPeopleCount}
            </div>
            <div className="text-[13px]">người xem sản phẩm này</div>
          </div>
        </div>

        {/* Ưu đãi đặc quyền trên trung tâm mua sắm Facebook */}
        <div className="flex gap-1 items-center my-1">
          <img
            className="w-[23px] h-[23px]"
            src="../../assets/svg/redShop.svg"
            alt=""
          />
          <div className="text-sm text-[rgba(239,78,78,1)] font-bold top-0.5 relative">
            Ưu đãi đặc quyền trên trung tâm mua sắm Facebook
          </div>
        </div>
      </div>

      {/* Product name and Price */}
      <div className="px-4 mt-1 mb-3">
        <div className="flex gap-2 justify-between items-center">
          <div className="font-quicksand text-base font-semibold">
            {product.name.toUpperCase()}
          </div>
          <img
            className="w-[26px] h-10"
            src="../../assets/svg/bookmark.svg"
            alt=""
          />
        </div>

        <div className="flex mt-1 items-center">
          <div className="mr-2">{FilledStarCustom}</div>
          <div className="text-[15px]">
            {ratingCount && (
              <>
                <span className="font-bold">{productRating}/</span>
                <span>5</span>
              </>
            )}
            <span className="ml-1 text-[rgb(15,195,193)]">
              ({formatShortNumber(ratingCount)})
            </span>

            <span className="ml-6 font-bold">|</span>
            <span className="ml-2">Đã bán</span>
            <span className="ml-1 font-bold">{formatShortNumber(7200)}</span>
          </div>
        </div>
      </div>

      {/* Sản phẩm hàng đầu - Thời trang nữ bán chạy */}
      <div
        // ref={shopSectionRef}
        className="flex text-sm items-center bg-[rgba(255,242,231,1)] h-10 px-4 text-[rgba(172,91,40,1)]"
      >
        <img
          className="w-7 h-7"
          src="https://content.pancake.vn/1/s427x427/fwebp/d7/1c/51/ef/5f0dbcc5e3e39c394faacdce01e02928dd44c6f7e41016c8156ee4f6.png"
          alt=""
        />
        <div className="ml-3 font-bold">Sản phẩm hàng đầu</div>
        <HeartFilled className="ml-4" />
        <div className="ml-6">Thời trang nữ bán chạy</div>
      </div>

      {/* Thanh toán bảo mật - Đổi trả dễ dàng - Chính hãng 100% */}
      <div className="flex justify-between text-[11px] items-center h-12 px-2 bg-[rgba(229,231,235,0.870)]">
        <div className="flex gap-1 items-center">
          <img
            className="w-[23px] h-[21px]"
            src="../../assets/svg/checkCard.svg"
            alt=""
          />
          <div>Thanh toán bảo mật</div>
        </div>

        <div className="flex gap-1 items-center">
          <img
            className="w-[23px] h-[21px]"
            src="../../assets/svg/checkCard.svg"
            alt=""
          />
          <div>Đổi trả dễ dàng</div>
        </div>

        <div className="flex gap-1 items-center">
          <img
            className="w-[23px] h-[21px]"
            src="../../assets/svg/checkCard.svg"
            alt=""
          />
          <div>Chính hãng 100%</div>
        </div>
      </div>

      <div className="px-4 border-[#e2e2e2] border-b-2 pb-3">
        {/* Xem ảnh sản phẩm - main product image */}
        <div className="py-2 cursor-pointer">
          <div
            className="text-base font-bold"
            onClick={() => setVisibleProductImage(true)}
          >
            Xem ảnh sản phẩm
          </div>
          {visibleProductImage && mainProductImage && (
            <Image
              width={200}
              style={{ display: "none" }}
              src={mainProductImage}
              preview={{
                visible: visibleProductImage,
                src: mainProductImage,
                onVisibleChange: (value) => {
                  setVisibleProductImage(value);
                },
              }}
            />
          )}
        </div>

        {/* Hình thức thanh toán */}
        <div className="py-2 border-[#e2e2e2] border-y-2">
          <div className="text-base font-bold mb-1">Hình thức thanh toán</div>
          <div>
            <span className="font-bold bg-[rgb(88,139,60)] text-white mr-2">
              COD
            </span>
            <span className="text-sm">Thanh toán bằng tiền mặt (COD)</span>
          </div>
        </div>

        {/* Vận chuyển */}
        <div className="py-2 border-[#e2e2e2] border-y-2">
          <div className="text-base font-bold mb-1">Vận chuyển</div>
          <div>
            <span
              className="text-xs font-bold text-[rgba(92,193,197,1)] mr-2
            rounded-[5px] border-[rgba(92,193,197,1)] border-solid border-2
            px-2 py-1
            "
            >
              Phiếu giảm giá vận chuyển
            </span>
            <span className="text-sm leading-7">
              Miễn phí vận chuyển cho các đơn hàng từ 2 sản phẩm trở lên
            </span>
          </div>
        </div>

        {/* Chính sách đổi trả */}
        <div className="py-2 border-[#e2e2e2] border-t-2">
          <div className="text-base font-bold mb-1">Chính sách đổi trả</div>
          <div>
            <span className="text-[13px]">
              Hỗ trợ đổi trả hàng trong vòng 7 ngày. Kiểm tra hàng trước khi
              thanh toán
            </span>
          </div>
        </div>

        {/* Đánh giá của khách hàng */}
        <div
          ref={feedbackSectionRef}
          className="py-0.5 flex items-center justify-between"
        >
          <div className="text-base font-bold mb-1">
            Đánh giá của khách hàng ({formatShortNumber(ratingCount)})
          </div>
          <div className="text-sm">Xem thêm {">"}</div>
        </div>
        {/* Hiện số sao rating */}
        {ratingCount && (
          <div className="flex gap-2 items-center mb-2">
            <div className="text-sm">
              {productRating}
              /5
            </div>
            <div className="flex">
              {generateStars(Number(productRating) || 0)}
            </div>
          </div>
        )}
        {/* Reviews */}
        {displayingReviews?.map((el, i) => (
          <div className="border-b border-[#b9b9b9] py-2">
            <div className="px-6 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Avatar
                  src={
                    <img
                      src={
                        el.reviewerImage ||
                        // a default avatar
                        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.iconfinder.com%2Ficons%2F403017%2Favatar_default_head_person_unknown_user_anonym_icon&psig=AOvVaw2nkz09L6vcMZcUgTWgzKmh&ust=1733410089284000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNDe3IOujooDFQAAAAAdAAAAABAo"
                      }
                      alt="avatar"
                    />
                  }
                />
                <div>{el.reviewerName}</div>
              </div>
              <div className="flex mb-2 text-sm">
                {generateStars(el.rating)}
              </div>
              <div className="text-[15px]">{el.content}</div>
              <ImageFeedbackShow images={el.images} />
            </div>
          </div>
        ))}

        {/* Đánh giá của khách hàng dành cho cửa hàng */}
        <div className="text-[15px] font-bold text-center my-2">
          Đánh giá của khách hàng dành cho cửa hàng (
          {formatShortNumber(Number(productRating) || 0)})
        </div>
        <div className="flex justify-between px-2">
          {reviews &&
            [5, 4, 3, 2, 1].map((rating) => (
              <div
                className="flex gap-1 border border-[rgba(45,45,45,1)] rounded-lg p-1 cursor-pointer"
                onClick={() =>
                  setDisplayingReviews(() =>
                    reviews?.filter((review) => review.rating === rating)
                  )
                }
              >
                <div className="flex">
                  {rating}
                  {FilledStarCustom}
                </div>
                <div>
                  (
                  {formatShortNumber(
                    reviews.filter((el) => el.rating === rating).length
                  )}
                  )
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Mô tả */}
      <div
        className="border-[#e2e2e2] border-t-2 py-6
        flex flex-col gap-3
        "
      >
        <div>{product.description}</div>
        <Image.PreviewGroup>
          {productImages.map((el) => (
            <Image preview={false} src={el} />
          ))}
        </Image.PreviewGroup>
      </div>

      {/* Bảng kích cỡ (nếu có) */}
      {sizeImageTableData && (
        <div className="mb-6">
          <div className="font-bold">Bảng kích cỡ size</div>
          <Table
            columns={sizeImageTableColumns}
            dataSource={sizeImageTableData}
            pagination={false}
            bordered
          />
        </div>
      )}

      <div ref={orderSectionRef}>
        <CreateOrder
          product={product}
          productImages={productImages}
          tiers={productTiers || []}
          time={time}
        />
      </div>

      {/* CAM KẾT VÀ CHÍNH SÁCH BÁN HÀNG */}
      <div className="mt-3 text-center text-xl font-bold">
        CAM KẾT VÀ CHÍNH SÁCH BÁN HÀNG
      </div>
      <div className="mt-2 grid grid-cols-2 grid-rows-2 gap-4 mx-4 pt-1">
        <div className="py-1 rounded-[11px] border-solid shadow-[0_8px_16px_0_rgba(0,0,0,0.2),0_6px_6px_0_rgba(0,0,0,0.19)] flex flex-col items-center">
          <img
            className="w-[78px] h-[78px]"
            src="https://content.pancake.vn/1/s479x478/fwebp/05/13/fe/09/a6c1389b798dd4f556d391941f0fe695879d16c9d79bdf3ee26c674a.png"
            alt=""
          />
          <div className="text-[rgba(217,24,24,1)] text-sm">
            GIAO HÀNG TOÀN QUỐC
          </div>
          <div className="text-[15px] text-center">
            Giao hàng toàn quốc nhanh chóng chỉ từ 2-5 ngày nhận được hàng.
          </div>
        </div>
        <div className="py-1 rounded-[11px] border-solid shadow-[0_8px_16px_0_rgba(0,0,0,0.2),0_6px_6px_0_rgba(0,0,0,0.19)] flex flex-col items-center">
          <img
            className="w-[78px] h-[78px]"
            src="https://content.pancake.vn/1/s481x478/fwebp/3d/3a/2b/c7/f073fe38a69ef885514313e332672ab760034a84955999503204fdfd.png"
            alt=""
          />
          <div className="text-[rgba(217,24,24,1)] text-sm">
            ĐỔI TRẢ 30 NGÀY
          </div>
          <div className="text-[15px] text-center">
            Ngay cả khi đã dùng sản phẩm mà không hài lòng
          </div>
        </div>
        <div className="py-1 rounded-[11px] border-solid shadow-[0_8px_16px_0_rgba(0,0,0,0.2),0_6px_6px_0_rgba(0,0,0,0.19)] flex flex-col items-center">
          <img
            className="w-[78px] h-[78px]"
            src="https://content.pancake.vn/1/s480x478/fwebp/fd/e2/d8/d0/5f71537bce39cc8457b1585a0f18a5a8e6a72ce6477d696c3c486965.png"
            alt=""
          />
          <div className="text-[rgba(217,24,24,1)] text-sm">
            BẢO HÀNH 12 THÁNG
          </div>
          <div className="text-[15px] text-center">
            Chính sách bảo hành sản phẩm cực tốt
          </div>
        </div>
        <div className="py-1 rounded-[11px] border-solid shadow-[0_8px_16px_0_rgba(0,0,0,0.2),0_6px_6px_0_rgba(0,0,0,0.19)] flex flex-col items-center">
          <img
            className="w-[78px] h-[78px]"
            src="https://content.pancake.vn/1/s478x478/fwebp/8b/40/49/62/ae5d6fc38376318f7a9b13e1f9013894f89965972d5651106c05e553.png"
            alt=""
          />
          <div className="text-[rgba(217,24,24,1)] text-sm">
            HÀNG CHÍNH HÃNG
          </div>
          <div className="text-[15px] text-center">
            Chúng tôi không bán hàng giả, hàng kém chất lượng
          </div>
        </div>
      </div>

      <div className="mb-16">
        <Footer />
      </div>

      {/* Fixed box for quick checkout/order */}
      <div className="fixed w-[420px] h-[67px] z-10 bottom-0 bg-white">
        <div className="flex h-full items-center justify-between border shadow-[0px_0px_8px_0px_rgba(0,0,0,0.250)] border-solid">
          <div className="flex mx-4 gap-6">
            <div
              onClick={() => (window.location.href = "/")}
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <img
                className="w-[23px] h-[23px]"
                src="../../assets/svg/blackShop.svg"
                alt=""
              />
              <div className="text-[10px]">Trang chủ</div>
            </div>

            <div
              onClick={() => handleScroll(feedbackSectionRef)}
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <img
                className="w-[23px] h-[23px]"
                src="../../assets/svg/feedback.svg"
                alt=""
              />
              <div className="text-[10px]">Feedback</div>
            </div>
          </div>

          <div className="flex mx-4 justify-between gap-3 items-center">
            <Button
              onClick={() => handleScroll(orderSectionRef)}
              variant="outlined"
              className="flex flex-col w-28 h-[46px] gap-0
              text-[rgba(212,71,71,1)] text-sm font-bold rounded-none border-[rgba(229,92,118,1)] border-solid border-2
              "
              danger
            >
              <div className="font-gilroy">Thêm vào</div>
              <div className="font-gilroy">Giỏ hàng</div>
            </Button>

            <Button
              onClick={() => handleScroll(orderSectionRef)}
              className="
              mt-2 flex flex-col w-28 h-12 gap-0
              text-sm font-bold rounded-none font-gilroy
              animate-bounce
              "
              color="danger"
              variant="solid"
            >
              Mua ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedProductPage;
