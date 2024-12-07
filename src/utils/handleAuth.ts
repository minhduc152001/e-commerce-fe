export const setAuthSession = (accessToken: string, role: string) => {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("role", role);

  window.location.href = "/";
};
