import {
  HomeFilled,
  MailOutlined,
  PhoneFilled,
  SecurityScanOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

type Props = {
  externalLink?: string;
};

function Footer({ externalLink }: Props) {
  return (
    <div className="mt-6 border-b border-solid border-b-neutral-600 pb-3 mx-3">
      <div className="text-2xl flex flex-col gap-3">
        <div className="text-lg font-bold">THÔNG TIN LIÊN HỆ</div>
        <div className="flex items-center gap-3">
          <HomeFilled />
          <div className="text-sm">
            Địa chỉ: 25 Lê Lợi, TT Vấn Đình, Ứng Hòa , Hà Nội
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PhoneFilled />
          <div className="text-sm">Hotline: 083.2970.078</div>
        </div>
        <div className="flex items-center gap-3">
          <MailOutlined />
          <div className="text-sm">Email: vuhuuduy25121999@gmail.com</div>
        </div>
        {externalLink && (
          <div className="flex items-center gap-3">
            <img
              alt="shopee-icon"
              src="https://e-commerce-tuan-anh.s3.ap-southeast-1.amazonaws.com/shopee.png"
              className="w-6 h-6"
            />
            <a href={externalLink} className="text-sm text-nowrap truncate font-bold">
              {externalLink}
            </a>
          </div>
        )}
      </div>

      <div className="text-2xl flex flex-col gap-3 mt-5">
        <div className="text-lg font-bold">CHÍNH SÁCH KHÁCH HÀNG</div>
        <div className="flex items-center gap-3">
          <ShoppingCartOutlined />
          <div className="text-sm">Chính sách vận chuyển</div>
        </div>
        <div className="flex items-center gap-3">
          <UnorderedListOutlined />
          <div className="text-sm">Chính sách bảo hành</div>
        </div>
        <div className="flex items-center gap-3">
          <SecurityScanOutlined />
          <div className="text-sm">Chính sách bảo mật</div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
