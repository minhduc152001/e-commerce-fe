import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
} from "antd";
import { Option } from "antd/es/mentions";
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axios";
import { uploadImageAPI } from "../api/uploadImage";
import { EAttributeType } from "../constants/enum";
import { TProductTier, TSize } from "../types/type";

type FieldType = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  discountPercentage: number; // from 0 to 100
  stockQuantity: number;
  productImages: any;
  colorAttributes: TAttribute[];
  codeAttributes: TAttribute[];
  productTiers: TProductTier[];
  sizes: TSize[];
  externalLink: string;
};

// Attribute
type TAttribute = {
  name: string;
  type: EAttributeType;
  image: any;
};

function CreateProduct() {
  const [form] = Form.useForm<FieldType>();
  const [loading, setLoading] = useState(false);

  // Submit form
  const onFinish = async (values: FieldType) => {
    try {
      // Upload product image if present
      let productImage: string = "";
      let subImages: string[] = [];

      if (values.productImages) {
        const imageFiles = values.productImages?.fileList;
        setLoading(true);
        const imageUrls = await Promise.all(
          imageFiles?.map(async (file: any) => {
            return await uploadImageAPI(file.originFileObj);
          })
        );

        productImage = imageUrls.shift();
        subImages.push(...imageUrls);
      }

      // Extract files for attributes
      const colorAttributes =
        values.colorAttributes?.map((el) => ({
          ...el,
          type: EAttributeType.Color,
        })) || [];
      const codeAttributes =
        values.codeAttributes?.map((el) => ({
          ...el,
          type: EAttributeType.Code,
        })) || [];
      const attributes = colorAttributes
        .concat(codeAttributes)
        ?.map((attribute) => {
          const attributeImageFile =
            attribute.image?.fileList[0]?.originFileObj;

          return {
            ...attribute,
            image: attributeImageFile
              ? uploadImageAPI(attributeImageFile) // Upload to S3
              : null,
          };
        });

      // Upload all attribute images and replace with URLs
      setLoading(true);
      const attributesWithUrls = attributes
        ? await Promise.all(
            attributes.map(async (attr) => ({
              ...attr,
              image: attr.image ? await attr.image : null,
            }))
          )
        : null;
      setLoading(false);

      // Final product submission
      const {
        codeAttributes: _,
        colorAttributes: __,
        productImages: ___,
        ...vitalData
      } = values;
      const productData = {
        ...vitalData,
        productImage,
        subImages,
        attributes: attributesWithUrls,
      };

      // Make an API call to save productData in your database
      setLoading(true);
      await axiosInstance.post("/products", productData);

      toast.success("Tạo sản phẩm thành công!");
      setLoading(false);
      form.resetFields();
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!");
    }

    setLoading(false);
  };

  return (
    <div className="mx-2">
      <div className="text-xl font-bold text-center py-5">Tạo Sản Phẩm Mới</div>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Thiếu tên sản phẩm" }]}
        >
          <Input placeholder="Tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Số lượng tồn kho"
          name="stockQuantity"
          rules={[{ required: true, message: "Thiếu tồn kho" }]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="1000" />
        </Form.Item>

        <Form.Item label="Mô tả (tuỳ chọn)" name="description">
          <Input.TextArea placeholder="Mô tả sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Thiếu giá sản phẩm" }]}
        >
          <InputNumber
            min={0}
            formatter={(value) => `đ ${value}`}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Giảm giá (%)" name="discountPercentage">
          <InputNumber
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Ảnh sản phẩm (nên sử dụng ảnh 800x800) - tối đa 20"
          name="productImages"
          rules={[
            { required: true, message: "Nhập ảnh đại diện cho sản phẩm" },
          ]}
        >
          <Upload
            beforeUpload={(file) => {
              form.setFieldsValue({ productImages: file }); // Save the file object
              return false; // Prevent automatic upload
            }}
            listType="picture"
            accept="image/*"
            maxCount={20}
            multiple={true}
          >
            <Button icon={<UploadOutlined />}>Nhập ảnh</Button>
          </Upload>
        </Form.Item>

        <div className="font-bold">Nhập combo sản phẩm</div>
        <Form.List name="productTiers">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <div className="flex gap-2">
                    <Space
                      key={key}
                      align="baseline"
                      direction="vertical"
                      size="middle"
                      style={{
                        display: "flex",
                        marginBottom: "20px",
                        alignItems: "center",
                      }}
                    >
                      <Card
                        title={
                          <div className="flex justify-between">
                            <div>Combo {name + 1}</div>
                            <DeleteOutlined
                              className="text-red-600 text-lg"
                              onClick={() => remove(name)}
                            />
                          </div>
                        }
                        className="px-2"
                      >
                        <Form.Item
                          className="pt-2"
                          {...restField}
                          label="Số lượng"
                          name={[name, "quantity"]}
                          rules={[
                            {
                              required: true,
                              message: "Nhập số lượng",
                            },
                          ]}
                        >
                          <InputNumber min={1} className="w-full" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "description"]}
                          label="Mô tả (hiển thị với KH - VD: MUA 1 BỘ GIÁ 280,000đ + 25k SHIP)"
                          rules={[
                            { required: true, message: "Hãy thêm mô tả" },
                          ]}
                        >
                          <Input placeholder="MUA 2 BỘ GIÁ: 400,000đ + FREE SHIP" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "price"]}
                          label="Giá"
                          rules={[{ required: true, message: "Hãy nhập giá" }]}
                        >
                          <InputNumber
                            formatter={(value) => `đ ${value}`}
                            min={0}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "shippingFee"]}
                          label="Phí ship (nhập 0 cho free ship)"
                          rules={[
                            { required: true, message: "Nhập phí vận chuyển" },
                          ]}
                        >
                          <InputNumber
                            formatter={(value) => `đ ${value}`}
                            min={0}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Card>
                    </Space>
                  </div>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm Combo
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Sizes Field */}
        <div className="font-bold">Nhập kích thước sản phẩm (nếu có)</div>
        <Form.List name="sizes">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, "sizeName"]}
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên kích thước (Size S, Size M,...)",
                      },
                    ]}
                    label="Tên"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "weight"]}
                    label="Nặng"
                    rules={[
                      { required: true, message: "Nhập trọng lượng (kg)" },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "height"]}
                    label="Cao"
                    rules={[{ required: true, message: "Nhập chiều cao (cm)" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "waist"]}
                    label="Eo"
                    // rules={[{ required: true, message: "Nhập vòng eo (cm)" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "chest"]}
                    label="Ngực"
                    // rules={[{ required: true, message: "Nhập vòng ngực (cm)" }]}
                  >
                    <Input />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm kích thước
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div className="font-bold">Nhập các biến thể (nếu có)</div>
        <Form.List name="codeAttributes">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item {...restField} name={[name, "type"]}>
                    <Select
                      placeholder="Chọn"
                      style={{ width: 100 }}
                      disabled
                      defaultValue={"CODE"}
                      suffixIcon={<></>}
                    >
                      {/* <Option value="COLOR">Màu sắc</Option> */}
                      <Option value="CODE">Biến thể</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên (TN11, AB02...)",
                      },
                    ]}
                  >
                    <Input placeholder="Tên biến thể" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "image"]}
                    className="max-w-[168px] text-center"
                  >
                    <Upload
                      name="file"
                      beforeUpload={(file) => {
                        const attributes =
                          form.getFieldValue("codeAttributes") || [];
                        attributes[name] = { ...attributes[name], image: file };
                        form.setFieldsValue({ codeAttributes: attributes });
                        return false;
                      }}
                      listType="picture"
                      accept="image/*"
                      maxCount={1}
                    >
                      <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm Biến thể
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div className="font-bold">Nhập màu sắc (nếu có)</div>
        <Form.List name="colorAttributes">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item {...restField} name={[name, "type"]}>
                    <Select
                      placeholder="Chọn"
                      style={{ width: 100 }}
                      disabled
                      defaultValue={"COLOR"}
                      suffixIcon={<></>}
                    >
                      <Option value="COLOR">Màu sắc</Option>
                      {/* <Option value="CODE">Biến thể</Option> */}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên (Vàng trắng...)",
                      },
                    ]}
                  >
                    <Input placeholder="Màu sắc" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "image"]}
                    className="max-w-[168px] text-center"
                  >
                    <Upload
                      name="file"
                      beforeUpload={(file) => {
                        const attributes =
                          form.getFieldValue("colorAttributes") || [];
                        attributes[name] = { ...attributes[name], image: file };
                        form.setFieldsValue({ colorAttributes: attributes });
                        return false;
                      }}
                      listType="picture"
                      accept="image/*"
                      maxCount={1}
                    >
                      <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm Màu sắc
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          label="Link sản phẩm (shopee,...)"
          name="externalLink"
        >
          <Input placeholder="https://shopee.vn/buy/san-pham-ao" />
        </Form.Item>

        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" block>
            Tạo Sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateProduct;
