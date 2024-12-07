export const validatePhoneNumber = (_: any, value: string) => {
  const vietnamesePhoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  if (!value || vietnamesePhoneRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("Số điện thoại không hợp lệ!"));
};
