import { Image } from "antd";
import React from "react";

type IProp = {
  images: string[];
};

function ImageFeedbackShow({ images }: IProp) {
  if (!images.length) return <></>;

  return (
    <div className="flex mt-3 gap-3">
      <Image.PreviewGroup>
        {images.map((el) => (
          <Image width={50} height={50} src={el} />
        ))}
      </Image.PreviewGroup>
    </div>
  );
}

export default ImageFeedbackShow;
