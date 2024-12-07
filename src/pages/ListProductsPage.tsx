import { Form, Input, InputNumber, Table, TableProps, Tag } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listProductsAPI } from "../api/axios";
import { TAttribute } from "../constants/type";
import { formatPrice } from "../utils/format";

interface DataType {
  key: string;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  productImage: string;
  attributes: TAttribute[];
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: DataType;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Hãy nhập ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function ListProductsPage() {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [data, setData] = useState<DataType[]>([]);

  const isEditing = (record: DataType) => record.key === editingKey;

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      width: 150,
      editable: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 150,
      editable: true,
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 100,
      editable: true,
      render: (price: number) => (
        <div className="text-orange-500">{formatPrice(price)}</div>
      ),
    },
    {
      title: "Khuyến mãi",
      dataIndex: "discountPercentage",
      width: 120,
      editable: true,
      render: (percent: number) => (
        <div className="text-green-500 text-center">{percent}%</div>
      ),
    },
    {
      title: "Thuộc tính",
      dataIndex: "attributes",
      width: 250,
      render: (_: undefined, { attributes }: { attributes: TAttribute[] }) => (
        <>
          {attributes.map((attribute) => {
            let color = attribute.id > "3" ? "geekblue" : "green";
            if (attribute.id > "6") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={attribute.id}>
                {`${attribute.type}: ${attribute.name}`}
              </Tag>
            );
          })}
        </>
      ),
    },
    // {
    //   title: "Tuỳ chỉnh",
    //   dataIndex: "operation",
    //   render: (_: any, record: DataType) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <span>
    //         <Typography.Link
    //           onClick={() => save(record.key)}
    //           style={{ marginInlineEnd: 8 }}
    //         >
    //           Lưu
    //         </Typography.Link>
    //         <Popconfirm title="Xác nhận huỷ?" onConfirm={cancel}>
    //           <a>Huỷ</a>
    //         </Popconfirm>
    //       </span>
    //     ) : (
    //       <Typography.Link
    //         disabled={editingKey !== ""}
    //         onClick={() => edit(record)}
    //       >
    //         Sửa
    //       </Typography.Link>
    //     );
    //   },
    // },
  ];

  const edit = (record: Partial<DataType>) => {
    form.setFieldsValue(record);
    setEditingKey(record.key as string);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const mergedColumns: TableProps<DataType>["columns"] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType:
          col.dataIndex === "price" || col.dataIndex === "discountPercentage"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await listProductsAPI();
        setData(
          products.map<DataType>((product) => ({
            key: product.id,
            name: product.name,
            description: product.description || "",
            productImage: product.productImage,
            price: product.price,
            discountPercentage: product.discountPercentage,
            attributes: product.attributes || [],
          }))
        );
      } catch (error) {
        toast.error("Có lỗi xảy ra. Hãy thử lại");
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="font-bold text-xl my-5">Tất cả Sản phẩm</div>
      <Table<DataType>
        components={{
          body: { cell: EditableCell },
        }}
        columns={mergedColumns}
        dataSource={data}
        scroll={{ x: "max-content" }}
        rowClassName="editable-row"
        pagination={{ onChange: cancel, pageSize: 20 }}
      />
    </div>
  );
}

export default ListProductsPage;
