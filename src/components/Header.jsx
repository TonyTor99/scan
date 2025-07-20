import React, { useState } from "react";
import "../styles/Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { userInfo, loadingUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsAnimating(false);
    }, 300);
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/assets/header/header-logo.png" alt="Логотип СКАН" />
      </div>

      <nav className="navigation">
        <Link to="/">Главная</Link>
        <Link to="#">Тарифы</Link>
        <Link to="#">FAQ</Link>
      </nav>

      {loadingUser && !userInfo ? (
        <div
          className={`auth-actions ${
            userInfo?.eventFiltersInfo ? "with-balance" : ""
          }`}
        >
          <div className="balance-panel">
            <div className="loading-spinner">
              <img src="/assets/result/spinner.svg" alt="Загрузка..." />
            </div>
          </div>
        </div>
      ) : userInfo ? (
        <div
          className={`auth-actions ${
            userInfo?.eventFiltersInfo ? "with-balance" : ""
          }`}
        >
          <div className="balance-panel">
            {!userInfo.eventFiltersInfo ? (
              <div className="auth-loader">
                <div className="loader" />
              </div>
            ) : (
              <div className="limits-box">
                <div className="label">
                  Использовано компаний{" "}
                  <span className="black">
                    {userInfo.eventFiltersInfo.usedCompanyCount ?? 0}
                  </span>
                </div>
                <div className="label">
                  Лимит по компаниям{" "}
                  <span className="green">
                    {userInfo.eventFiltersInfo.companyLimit ?? 0}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="user-info">
            <div className="user-name">
              <p>Алексей А.</p>
              <span onClick={handleLogout}>Выйти</span>
            </div>
            <img
              className="avatar"
              src="/assets/header/avatar.jpg"
              alt="Аватар"
              onClick={handleLogout}
            />
          </div>
        </div>
      ) : (
        <div
          className={`auth-actions ${
            userInfo?.eventFiltersInfo ? "with-balance" : ""
          }`}
        >
          {/* eslint-disable-next-line */}
          <a className="auth-link" href="#">
            Зарегистрироваться
          </a>
          <div className="auth-divider"></div>
          <button className="auth-button" onClick={() => navigate("/login")}>
            Войти
          </button>
        </div>
      )}

      {(isMobileMenuOpen || isAnimating) && (
        <div className={`mobile-menu ${isAnimating ? "slideOut" : "slideIn"}`}>
          <div className="mobile-header">
            <img src="/assets/footer/footer-logo.png" alt="Логотип СКАН" />
            <img
              src="/assets/header/close.svg"
              alt="Закрыть"
              className="close-icon"
              onClick={closeMobileMenu}
            />
          </div>

          <nav className="mobile-nav">
            <Link to="/" onClick={closeMobileMenu}>
              Главная
            </Link>
            <Link to="#" onClick={closeMobileMenu}>
              Тарифы
            </Link>
            <Link to="#" onClick={closeMobileMenu}>
              FAQ
            </Link>
          </nav>

          <div className="mobile-auth">
            {/* eslint-disable-next-line */}
            <a className="auth-link" href="#">
              Зарегистрироваться
            </a>
            <button
              className="auth-button"
              onClick={() => {
                closeMobileMenu();
                navigate("/login");
              }}
            >
              Войти
            </button>
          </div>
        </div>
      )}

      <div className="menu" onClick={openMobileMenu}>
        {isMobileMenuOpen ? (
          <img src="/assets/header/close.svg" alt="close" />
        ) : (
          <img src="/assets/header/menu.svg" alt="menu" />
        )}
      </div>
    </header>
  );
}

export default Header;
