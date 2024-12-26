import React from "react";
import { TProduct } from "../constants/type";
import { Card, Image } from "antd";
import { formatPrice, formatShortNumber } from "../utils/format";
import { calcNetPrice } from "../utils/calc";

type Props = {
  anotherProducts: (TProduct & {
    randomSold: number;
  })[];
  screenWidth: number;
  visibleAnotherProductText: boolean;
};

function OtherProducts({
  anotherProducts,
  screenWidth,
  visibleAnotherProductText,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {anotherProducts.map((other) => {
        return (
          <Card
            className="border shadow-[2px_1px_2px_1px_rgba(0,0,0,0.25)] p-0"
            style={{ width: "100%" }}
            cover={
              <Image
                style={{
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  textAlign: "center",
                }}
                width={"100%"}
                height={screenWidth * 0.45}
                preview={false}
                src={other.productImage}
              />
            }
            actions={[
              <div
                onClick={() => (window.location.href = `/product/${other.id}`)}
                className="flex items-center justify-center h-11 bg-[rgba(244,67,54,1)] font-bold rounded-bl-lg rounded-br-lg"
              >
                <div className="text-white text-base animate-word-wrapper">
                  <div>
                    <span
                      className={`${
                        visibleAnotherProductText ? "visible" : "hidden"
                      }`}
                    >
                      MUA HÀNG NGAY
                    </span>
                  </div>
                  <div>
                    <span
                      className={`${
                        !visibleAnotherProductText ? "visible" : "hidden"
                      }`}
                    >
                      XEM CHI TIẾT
                    </span>
                  </div>
                </div>
              </div>,
            ]}
          >
            <div className="py-3 px-2">
              <div className="leading-[1.3] text-sm font-medium text-center another-product-name uppercase mb-2">
                {other.name}
              </div>
              <div className="leading-[1.4] italic font-crimson_pro text-[13px] text-neutral-400 text-center">
                Chất liệu cao cấp . Quà tặng ý nghĩa cho bà và mẹ
              </div>
              <div className="flex justify-center gap-1 my-2.5">
                {[5, 4, 3, 2, 1].map(() => (
                  <img
                    src="../../assets/svg/star.svg"
                    className="w-3 h-3"
                    alt="sm-fill-star"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center h-6">
                <div className="text-rose-600 text-base">
                  {formatPrice(
                    calcNetPrice(other.price, other.discountPercentage),
                    "VNĐ"
                  )}
                </div>
                <div className="italic text-xs text-neutral-400">
                  Đã bán {formatShortNumber(other.randomSold)}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default OtherProducts;
