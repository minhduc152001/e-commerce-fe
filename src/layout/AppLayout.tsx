import { Layout, Menu } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Content } = Layout;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("role");
    navigate("/sign-in"); // Redirect to sign-in
  };

  const menuItemsAdmin = isAdmin
    ? [
        {
          key: "create-product",
          label: "Tạo Sản phẩm",
          path: "/create-product",
        },
        { key: "create-review", label: "Tạo Đánh giá", path: "/create-review" },
        {
          key: "list-products",
          label: "Tất cả Sản phẩm",
          path: "/list-products",
        },
        {
          key: "manage-product-tiers",
          label: "Quản lý Mua combo",
          path: "/manage-product-tiers",
        },
      ]
    : [];

  const menuItems = [
    { key: "orders", label: "Đơn hàng", path: "/don-hang" },
    { key: "logout", label: "Đăng xuất", action: handleLogout },
  ].concat(menuItemsAdmin);

  const handleMenuClick = ({ key }: { key: string }) => {
    const menuItem = menuItems.find((item) => item.key === key);
    if (menuItem?.action) {
      menuItem.action();
    } else if (menuItem?.path) {
      navigate(menuItem.path);
    }
  };

  return (
    <Layout>
      <Header
        style={{
          background: "white",
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <div
          style={{
            float: "left",
            color: "black",
            fontWeight: "bold",
            fontSize: "20px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Shopping
        </div>
        <Menu
          className="justify-end"
          theme="light"
          mode="horizontal"
          onClick={handleMenuClick}
          items={menuItems.map((item) => ({
            key: item.key,
            label: item.label,
          }))}
        />
      </Header>
      <Content style={{ background: "#fff" }}>
        <Outlet /> {/* Render nested routes */}
      </Content>
    </Layout>
  );
};

export default AppLayout;
