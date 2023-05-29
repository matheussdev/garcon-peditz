export const TOKEN_KEY = "@peditz-Token";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setLogin = (token:string) => {
  localStorage.setItem(TOKEN_KEY, token);
  window.location.reload()
};
export const createAccount = (token:string) => {
  localStorage.setItem(TOKEN_KEY, token);
  window.location.href="/criar-empresa"
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('@peditzStore');
  window.location.reload()
};

