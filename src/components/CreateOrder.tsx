import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { createOrder } from "../api/axios";
import { addresses } from "../constants/addresses";
import { EAttributeType } from "../constants/enum";
import { TProduct } from "../constants/type";
import { TDistrict, TProductTier, TWard } from "../types/type";
import { calcNetPrice } from "../utils/calc";
import { formatPrice } from "../utils/format";

type TProp = {
  product: TProduct;
  tiers: TProductTier[];
  productImages: string[];
  time: {
    hours: string;
    minutes: string;
    seconds: string;
  };
};

type FieldType = {
  tiers: string[];
  phoneNumber: string | null;
  customerName: string | null;
  city: string | null;
  district: string | null;
  ward: string | null;
  detailAddress: string | null;
  sizes: string[];
  codes: string[];
  colors: string[];
  note: string | null;
  quantity: number;
};

function CreateOrder({ product, time, productImages, tiers }: TProp) {
  const [form] = Form.useForm<FieldType>();

  const [districts, setDistricts] = useState<TDistrict[]>([]);
  const [wards, setWards] = useState<TWard[]>([]);
  const [errorBundle, setErrorBundle] = useState(false);
  const [errorChooseSize, setErrorChooseSize] = useState(false);
  const [errorChooseCode, setErrorChooseCode] = useState(false);
  const [errorChooseColor, setErrorChooseColor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConfirmOrderModalOpen, setIsConfirmOrderModalOpen] = useState(false);
  const [isThankOrderModalOpen, setIsThankOrderModalOpen] = useState(false);

  const handleCityChange = (cityName: string) => {
    const selectedCity = addresses.find((city) => city.Name === cityName);
    setDistricts(selectedCity ? selectedCity.Districts : []);
    setWards([]); // Reset wards when city changes
  };

  const handleDistrictChange = (districtName: string) => {
    const selectedDistrict = districts.find(
      (district) => district.Name === districtName
    );
    setWards(selectedDistrict ? selectedDistrict.Wards : []);
  };

  const bundleOptions = tiers.map(({ description, id }) => ({
    value: id,
    label: description,
  }));

  const initialValues: FieldType = {
    tiers: [],
    city: null,
    district: null,
    phoneNumber: null,
    customerName: null,
    detailAddress: null,
    ward: null,
    sizes: [],
    codes: [],
    colors: [],
    note: null,
    quantity: 1,
  };

  const sizeOptions = product.sizes?.map((size) => ({
    value: size.sizeName,
    label: size.sizeName,
  }));

  const colorOptions = product.attributes
    ?.filter((attr) => attr.type === EAttributeType.Color)
    .map((attr) => ({
      value: attr.id,
      label: attr.name,
    }));

  const codeOptions = product.attributes
    ?.filter((attr) => attr.type === EAttributeType.Code)
    .map((attr) => ({
      value: attr.id,
      label: attr.name,
    }));

  const showModal = () => {
    setIsConfirmOrderModalOpen(true);
  };

  const handleClickConfirm = () => {
    setIsConfirmOrderModalOpen(false);
    setIsThankOrderModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsConfirmOrderModalOpen(false);
  };

  const onFinish = async (values: FieldType) => {
    const tiers = form.getFieldValue("tiers");
    const sizes = form.getFieldValue("sizes");
    const codes = form.getFieldValue("codes");
    const colors = form.getFieldValue("colors");

    try {
      values = { ...values, tiers, sizes, codes, colors };
      const shippingAddress = `${values.detailAddress}, ${values.ward}, ${values.district}, ${values.city}`;

      setLoading(true);
      await createOrder({
        productId: product.id,
        customerName: String(values.customerName),
        phoneNumber: String(values.phoneNumber),
        shippingAddress,
        tiers: tiers,
        sizes: sizes,
        codes: codes,
        colors: colors,
        note: values.note || "",
        quantity: values.quantity || null,
      });
      setLoading(false);

      // Create modal confirm
      showModal();
    } catch (error) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex mx-3 gap-5">
        <Image
          preview={false}
          src={productImages[0]}
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
            <div className="text-sm font-bold w-[200px] text-wrap h-10 truncate">
              {product.name}
            </div>
          </div>
          <div className="text-xs w-[240px] text-wrap h-10 truncate">
            {product.description?.split("\n").map((item, index) => (
              <React.Fragment key={index}>
                {item}
                <br />
              </React.Fragment>
            ))}
          </div>
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
                calcNetPrice(product.price, product.discountPercentage),
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
            name="customerName"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input className="h-10 text-[13px]" placeholder="Họ và tên" />
          </Form.Item>
          {/* Phone number */}
          <Form.Item<FieldType>
            className="mb-1 w-full"
            name="phoneNumber"
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
                <Option key={city.Id} value={city.Name}>
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
                <Option key={district.Id} value={district.Name}>
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
                <Option key={ward.Id} value={ward.Name}>
                  {ward.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item name="detailAddress" className="mb-1">
            <Input
              className="h-10 text-[13px]"
              placeholder="Địa chỉ chi tiết"
            />
          </Form.Item>
        </div>

        {/* Choose bunble */}
        {bundleOptions.length > 0 ? (
          <div className="mb-1">
            <div className="px-2 py-1.5 border rounded-lg border-solid border-[rgba(5,5,5,0.06)];">
              <Checkbox.Group
                className="flex flex-col gap-2"
                onChange={(el) => {
                  setErrorBundle(false);
                  form.setFieldValue("tiers", el);
                }}
              >
                {bundleOptions.map((el, i) => (
                  <Checkbox
                    key={el.value}
                    value={el.value}
                    className="text-[13px]"
                  >
                    {el.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </div>
            {errorBundle && (
              <div className="text-red-500">Vui lòng chọn combo</div>
            )}
          </div>
        ) : (
          <div>
            <Form.Item name="quantity" className="mb-1">
              <InputNumber
                controls
                addonBefore="Số lượng:"
                addonAfter="sản phẩm"
                className=" w-full"
              />
            </Form.Item>
          </div>
        )}

        {/* Choose size */}
        {sizeOptions && sizeOptions.length > 0 && (
          <div className="mb-1">
            <div className="px-2 py-1.5 border rounded-lg border-solid border-[rgba(5,5,5,0.06)];">
              <Checkbox.Group
                className="grid grid-cols-2 gap-2"
                onChange={(el) => {
                  setErrorChooseSize(false);
                  form.setFieldValue("sizes", el);
                }}
              >
                {sizeOptions?.map(({ value, label }, i) => (
                  <Checkbox key={i} value={value} className="text-[13px]">
                    {label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </div>
            {errorChooseSize && (
              <div className="text-red-500">Vui lòng chọn size</div>
            )}
          </div>
        )}

        {/* Choose code */}
        {codeOptions && codeOptions.length > 0 && (
          <div className="mb-1">
            <div className="px-2 py-1.5 border rounded-lg border-solid border-[rgba(5,5,5,0.06)];">
              <Checkbox.Group
                className="grid grid-cols-2 gap-2"
                onChange={(el) => {
                  setErrorChooseCode(false);
                  form.setFieldValue("codes", el);
                }}
              >
                {codeOptions?.map(({ value, label }, i) => (
                  <div className="flex items-center">
                    <Checkbox key={i} value={value} className="text-[13px]">
                      {label}
                    </Checkbox>
                    <Image
                      alt=""
                      preview={true}
                      width={40}
                      height={40}
                      src={
                        product.attributes?.find((el) => el.id === value)?.image
                      }
                    />
                  </div>
                ))}
              </Checkbox.Group>
            </div>
            {errorChooseCode && (
              <div className="text-red-500">Vui lòng chọn mã</div>
            )}
          </div>
        )}

        {/* Choose color */}
        {colorOptions && colorOptions.length > 0 && (
          <div className="mb-1">
            <div className="px-2 py-1.5 border rounded-lg border-solid border-[rgba(5,5,5,0.06)];">
              <Checkbox.Group
                className="grid grid-cols-2 gap-2"
                onChange={(el) => {
                  setErrorChooseColor(false);
                  form.setFieldValue("colors", el);
                }}
              >
                {colorOptions?.map(({ value, label }, i) => (
                  <div className="flex items-center">
                    <Checkbox key={i} value={value} className="text-[13px]">
                      {label}
                    </Checkbox>
                    <Image
                      alt=""
                      preview={true}
                      width={40}
                      height={40}
                      src={
                        product.attributes?.find((el) => el.id === value)?.image
                      }
                    />
                  </div>
                ))}
              </Checkbox.Group>
            </div>
            {errorChooseColor && (
              <div className="text-red-500">Vui lòng chọn màu</div>
            )}
          </div>
        )}

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
          loading={loading}
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
      {/* Confirm order modal */}
      <Modal
        title={
          <div className="font-gilroy mx-3 text-center">
            <Image
              width={40}
              height={40}
              src="https://media.istockphoto.com/id/1367070716/vector/tick-mark-approved-with-shield-icon.jpg?s=612x612&w=0&k=20&c=sux2h6v_lKNQIj5Ump9lGo2PRKUdP4h2ppuFOQj95NA="
            />
            <div className="text-2xl text-neutral-700">
              Cảm Ơn Bạn Đã Đặt Hàng!
            </div>
            <div className="mt-3 mx-4 font-normal">
              Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!
            </div>
          </div>
        }
        className="w-full"
        closeIcon={false}
        open={isConfirmOrderModalOpen}
        onOk={handleClickConfirm}
        onCancel={handleCancel}
        footer={
          <div className="mt-6">
            <div className="flex justify-between">
              <Button
                onClick={handleCancel}
                icon={<ArrowLeftOutlined />}
                color="danger"
                danger
                type="primary"
                className="h-14 font-semibold w-40"
              >
                <div>
                  Sai thông tin
                  <br />
                  Đặt hàng lại
                </div>
              </Button>
              <Button
                onClick={handleClickConfirm}
                type="primary"
                color="primary"
                className="h-14 font-semibold w-40"
                iconPosition="end"
                icon={<CheckOutlined />}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        }
      >
        <div className="mt-6 border-2 solid border-neutral-700 p-4 text-base font-gilroy">
          <div className="font-bold">Thông tin đặt hàng</div>
          <div className="pl-3">
            <div className="">
              <span>Họ tên:</span>
              <span className="font-bold ml-16">
                {form.getFieldValue("customerName")}
              </span>
            </div>
            <div className="">
              <span>Số điện thoại:</span>
              <span className="font-bold ml-[18px]">
                {form.getFieldValue("phoneNumber")}
              </span>
            </div>
            <div className="">
              <span>Địa chỉ:</span>
              <span className="font-bold ml-2">{`${form.getFieldValue(
                "detailAddress"
              )}, ${form.getFieldValue("ward")}, ${form.getFieldValue(
                "district"
              )}, ${form.getFieldValue("city")}`}</span>
            </div>
          </div>
        </div>
      </Modal>
      {/* Modal thanks for order */}
      <Modal
        title={
          <div className="text-center text-lg">Cảm ơn bạn đã đặt hàng</div>
        }
        className="w-full"
        open={isThankOrderModalOpen}
        onCancel={() => setIsThankOrderModalOpen(false)}
        footer={<></>}
      >
        <div className="flex flex-col items-center">
          <Image
            width={220}
            src="https://i.pinimg.com/originals/8a/a4/85/8aa485ec51c09b7970a9f80b12795a28.gif"
          />
          <Image
            height={80}
            src="https://t3.ftcdn.net/jpg/02/91/52/22/360_F_291522205_XkrmS421FjSGTMRdTrqFZPxDY19VxpmL.jpg"
          />
          <div className="font-semibold">
            CHÚNG TÔI ĐÃ NHẬN ĐƯỢC ĐƠN HÀNG CỦA BẠN
          </div>
          <div className="text-center mt-4 mb-1">
            Nhân viên của shop sẽ gọi điện lại để xác nhận đơn hàng trong thời
            gian làm việc hàng ngày.
          </div>
        </div>
      </Modal>
      ;
    </div>
  );
}

export default CreateOrder;
