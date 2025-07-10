import React from "react";
import "../styles/Header.scss";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="/assets/header/header-logo.png" alt="Логотип СКАН" />
      </div>
      <nav className="navigation">
        <a href="/">Главная</a>
        <a href="/tarifs">Тарифы</a>
        <a href="/FAQ">FAQ</a>
      </nav>
      <div className="auth-actions">
        <a href="/register" className="auth-link">
          Зарегистрироваться
        </a>
        <span className="auth-divider" />
        <button className="auth-button">Войти</button>
      </div>
    </header>
  );
}

export default Header;
