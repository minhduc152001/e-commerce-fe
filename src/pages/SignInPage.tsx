import { Button, Form, Input } from "antd";
import { useState } from "react";
import { axiosInstance } from "../api/axios";
import { toast } from "react-toastify";
import { setAuthSession } from "../utils/handleAuth";

type FieldType = {
  username: string;
  password: string;
};

function SignInPage() {
  const [form] = Form.useForm<FieldType>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FieldType) => {
    try {
      setLoading(true);
      values.username = values.username.trim().toLocaleLowerCase();

      const response = await axiosInstance.post("/auth/login", values);

      const user = response.data.user;
      toast.error("Đăng nhập thành công");
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
    <div className="flex flex-col px-10 py-[40%]">
      <div className="font-bold text-xl py-5 text-center">Đăng nhập</div>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Hãy nhập tên người dùng" }]}
        >
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Hãy nhập mật khẩu" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignInPage;
