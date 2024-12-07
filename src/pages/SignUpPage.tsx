import { Button, Form, Input } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axios";
import { validatePhoneNumber } from "../utils/validate";
import { setAuthSession } from "../utils/handleAuth";

type FieldType = {
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
};

function SignUpPage() {
  const [form] = Form.useForm<FieldType>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FieldType) => {
    const { confirmPassword, password, phone, username } = values;
    if (confirmPassword !== password) {
      toast.error("Mật khẩu xác nhận không chính xác!");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/auth/sign-up", {
        password,
        phone,
        username: username.trim().toLocaleLowerCase(),
      });

      const user = response.data.user;
      toast.success("Đăng ký người dùng mới thành công!");
      setAuthSession(user.accessToken, user.role);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Xảy ra lỗi, hãy thử lại sau!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-10 py-[30%]">
      <div className="font-bold text-xl py-5 text-center">Đăng ký</div>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Hãy nhập số điện thoại" },
            {
              validator: validatePhoneNumber,
            },
          ]}
        >
          <Input type="tel" placeholder="0312456789" maxLength={10} />
        </Form.Item>

        <Form.Item
          label="Tên người dùng"
          name="username"
          rules={[{ required: true, message: "Hãy nhập tên người dùng" }]}
        >
          <Input placeholder="Ví dụ: minhduc2001" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Hãy nhập mật khẩu" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          rules={[{ required: true, message: "Hãy nhập lại mật khẩu" }]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignUpPage;
