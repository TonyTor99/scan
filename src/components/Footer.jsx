import React from "react";
import "../styles/Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="logo">
        <img src="/assets/footer/footer-logo.png" alt="" />
      </div>
      <nav className="footer-nav">
        <div className="info-container">
          <p className="adress">г. Москва, Цветной б-р, 40</p>
          <a href="tel:+74957712111">+7 495 771 21 11</a>
          <a href="mailto:info@skan.ru">info@skan.ru</a>
        </div>
        <p>Copyright. 2025</p>
      </nav>
    </footer>
  );
}

export default Footer;
