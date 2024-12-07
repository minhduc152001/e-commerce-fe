import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Space, Upload } from "antd";
import { Option } from "antd/es/mentions";
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axios";
import { uploadImageAPI } from "../api/uploadImage";
import { EAttributeType } from "../constants/enum";
import { TSize } from "../types/type";

type FieldType = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  discountPercentage: number; // from 0 to 100
  stockQuantity: number;
  productImage: any;
  attributes: TAttribute[];
  sizes: TSize[];
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
      if (values.productImage) {
        const imageFile = values.productImage?.fileList[0]?.originFileObj;
        setLoading(true);
        const imageUrl = await uploadImageAPI(imageFile);
        setLoading(false);

        values.productImage = imageUrl;
      }

      // Extract files for attributes
      const attributes = values.attributes?.map((attribute) => {
        const attributeImageFile = attribute.image?.fileList[0]?.originFileObj;

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
      const productData = { ...values, attributes: attributesWithUrls };

      // Make an API call to save productData in your database
      setLoading(true);
      await axiosInstance.post("/products", productData);

      toast.success("Tạo sản phẩm thành công!");
      setLoading(false);
      form.resetFields();
    } catch (error) {
      setLoading(false);
      toast.error("Đã có lỗi xảy ra!");
    }
  };

  return (
    <div>
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
          label="Ảnh đại diện sản phẩm (nên sử dụng ảnh 800x800)"
          name="productImage"
          rules={[
            { required: true, message: "Nhập ảnh đại diện cho sản phẩm" },
          ]}
        >
          <Upload
            beforeUpload={(file) => {
              form.setFieldsValue({ productImage: file }); // Save the file object
              return false; // Prevent automatic upload
            }}
            listType="picture"
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Nhập ảnh</Button>
          </Upload>
        </Form.Item>

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
                  >
                    <Input placeholder="Tên kích thước" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "weight"]}
                    rules={[
                      { required: true, message: "Nhập trọng lượng (kg)" },
                    ]}
                  >
                    <Input placeholder="Cân nặng (kg)" style={{ width: 120 }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "height"]}
                    rules={[{ required: true, message: "Nhập chiều cao (cm)" }]}
                  >
                    <Input
                      placeholder="Chiều cao (cm)"
                      style={{ width: 120 }}
                    />
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

        <div className="font-bold">
          Nhập các thuộc tính như mã code, màu sắc (nếu có)
        </div>
        <Form.List name="attributes">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên (TN11, XL, Vàng trắng...)",
                      },
                    ]}
                  >
                    <Input placeholder="Tên thuộc tính" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "type"]}
                    rules={[{ required: true, message: "Thiếu phân loại" }]}
                  >
                    <Select placeholder="Select type" style={{ width: 120 }}>
                      <Option value="COLOR">COLOR</Option>
                      <Option value="CODE">CODE</Option>
                    </Select>
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
                          form.getFieldValue("attributes") || [];
                        attributes[name] = { ...attributes[name], image: file };
                        form.setFieldsValue({ attributes });
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
                  Thêm Thuộc tính
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

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
