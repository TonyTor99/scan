import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchForm.scss";

function SearchForm() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    inn: "",
    tonality: "any",
    limit: "",
    startDate: "",
    endDate: "",
    maxFullness: false,
    inBusinessNews: false,
    onlyMainRole: false,
    onlyWithRiskFactors: false,
    includeTechNews: false,
    includeAnnouncements: false,
    includeDigests: false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const minDate = new Date("2000-01-01");
    const maxDate = new Date("2099-12-31"); 

    if (!formData.inn.trim()) {
      newErrors.inn = "Поле обязательно";
    } else if (!/^\d+$/.test(formData.inn)) {
      newErrors.inn = "Введите корректные данные";
    } else if (formData.inn.length !== 10) {
      newErrors.inn = "ИНН должен содержать 10 цифр";
    }

    if (!formData.limit.trim()) {
      newErrors.limit = "Поле обязательно";
    } else if (!/^\d+$/.test(formData.limit)) {
      newErrors.limit = "Введите число";
    } else if (
      parseInt(formData.limit, 10) < 1 ||
      parseInt(formData.limit, 10) > 1000
    ) {
      newErrors.limit = "Допустимо от 1 до 1000";
    }

    const isValidDateRange = (dateStr) =>
      dateRegex.test(dateStr) &&
      new Date(dateStr) >= minDate &&
      new Date(dateStr) <= maxDate;

    if (!isValidDateRange(formData.startDate)) {
      newErrors.startDate = "Введите корректную дату от 2000 до 2099 года";
    }

    if (!isValidDateRange(formData.endDate)) {
      newErrors.endDate = "Введите корректную дату от 2000 до 2099 года";
    }

    if (
      dateRegex.test(formData.startDate) &&
      dateRegex.test(formData.endDate)
    ) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = "Дата конца не может быть раньше начала";
      }
    }

    return newErrors;
  };

  const isFormValid = () => {
    return (
      formData.inn.trim().length === 10 &&
      /^\d{10}$/.test(formData.inn) &&
      formData.limit &&
      formData.startDate &&
      formData.endDate &&
      !Object.keys(validate()).length
    );
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const fieldErrors = validate();
    if (fieldErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    navigate("/result", { state: formData });
  };

  return (
    <div className="search-form-wrapper">
      <h1>
        НАЙДИТЕ НЕОБХОДИМЫЕ <br /> ДАННЫЕ В ПАРУ КЛИКОВ.
      </h1>
      <p className="subtitle">
        Задайте параметры поиска.
        <br /> Чем больше заполните, тем точнее поиск
      </p>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-left">
          <label className={errors.inn ? "error-label" : ""}>
            ИНН компании*{" "}
            <input
              name="inn"
              value={formData.inn}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="10 цифр"
              maxLength={10}
              className={errors.inn ? "error-input" : ""}
            />
            {errors.inn && <div className="error-text">{errors.inn}</div>}
          </label>

          <label>
            Тональность
            <select
              name="tonality"
              value={formData.tonality}
              onChange={handleChange}
            >
              <option value="any">Любая</option>
              <option value="positive">Позитивная</option>
              <option value="negative">Негативная</option>
            </select>
          </label>

          <label className={errors.limit ? "error-label" : ""}>
            Количество документов в выдаче*
            <input
              name="limit"
              type="number"
              value={formData.limit}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="От 1 до 1000"
              className={errors.limit ? "error-input" : ""}
            />
            {errors.limit && <div className="error-text">{errors.limit}</div>}
          </label>

          <label
            className={errors.startDate || errors.endDate ? "error-label" : ""}
          >
            Диапазон поиска*
            <div className="date-range">
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.startDate ? "error-input" : ""}
              />
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.endDate ? "error-input" : ""}
              />
            </div>
            {(errors.startDate || errors.endDate) && (
              <div className="error-text">
                {errors.startDate || errors.endDate}
              </div>
            )}
          </label>
        </div>

        <div className="form-right">
          {[
            ["maxFullness", "Признак максимальной полноты"],
            ["inBusinessNews", "Упоминания в бизнес-контексте"],
            ["onlyMainRole", "Главная роль в публикации"],
            ["onlyWithRiskFactors", "Публикации только с риск-факторами"],
            ["includeTechNews", "Включать технические новости рынков"],
            ["includeAnnouncements", "Включать анонсы и календари"],
            ["includeDigests", "Включать сводки новостей"],
          ].map(([name, label]) => (
            <label key={name}>
              <input
                type="checkbox"
                name={name}
                checked={formData[name]}
                onChange={handleChange}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="submit-container">
          <button
            type="submit"
            className={`submit-button ${!isFormValid() ? "disabled" : ""}`}
            disabled={!isFormValid()}
          >
            Поиск
          </button>
          <p className="note">* Обязательные к заполнению поля</p>
        </div>
      </form>
      <div className="images-right">
        <img
          src="/assets/searchform/rocket.png"
          alt="ракета"
          className="rocket"
        />
        <img
          src="/assets/searchform/document.png"
          alt="документ"
          className="document"
        />
        <img
          src="/assets/searchform/folders.png"
          alt="папки"
          className="folders"
        />
      </div>
    </div>
  );
}

export default SearchForm;
