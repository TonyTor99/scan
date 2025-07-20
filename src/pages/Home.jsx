import React, { useRef } from "react";
import "../styles/Home.scss";

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const benefitCards = [
  {
    img: "/assets/home/card1.png",
    alt: "Секундомер",
    text: "Высокая и оперативная скорость обработки заявки",
  },
  {
    img: "/assets/home/card2.png",
    alt: "Лупа",
    text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос",
  },
  {
    img: "/assets/home/card3.png",
    alt: "Щит",
    text: "Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству",
  },
  {
    img: "/assets/home/card1.png",
    alt: "Секундомер",
    text: "Высокая и оперативная скорость обработки заявки",
  },
  {
    img: "/assets/home/card2.png",
    alt: "Лупа",
    text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос",
  },
  {
    img: "/assets/home/card3.png",
    alt: "Щит",
    text: "Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству",
  },
];

function BenefitsCarousel() {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    const scrollAmount = 420; // ширина карточки + gap
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="carousel-wrapper">
      <button className="arrow" onClick={() => scroll("left")}>
        <img src="/assets/home/arrow-left.svg" alt="стрелка влево" />
      </button>

      <div className="benefits-carousel" ref={carouselRef}>
        {benefitCards.map((item, index) => (
          <div className="benefit-card" key={index}>
            <img src={item.img} alt={item.alt} />
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <button className="arrow" onClick={() => scroll("right")}>
        <img src="/assets/home/arrow-right.svg" alt="стрелка вправо" />
      </button>
    </div>
  );
}

function Home() {
  const { isLogin } = useAuth();

  return (
    <div className="home">
      <section className="promo">
        <div className="promo-text">
          <h1>
            сервис по поиску
            <br /> публикаций <br /> о компании <br /> по его ИНН
          </h1>
          <p>
            Комплексный анализ публикаций, получение данных
            <br /> в формате PDF на электронную почту.
          </p>
          {isLogin && (
            <Link to="/search" className="promo-button">
              Запросить данные
            </Link>
          )}
        </div>
        <div className="promo-image">
          <img
            src="/assets/home/promo-illustration.jpg"
            alt="Иллюстрация поиска"
          />
        </div>
      </section>

      <section className="benefits">
        <h2>Почему именно мы</h2>
        <BenefitsCarousel />

        <img
          src="/assets/home/benifit-illustration.png"
          alt="Иллюстрация идеи"
          className="benefit-illustration"
        />
      </section>

      <section className="tariffs">
        <h2>Наши тарифы</h2>
        <div className="tariffs-container">
          <div
            className={`tariff-list ${
              isLogin ? "active-tariff" : "border-none"
            }`}
          >
            <div className="tariff-card ">
              <div className="tariff-header">
                <div className="tariff-header-text">
                  <h3>Beginner</h3>
                  <p className="tariff-period">Для небольшого исследования</p>
                </div>
                <img src="/assets/home/tariff-card1.svg" alt="Лампочка" />
              </div>
              <div className="tariff-info">
                <div className="tariff-price">
                  <p className="price">
                    799 ₽ <span>1 200 ₽</span>
                  </p>
                  <p className="price-info">
                    или 150 ₽/мес. при рассрочке на 24 мес.
                  </p>
                </div>
                <div className="tariff-details">
                  <h4>В тариф входит</h4>
                  <ul className="tariff-names">
                    <li>Безлимитная история запросов</li>
                    <li>Безопасная сделка</li>
                    <li>Поддержка 24/7</li>
                  </ul>
                </div>
                {isLogin ? (
                  <button className="tariff-button gray">
                    Перейти в личный кабинет
                  </button>
                ) : (
                  <button className="tariff-button">Подробнее</button>
                )}
              </div>
            </div>
          </div>

          <div className="tariff-list border-none">
            <div className="tariff-card">
              <div className="tariff-header blue">
                <div className="tariff-header-text">
                  <h3>Pro</h3>
                  <p className="tariff-period">Для HR и фрилансеров</p>
                </div>
                <img src="/assets/home/tariff-card2.svg" alt="Мишень" />
              </div>
              <div className="tariff-info">
                <div className="tariff-price">
                  <p className="price">
                    1 299 ₽ <span>2 600 ₽</span>
                  </p>
                  <p className="price-info">
                    или 279 ₽/мес. при рассрочке на 24 мес.
                  </p>
                </div>
                <div className="tariff-details">
                  <h4>В тариф входит</h4>
                  <ul className="tariff-names">
                    <li>Все пункты тарифа Beginner</li>
                    <li>Экспорт истории</li>
                    <li>Рекомендации по приоритетам</li>
                  </ul>
                </div>
                <button className="tariff-button">Подробнее</button>
              </div>
            </div>
          </div>

          <div className="tariff-list border-none">
            <div className="tariff-card">
              <div className="tariff-header black">
                <div className="tariff-header-text">
                  <h3>Business</h3>
                  <p className="tariff-period">Для корпоративных клиентов</p>
                </div>
                <img src="/assets/home/tariff-card3.svg" alt="Ноутбук" />
              </div>
              <div className="tariff-info">
                <div className="tariff-price">
                  <p className="price">
                    2 379 ₽ <span>3 700 ₽</span>
                  </p>
                  <p className="price-info" style={{ color: "white" }}>
                    или 279 ₽/мес. при рассрочке на 24 мес.
                  </p>
                </div>
                <div className="tariff-details">
                  <h4>В тариф входит</h4>
                  <ul className="tariff-names">
                    <li>Все пункты тарифа Pro</li>
                    <li>Безлимитное количество запросов</li>
                    <li>Приоритетная поддержка</li>
                  </ul>
                </div>
                <button className="tariff-button">Подробнее</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
