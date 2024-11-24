import { Button, Checkbox, Form, Image, Input, Select } from "antd";
import React, { useState } from "react";
import { formatPrice, formatShortNumber } from "../utils/format";
import { addresses } from "../constants/addresses";
import { TDistrict, TWard } from "../types/type";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";

type TProp = {
  product: {
    id: string | undefined;
    name: string;
    description: string;
    price: number;
    discountPercentage: number;
    images: string[];
    details: string[];
    soldCount: number;
    rating: number;
    voteCount: number;
    sizeImage: string;
    sizes: string[];
    codes: { codeName: string; image: string }[];
  };
  time: {
    hours: string;
    minutes: string;
    seconds: string;
  };
};

type FieldType = {
  bundles: string[];
  city: string | null;
  district: string | null;
  phone: string | null;
  receiverName: string | null;
  ward: string | null;
  sizes: string[];
  codes: string[];
  note: string | null;
};

function CreateOrder({ product, time }: TProp) {
  const [form] = Form.useForm<FieldType>();

  const [districts, setDistricts] = useState<TDistrict[]>([]);
  const [wards, setWards] = useState<TWard[]>([]);
  const [errorBundle, setErrorBundle] = useState(false);
  const [errorChooseSize, setErrorChooseSize] = useState(false);

  const bundles = [
    {
      id: "abc",
      productId: "1",
      quantity: 1,
      totalPrice: 219000,
      shipCost: 25000,
    },
    {
      id: "def",
      productId: "1",
      quantity: 2,
      totalPrice: 400000,
      shipCost: 0,
    },
  ];

  const handleCityChange = (cityId: string) => {
    const selectedCity = addresses.find((city) => city.Id === cityId);
    setDistricts(selectedCity ? selectedCity.Districts : []);
    setWards([]); // Reset wards when city changes
  };

  const handleDistrictChange = (districtId: string) => {
    const selectedDistrict = districts.find(
      (district) => district.Id === districtId
    );
    setWards(selectedDistrict ? selectedDistrict.Wards : []);
  };

  const bundleOptions = bundles.map(
    ({ quantity, shipCost, totalPrice }) =>
      `MUA ${quantity} BỘ GIÁ: ${formatPrice(totalPrice)} + ${
        shipCost ? formatShortNumber(shipCost) : "FREE"
      } SHIP`
  );

  const initialValues: FieldType = {
    bundles: [],
    city: null,
    district: null,
    phone: null,
    receiverName: null,
    ward: null,
    sizes: [],
    codes: [],
    note: null,
  };

  const onFinish = (values: FieldType) => {
    const bundles = form.getFieldValue("bundles");
    const sizes = form.getFieldValue("sizes");
    values = { ...values, bundles, sizes };

    if (!bundles.length) setErrorBundle(true);

    if (!sizes.length) setErrorChooseSize(true);

    console.log("values:", values);
  };

  return (
    <div>
      <div className="flex mx-3 gap-5">
        <Image
          preview={false}
          src={product.images[0]}
          width={115}
          height={115}
        />

        <div className="flex flex-col text-center">
          <div className="flex justify-between w-[260px] h-20 items-center">
            <Button
              className="w-[52px] h-[26px] font-bold !bg-[rgba(233,9,9,1)] border shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-md border-solid"
              color="danger"
              variant="solid"
            >
              Mall
            </Button>
            <div className="text-sm font-bold">{product.name}</div>
          </div>
          <div className="text-xs">{product.description}</div>
        </div>
      </div>
      <div className="flex items-center gap-10 ml-1">
        <div className="text-sm">Vận chuyển từ Hà Nội</div>
        <div className="flex items-center gap-3">
          <div className="text-[15px] line-through">
            {formatPrice(product.price, "VND")}
          </div>
          <div className="flex items-center h-[33px] px-2 italic font-bold text-[13px] border shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-md border-solid text-[rgba(233,9,9,1)]">
            Giảm sốc {product.discountPercentage}%
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-1">
        <div className="text-sm">Thời gian dự kiến 3 - 5 ngày</div>
        <div>
          <div className="flex gap-1">
            <div className="text-[rgb(233,9,9)] animate-pulse text-lg">
              {formatPrice(
                (product.price * product.discountPercentage) / 100,
                "VND"
              )}{" "}
            </div>
            <div className="mt-0.5 text-base">/ Sản phẩm</div>
          </div>
        </div>
      </div>
      <div className="italic font-bold text-[17px] text-center mt-4 mb-2">
        Thời gian khuyến mãi kết thúc sau
      </div>
      <div className="flex text-center text-xl justify-center gap-5">
        <div>
          <div className="text-2xl">00</div>
          <div>Ngày</div>
        </div>
        <div>
          <div className="text-2xl">{time.hours}</div>
          <div>Giờ</div>
        </div>
        <div>
          <div className="text-2xl">{time.minutes}</div>
          <div>Phút</div>
        </div>
        <div>
          <div className="text-2xl">{time.seconds}</div>
          <div>Giây</div>
        </div>
      </div>
      <div className="flex gap-2 my-3 items-center font-bold justify-center">
        <img
          className="w-[22px] h-[22px]"
          src="https://content.pancake.vn/1/s422x422/fwebp/1d/26/f2/e0/c08ebf508b9ce8e3b885e1b4753a41c48be72369f05ebeee96ffcc2f.png"
          alt="tag"
        />
        <div>ĐẶT HÀNG NGÀY ĐỂ NHẬN ƯU ĐÃI TỪ SHOP</div>
      </div>
      <Form
        form={form}
        initialValues={initialValues}
        className="px-2"
        onFinish={onFinish}
      >
        <div className="flex gap-1">
          {/* Name */}
          <Form.Item<FieldType>
            className="mb-1 w-full"
            name="receiverName"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input className="h-10 text-[13px]" placeholder="Họ và tên" />
          </Form.Item>
          {/* Phone number */}
          <Form.Item<FieldType>
            className="mb-1 w-full"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input className="h-10 text-[13px]" placeholder="Số điện thoại" />
          </Form.Item>
        </div>

        {/* City Selector */}
        <div className="flex justify-between">
          <Form.Item<FieldType>
            className="w-[33%] text-center mb-1"
            name="city"
            rules={[
              { required: true, message: "Vui lòng chọn Tỉnh/Thành phố" },
            ]}
          >
            <Select
              className="h-10"
              popupMatchSelectWidth={200}
              placeholder="Tỉnh/Thành phố"
              onChange={handleCityChange}
            >
              {addresses.map((city) => (
                <Option key={city.Id} value={city.Id}>
                  {city.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* District Selector */}
          <Form.Item<FieldType>
            className="w-[33%] text-center mb-1"
            name="district"
            rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện" }]}
          >
            <Select
              className="h-10"
              placeholder="Quận/Huyện"
              onChange={handleDistrictChange}
              disabled={districts.length === 0}
              popupMatchSelectWidth={200}
            >
              {districts.map((district) => (
                <Option key={district.Id} value={district.Id}>
                  {district.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Ward Selector */}
          <Form.Item<FieldType>
            className="w-[33%] text-center mb-1"
            name="ward"
            rules={[{ required: true, message: "Vui lòng chọn Xã/Phường" }]}
          >
            <Select
              className="h-10"
              popupMatchSelectWidth={200}
              placeholder="Xã/Phường"
              disabled={wards.length === 0}
            >
              {wards.map((ward) => (
                <Option key={ward.Id} value={ward.Id}>
                  {ward.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Choose bunble */}
        <div className="mb-1">
          <div className="px-2 py-1.5 border rounded-lg border-solid border-[rgba(5,5,5,0.06)];">
            <Checkbox.Group
              className="flex flex-col gap-2"
              onChange={(el) => {
                setErrorBundle(false);
                form.setFieldValue("bundles", el);
              }}
            >
              {bundleOptions.map((el, i) => (
                <Checkbox
                  key={bundles[i].id}
                  value={bundles[i].id}
                  className="text-[13px]"
                >
                  {el}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
          {errorBundle && (
            <div className="text-red-500">Vui lòng chọn combo</div>
          )}
        </div>

        {/* Choose size */}
        <div className="mb-1">
          <div className="px-2 py-1.5 border rounded-lg border-solid border-[rgba(5,5,5,0.06)];">
            <Checkbox.Group
              className="grid grid-cols-2 grid-rows-3 gap-2"
              onChange={(el) => {
                setErrorChooseSize(false);
                form.setFieldValue("sizes", el);
              }}
            >
              {product.sizes.map((el) => (
                <Checkbox key={el} value={el} className="text-[13px]">
                  {el}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
          {errorChooseSize && (
            <div className="text-red-500">Vui lòng chọn size</div>
          )}
        </div>

        <Form.Item<FieldType> name="note" className="mb-1">
          <TextArea
            className="text-[13px]"
            placeholder="Bạn để lại lời nhắn tại đây nhân viên tư vấn sẽ gọi xác nhận ạ!"
          />
        </Form.Item>

        <Button
          className="w-full h-10 font-bold text-base"
          color="danger"
          variant="solid"
          htmlType="submit"
        >
          ĐẶT HÀNG
        </Button>
      </Form>
      <div className="flex items-center justify-center gap-3 mt-3 mb-1">
        <img src="../../assets/svg/greenTick.svg" className="w-4 h-4" alt="" />
        <div className="">Được kiểm tra hàng trước khi thanh toán</div>
      </div>
      <div className="flex items-center justify-center gap-3 mb-3">
        <img src="../../assets/svg/greenTick.svg" className="w-4 h-4" alt="" />
        <div className="">Hỗ trợ đổi size khi không vừa rộng hoặc lỗi</div>
      </div>
    </div>
  );
}

export default CreateOrder;
