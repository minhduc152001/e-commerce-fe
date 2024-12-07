import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Rate, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance, listProductsAPI } from "../api/axios";
import { uploadImageAPI } from "../api/uploadImage";
import { TProduct } from "../constants/type";

type FieldType = {
  productId: string;
  reviewerImage: any;
  reviewerName: string;
  rating: number;
  content: string;
  images: any | null;
};

const CreateReview: React.FC = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<TProduct[]>([]);
  const [fetchProductsLoading, setFetchProductsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setFetchProductsLoading(true);
        const data = await listProductsAPI();
        setProducts(data);
      } catch (error) {
        toast.error("Có lỗi xảy ra. Hãy thử lại");
      } finally {
        setFetchProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const onFinish = async (values: FieldType) => {
    try {
      // Handle uploading images
      setLoading(true);
      const reviewerImage = values.reviewerImage?.fileList[0]?.originFileObj;
      const reviewerImageUrl = await uploadImageAPI(reviewerImage);
      values.reviewerImage = reviewerImageUrl;

      const feedbackImages = values.images?.fileList?.map((image: any) => {
        const imageFile = image.originFileObj;

        return imageFile
          ? uploadImageAPI(imageFile) // Upload to S3
          : null;
      });
      const feedbackImagesWithUrls = feedbackImages?.length
        ? await Promise.all(
            feedbackImages.map(async (image: any) => await image)
          )
        : null;

      const reviewData = { ...values, images: feedbackImagesWithUrls };

      // Store to DB
      await axiosInstance.post("/reviews", reviewData);

      setLoading(false);
      toast.success("Tạo đánh giá thành công!");
      // form.resetFields();
    } catch (error) {
      setLoading(false);
      toast.error("Có lỗi xảy ra! Hãy kiểm tra lại.");
    }
  };

  return (
    <div>
      <div className="text-xl font-bold text-center py-5">Tạo Đánh giá</div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ rating: 5 }}
      >
        {/* Product Selector */}
        <Form.Item
          name="productId"
          label="Sản phẩm"
          rules={[{ required: true, message: "Hãy chọn sản phẩm!" }]}
        >
          <Select
            placeholder="Chọn sản phẩm"
            loading={fetchProductsLoading}
            options={products.map((product) => ({
              label: product.name,
              value: product.id,
            }))}
          />
        </Form.Item>

        {/* Reviewer Image */}
        <Form.Item
          name="reviewerImage"
          label="Avatar"
          rules={[{ required: true, message: "Thiếu ảnh người đánh giá" }]}
        >
          <Upload
            beforeUpload={(file) => {
              form.setFieldsValue({ reviewerImage: file }); // Save the file object
              return false; // Prevent automatic upload
            }}
            listType="picture"
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {/* Reviewer Name */}
        <Form.Item
          name="reviewerName"
          label="Tên"
          rules={[{ required: true, message: "Thiếu tên người đánh giá!" }]}
        >
          <Input placeholder="Nhập tên người đánh giá" />
        </Form.Item>

        {/* Rating */}
        <Form.Item
          name="rating"
          label="Đánh giá"
          rules={[
            { required: true, message: "Thiếu đánh giá số sao!" },
            {
              type: "integer",
              min: 1,
              max: 5,
              message: "Đánh giá từ 1 đến 5!",
            },
          ]}
        >
          <Rate />
        </Form.Item>

        {/* Content */}
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Thiếu nội dung!" }]}
        >
          <Input.TextArea
            placeholder="Sản phẩm đẹp, chất lượng tốt,..."
            rows={4}
            maxLength={500}
          />
        </Form.Item>

        {/* Images */}
        <Form.Item name="images" label="Tải ảnh feeback (không bắt buộc)">
          <Upload
            beforeUpload={
              () => false // Prevent automatic upload
            }
            listType="picture"
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Tạo Đánh giá
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateReview;
