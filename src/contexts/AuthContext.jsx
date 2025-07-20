import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLogin, setIsLogin] = useState(!!token);

  // Авторизация
  const login = async (username, password) => {
    let login = username;

    const res = await axios.post(
      "https://gateway.scan-interfax.ru/api/v1/account/login",
      {
        login,
        password,
      }
    );
    localStorage.setItem("accessToken", res.data.accessToken);
    setToken(res.data.accessToken);
    setIsLogin(true);
  };

  // Выход
  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUserInfo(null);
    setIsLogin(false);
  };

  // Получение инфо о пользователе и лимитах
  useEffect(() => {
    if (token) {
      axios.defaults.baseURL = "https://gateway.scan-interfax.ru";
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.headers.post["Content-Type"] = "application/json";

      axios
        .get("/api/v1/account/info/")
        .then((res) => {
          setUserInfo(res.data);
        })
        .catch(() => logout())
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, userInfo, loadingUser, isLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
