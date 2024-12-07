import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import React from "react";

function LoadingPage() {
  return (
    <div className="justify-center flex w-full h-96">
      <Flex align="center" gap="middle" className="">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Flex>
    </div>
  );
}

export default LoadingPage;
