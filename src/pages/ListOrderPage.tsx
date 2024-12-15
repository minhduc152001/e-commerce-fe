import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import {
  fetchOrders,
  getProductAPI,
  listTiersByProductAPI,
  updateOrder,
} from "../api/axios";
import { toast } from "react-toastify";
import { EAttributeType } from "../constants/enum";
import { TOrder, TProductTier, TSize } from "../types/type";
import { TAttribute } from "../constants/type";

const { Option } = Select;

const fetchDropdownOptions = async (productId: string) => {
  const product = await getProductAPI(productId);
  const tiers = await listTiersByProductAPI(productId);

  const { sizes, attributes } = product;
  const codes =
    attributes?.filter((attr) => attr.type === EAttributeType.Code) || [];
  const colors =
    attributes?.filter((attr) => attr.type === EAttributeType.Color) || [];

  return {
    tiers,
    sizes: sizes || [],
    codes,
    colors,
  };
};

const ListOrderPage = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<{
    tiers: TProductTier[];
    sizes: TSize[];
    codes: TAttribute[];
    colors: TAttribute[];
  }>({
    tiers: [],
    sizes: [],
    codes: [],
    colors: [],
  });
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async (productId: string) => {
    try {
      const options = await fetchDropdownOptions(productId);
      setDropdownOptions(options);
    } catch (error) {
      message.error("Failed to load dropdown options");
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const handleEditOrder = async (values: any) => {
    try {
      setLoading(true);

      await updateOrder(editingOrder.id, values);
      toast.success("Đã cập nhật đơn hàng!");

      setIsEditModalOpen(false);
      setEditingOrder(null);

      fetchOrdersData();
    } catch (error) {
      toast.error("Có lỗi xảy ra, thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (record: any) => {
    setEditingOrder(record);
    await fetchOptions(record.productId);
    form.setFieldsValue(record);
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      title: "Tên SP",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Tên KH",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa chỉ nhận hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Giá đơn hàng (chưa có ship)",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tuỳ chọn",
      key: "actions",
      render: (_: undefined, record: any) => {
        return (
          <Button type="link" onClick={() => handleEditClick(record)}>
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <div className="mx-2">
      <div className="mt-4 mb-2 font-bold text-2xl">Quản lý Đơn hàng</div>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
        pagination={{ defaultPageSize: 8, showSizeChanger: true }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        width={412}
        title="Sửa Đơn hàng"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={handleEditOrder} layout="vertical">
          <Form.Item
            label="Tên KH"
            name="customerName"
            rules={[{ required: true, message: "Nhập tên KH!" }]}
          >
            <Input placeholder="Tên KH" />
          </Form.Item>

          <Form.Item
            label="SĐT"
            name="phoneNumber"
            rules={[{ required: true, message: "Nhập SĐT!" }]}
          >
            <Input placeholder="Nhập SĐT" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ giao hàng"
            name="shippingAddress"
            rules={[{ required: true, message: "Hãy nhập địa chỉ giao hàng!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item label="Combo (nếu có)" name="tiers">
            <Select mode="multiple" placeholder="Chọn combo">
              {dropdownOptions.tiers.map((tier) => (
                <Option key={tier.id} value={tier.id}>
                  {tier.description}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Sizes (nếu có)" name="sizes">
            <Select mode="multiple" placeholder="Chọn size">
              {dropdownOptions.sizes.map((size) => (
                <Option key={size.sizeName} value={size.sizeName}>
                  {size.sizeName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Mã SP (nếu có)" name="codes">
            <Select mode="multiple" placeholder="Chọn mã SP">
              {dropdownOptions.codes.map((code) => (
                <Option key={code.id} value={code.id}>
                  {code.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Màu (nếu có)" name="colors">
            <Select mode="multiple" placeholder="Chọn màu">
              {dropdownOptions.colors.map((color) => (
                <Option key={color.id} value={color.id}>
                  {color.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Chọn trạng thái đơn hàng!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="PENDING">
                Pending (đơn hàng mới được tạo, cần xác nhận từ người bán)
              </Option>
              <Option value="CONFIRMED">
                Confirmed (người bán xác nhận đơn, sẵn sàng xuất kho)
              </Option>
              <Option value="PREPARING">
                Preparing (đơn hàng chuẩn bị giao)
              </Option>
              <Option value="SHIPPED">Shipped (đơn hàng đang được giao)</Option>
              <Option value="DELIVERED">
                Delivered (đơn hàng đã tới người nhận)
              </Option>
              <Option value="RETURN_REQUESTED">
                Return Requested (đơn hàng bị yêu cầu gửi lại)
              </Option>
              <Option value="RETURNED">
                Returned (đơn hàng đã gửi lại tới người bán)
              </Option>
              <Option value="COMPLETED">
                Completed (đơn hàng được hoàn thành)
              </Option>
              <Option value="CANCELED">
                Canceled (đơn hàng bị huỷ bởi người bán)
              </Option>
            </Select>
          </Form.Item>
          <div className="text-yellow-500">
            <span className="font-semibold">Chú ý:</span> Số lượng tồn kho trong
            CSDL sẽ bị trừ khi có đơn hàng, chỉ được hoàn lại khi trạng thái đơn
            chuyển thành <b>RETURNED</b> hoặc <b>CANCELED</b>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ListOrderPage;
