import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/LoginPage.scss";
import { useMediaQuery } from "../hooks/useMediaQuery";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const isMobile = useMediaQuery("(max-width: 375px)");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    if (!username.trim()) {
      setUsernameError("Поле обязательно");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError("Поле обязательно");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setServerError("Неверный логин или пароль");
    }
  };

  const isDisabled = username.trim() === "" || password.trim() === "";

  const loginForm = (
    <div className="login-form-wrapper">
      <img src="/assets/login/zamok.svg" alt="zamok" className="zamok" />
      <div className="tabs">
        <button className="active">Войти</button>
        <button>Зарегистрироваться</button>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Логин или номер телефона:
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={usernameError ? "error" : ""}
          />
          {usernameError && (
            <span className="error-message">{usernameError}</span>
          )}
        </label>

        <label>
          Пароль:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? "error" : ""}
          />
          {passwordError && (
            <span className="error-message">{passwordError}</span>
          )}
        </label>

        {serverError && (
          <span className="error-message" style={{ marginTop: "5px" }}>
            {serverError}
          </span>
        )}

        <button type="submit" className="submit-btn" disabled={isDisabled}>
          Войти
        </button>

        <button type="button" className="forgot-password">
          Восстановить пароль
        </button>

        <div className="social-login">
          <p>Войти через:</p>
          <div className="social-buttons">
            {/* eslint-disable-next-line */}
            <a href="#">
              <img src="/assets/login/google.svg" alt="google" />
            </a>
            {/* eslint-disable-next-line */}
            <a href="#">
              <img src="/assets/login/facebook.svg" alt="facebook" />
            </a>
            {/* eslint-disable-next-line */}
            <a href="#">
              <img src="/assets/login/yandex.svg" alt="yandex" />
            </a>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div className="login-page">
      <div className="login-left">
        <h1>
          ДЛЯ ОФОРМЛЕНИЯ ПОДПИСКИ
          <br />
          НА ТАРИФ, НЕОБХОДИМО
          <br />
          АВТОРИЗОВАТЬСЯ.
        </h1>
        {isMobile && loginForm}
        <img src="/assets/login/illustration.png" alt="Авторизация" />
      </div>
      {!isMobile && loginForm}
    </div>
  );
}

export default LoginPage;
