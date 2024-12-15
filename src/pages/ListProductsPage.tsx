import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Upload, Popconfirm } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadImageAPI } from "../api/uploadImage";
import { deleteProduct, listProductsAPI, updateProduct } from "../api/axios";
import { TProduct } from "../constants/type";
import { formatPrice } from "../utils/format";
import { toast } from "react-toastify";

const ListProductsPage = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null); // Current product being edited
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });

  // Fetch products on component mount or pagination change
  useEffect(() => {
    fetchProducts();
  }, [pagination.current]);

  const fetchProducts = async () => {
    setLoading(true);

    const products = await listProductsAPI();
    setProducts(products);

    setLoading(false);
  };

  const handleUpdate = async (values: any) => {
    try {
      // Upload product image if present
      if (values.productImage) {
        const imageFile = values.productImage.fileList[0].originFileObj;
        const imageUrl = await uploadImageAPI(imageFile);
        values.productImage = imageUrl;
      }

      // Update the product via API
      await updateProduct(editingProduct.id, values);
      toast.success("Đã cập nhật sản phẩm!");

      fetchProducts();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Có lỗi xảy ra, thử lại!");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    fetchProducts();
  };

  const columns = [
    {
      title: "Tên SP",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className="max-w-96 max-h-40 truncate text-wrap">{name}</div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (desc: string) => (
        <div className="max-w-96 truncate max-h-40">
          {desc?.split("\n").map((item, index) => (
            <React.Fragment key={index}>
              {item}
              <br />
            </React.Fragment>
          ))}
        </div>
      ),
    },
    {
      title: "Giá SP (giá ban đầu)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatPrice(price),
    },
    {
      title: "Giảm giá (%)",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
    },
    {
      title: "Số lượng",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
    },
    {
      title: "Ảnh",
      dataIndex: "productImage",
      key: "productImage",
      render: (image: string) => (
        <img src={image} alt={image} style={{ width: 100 }} />
      ),
    },
    {
      title: "Tuỳ chọn",
      key: "actions",
      render: (_: undefined, record: any) => (
        <>
          <Button
            onClick={() => {
              setEditingProduct(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Chắc chắn xoá?"
            onConfirm={() => handleDelete(record.id)}
            cancelText="Huỷ"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: products.length, // Update based on API response
          onChange: (page) => setPagination({ ...pagination, current: page }),
        }}
        scroll={{ x: "max-content" }}
      />
      {isModalVisible && (
        <Modal
          title="Sửa SP"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form initialValues={editingProduct} onFinish={handleUpdate}>
            <Form.Item name="name" label="Tên SP" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input />
            </Form.Item>
            <Form.Item name="productImage" label="Ảnh SP">
              <Upload
                maxCount={1}
                listType="picture"
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ListProductsPage;
