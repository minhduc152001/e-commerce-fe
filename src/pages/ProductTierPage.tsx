import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance, listProductsAPI } from "../api/axios";
import { TProduct } from "../constants/type";
import { TProductTier } from "../types/type";
import { formatPrice } from "../utils/format";

const ProductTierService = {
  list: async (): Promise<TProductTier[]> => {
    const response = await axiosInstance.get("/product-tiers");
    return response.data.productTiers;
  },
  get: async (id: string): Promise<TProductTier> => {
    const response = await axiosInstance.get(`/product-tiers/${id}`);
    return response.data.productTier;
  },
  create: async (data: Partial<TProductTier>): Promise<TProductTier> => {
    const response = await axiosInstance.post("/product-tiers", data);
    return response.data.productTier;
  },
  update: async (
    id: string,
    data: Partial<TProductTier>
  ): Promise<TProductTier> => {
    const response = await axiosInstance.put(`/product-tiers/${id}`, data);
    return response.data.productTier;
  },
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/product-tiers/${id}`);
  },
};

const ProductTierPage: React.FC = () => {
  const [productTiers, setProductTiers] = useState<TProductTier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTier, setEditingTier] = useState<Partial<TProductTier> | null>(
    null
  );
  const [products, setProducts] = useState<TProduct[]>([]);
  const [fetchProductsLoading, setFetchProductsLoading] = useState(false);

  const fetchProductTiers = async () => {
    try {
      setIsLoading(true);
      const data = await ProductTierService.list();
      setProductTiers(data);
    } catch (error) {
      toast.error("Có lỗi xảy ra. Hãy thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTiers();
  }, []);
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

  const handleOpenModal = (tier?: TProductTier) => {
    setEditingTier(tier || null);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingTier(null);
  };

  const handleFormSubmit = async (values: Partial<TProductTier>) => {
    try {
      if (editingTier?.id) {
        await ProductTierService.update(editingTier.id, values);
        toast.success("Cập nhật Combo sản phẩm thành công!");
      } else {
        await ProductTierService.create(values);
        toast.success("Tạo Combo sản phẩm thành công!");
      }
      fetchProductTiers();
    } catch (error) {
      toast.error("Có lỗi xảy ra, hãy thử lại!");
    } finally {
      handleCloseModal();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ProductTierService.delete(id);
      toast.success("Xoá Combo sản phẩm thành công!");
      fetchProductTiers();
    } catch (error) {
      toast.error("Đã xảy ra lỗi, hãy thử lại!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
      width: 80,
    },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity", width: 20 },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 160,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => formatPrice(price),
    },
    {
      title: "Phí ship (0 là free)",
      dataIndex: "shippingFee",
      key: "shippingFee",
      width: 100,
      render: (fee: number) => formatPrice(fee),
    },
    {
      title: "Khác",
      key: "actions",
      render: (_: any, record: TProductTier) => (
        <Space>
          <Button type="link" onClick={() => handleOpenModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="text-xl font-bold my-5">Tạo Mua combo</div>
      <Button type="primary" onClick={() => handleOpenModal()}>
        Tạo combo sản phẩm
      </Button>
      <Table
        dataSource={productTiers}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        style={{ marginTop: 20 }}
        scroll={{ x: "max-content" }}
        pagination={{pageSize: 20}}
      />

      <Modal
        title={editingTier ? "Sửa" : "Tạo mới"}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form
          initialValues={editingTier || {}}
          onFinish={handleFormSubmit}
          layout="vertical"
        >
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
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: "Chọn số lượng" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả (hiển thị với KH - VD: MUA 1 BỘ GIÁ 280,000đ + 25k SHIP)"
            rules={[{ required: true, message: "Hãy thêm mô tả" }]}
          >
            <Input placeholder="MUA 2 BỘ GIÁ: 400,000đ + FREE SHIP" />
          </Form.Item>
          <Form.Item
            name="price"
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
            name="shippingFee"
            label="Phí ship (nhập 0 cho free ship)"
            rules={[{ required: true, message: "Nhập phí vận chuyển" }]}
          >
            <InputNumber
              formatter={(value) => `đ ${value}`}
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingTier ? "Sửa" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductTierPage;
