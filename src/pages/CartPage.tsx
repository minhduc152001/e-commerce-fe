import {
  Button,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  message
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axios";
import { TAttribute, TProduct } from "../constants/type";
import { TCartItem } from "../types/type";

const CartItemService = {
  list: async () => {
    const response = await axiosInstance.get("/cart-items");
    return response.data.cartItems;
  },
  create: async (data: Partial<TCartItem>) => {
    const response = await axiosInstance.post("/cart-items", data);
    return response.data.cartItem;
  },
  update: async (id: string, data: Partial<TCartItem>) => {
    const response = await axiosInstance.put(`/cart-items/${id}`, data);
    return response.data.cartItem;
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/cart-items/${id}`);
    return response.data.cartItem;
  },
  getProducts: async () => {
    const response = await axiosInstance.get("/products");
    return response.data.cartItem;
  },
  getAttributes: async () => {
    const response = await axiosInstance.get("/attributes");
    return response.data.cartItem;
  },
};

const CartItemPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<TCartItem[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [attributes, setAttributes] = useState<TAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCartItem, setEditingCartItem] =
    useState<Partial<TCartItem> | null>(null);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const data = await CartItemService.list();
      setCartItems(data);
    } catch (error) {
      toast.error("Có lỗi xảy ra, hãy thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsAndAttributes = async () => {
    try {
      const [productData, attributeData] = await Promise.all([
        CartItemService.getProducts(),
        CartItemService.getAttributes(),
      ]);
      setProducts(productData);
      setAttributes(attributeData);
    } catch (error) {
      toast.error("Có lỗi xảy ra, hãy thử lại sau!");
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchProductsAndAttributes();
  }, []);

  const handleOpenModal = (cartItem?: TCartItem) => {
    setEditingCartItem(cartItem || null);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingCartItem(null);
  };

  const handleFormSubmit = async (values: Partial<TCartItem>) => {
    try {
      if (editingCartItem?.id) {
        await CartItemService.update(editingCartItem.id, values);
        message.success("Cart item updated successfully.");
      } else {
        await CartItemService.create(values);
        message.success("Cart item created successfully.");
      }
      fetchCartItems();
    } catch (error) {
      message.error("Failed to save cart item.");
    } finally {
      handleCloseModal();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await CartItemService.delete(id);
      message.success("Cart item deleted successfully.");
      fetchCartItems();
    } catch (error) {
      message.error("Failed to delete cart item.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Product ID", dataIndex: "productId", key: "productId" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Attribute ID", dataIndex: "attributeId", key: "attributeId" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TCartItem) => (
        <Space>
          <Button type="link" onClick={() => handleOpenModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this cart item?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="text-xl font-bold">Giỏ hàng</div>
      <Button type="primary" onClick={() => handleOpenModal()}>
        Create Cart Item
      </Button>
      <Table
        dataSource={cartItems}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editingCartItem ? "Edit Cart Item" : "Create Cart Item"}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form
          initialValues={editingCartItem || {}}
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true, message: "Product is required" }]}
          >
            <Select>
              {products?.map((product) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Quantity is required" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="attributeId"
            label="Attribute"
            rules={[{ required: true, message: "Attribute is required" }]}
          >
            <Select>
              {attributes?.map((attribute) => (
                <Select.Option key={attribute.id} value={attribute.id}>
                  {attribute.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingCartItem ? "Sửa" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CartItemPage;
