import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../hooks/useMediaQuery";
import axios from "axios";
import "../styles/Result.scss";

const Result = () => {
  const location = useLocation();
  const searchParams = location.state;
  const [docIds, setDocIds] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [docPage, setDocPage] = useState(0);
  const DOCS_PER_PAGE = 10;
  const [histogramData, setHistogramData] = useState(null);
  const frameRef = useRef(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 375px)");
  const sliderRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/");
    } else if (!location.state) {
      navigate("/search");
    }
  }, [navigate, location.state]);

  useEffect(() => {
    const fetchHistogramData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !searchParams) return;

      const requestBody = {
        issueDateInterval: {
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
        },
        searchContext: {
          targetSearchEntitiesContext: {
            targetSearchEntities: [
              {
                type: "company",
                sparkId: null,
                entityId: null,
                inn: searchParams.inn,
                maxFullness: searchParams.maxFullness,
                inBusinessNews: searchParams.inBusinessNews,
              },
            ],
            onlyMainRole: searchParams.onlyMainRole,
            tonality: searchParams.tonality,
            onlyWithRiskFactors: searchParams.onlyWithRiskFactors,
            riskFactors: {
              and: [],
              or: [],
              not: [],
            },
          },
          themesFilter: {
            and: [],
            or: [],
            not: [],
          },
        },
        searchArea: {
          includedSources: [],
          excludedSources: [],
          includedSourceGroups: [],
          excludedSourceGroups: [],
        },
        attributeFilters: {
          excludeTechNews: !searchParams.includeTechNews,
          excludeAnnouncements: !searchParams.includeAnnouncements,
          excludeDigests: !searchParams.includeDigests,
        },
        similarMode: "duplicates",
        limit: Number(searchParams.limit),
        sortType: "sourceInfluence",
        sortDirectionType: "desc",
        intervalType: "day",
        histogramTypes: ["totalDocuments", "riskFactors"],
      };

      try {
        const response = await axios.post(
          "https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms",
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHistogramData(response.data.data);
      } catch (error) {
        console.error("Ошибка загрузки гистограмм:", error);
      }
    };

    fetchHistogramData();
  }, [searchParams]);

  useEffect(() => {
    const fetchDocumentIds = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !searchParams) return;

      const requestBody = {
        issueDateInterval: {
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
        },
        searchContext: {
          targetSearchEntitiesContext: {
            targetSearchEntities: [
              {
                type: "company",
                inn: searchParams.inn,
                maxFullness: searchParams.maxFullness,
                inBusinessNews: searchParams.inBusinessNews,
              },
            ],
            onlyMainRole: searchParams.onlyMainRole,
            tonality: searchParams.tonality,
            onlyWithRiskFactors: searchParams.onlyWithRiskFactors,
            riskFactors: { and: [], or: [], not: [] },
          },
          themesFilter: { and: [], or: [], not: [] },
        },
        similarMode: "duplicates",
        limit: Number(searchParams.limit),
        sortType: "sourceInfluence",
        sortDirectionType: "desc",
        attributeFilters: {
          excludeTechNews: !searchParams.includeTechNews,
          excludeAnnouncements: !searchParams.includeAnnouncements,
          excludeDigests: !searchParams.includeDigests,
        },
      };

      try {
        const res = await axios.post(
          "https://gateway.scan-interfax.ru/api/v1/objectsearch",
          requestBody,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const ids = res.data.items.map((item) => item.encodedId);
        setDocIds(ids);
      } catch (error) {
        console.error("Ошибка при получении ID документов:", error);
      }
    };

    fetchDocumentIds();
  }, [searchParams]);

  console.log(documents[3]);

  useEffect(() => {
    const fetchDocsByIds = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || docIds.length === 0) return;

      const portion = docIds.slice(
        docPage * DOCS_PER_PAGE,
        (docPage + 1) * DOCS_PER_PAGE
      );

      try {
        const res = await axios.post(
          "https://gateway.scan-interfax.ru/api/v1/documents",
          { ids: portion },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDocuments((prev) => [...prev, ...res.data]);
      } catch (error) {
        console.error("Ошибка при получении документов:", error);
      }
    };

    fetchDocsByIds();
  }, [docIds, docPage]);

  const scrollLeft = () => {
    if (isMobile && sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    } else if (frameRef.current) {
      frameRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (isMobile && sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    } else if (frameRef.current) {
      frameRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const extractText = (markup, maxLength = 300) => {
    if (!markup) return "";

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(markup, "text/html");
      const text = doc.body.textContent.trim().replace(/\s+/g, " ");
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    } catch (e) {
      return "";
    }
  };

  const totalData = Array.isArray(histogramData)
    ? histogramData.find((h) => h.histogramType === "totalDocuments")?.data ||
      []
    : [];

  const riskData = Array.isArray(histogramData)
    ? histogramData.find((h) => h.histogramType === "riskFactors")?.data || []
    : [];

  const sortedTotalData = [...totalData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const sortedRiskData = sortedTotalData.map((item) => {
    return riskData.find((r) => r.date === item.date) || { value: 0 };
  });

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="result-container">
      <section className="result-header">
        <div className="text-block">
          <h1>
            Ищем. Скоро
            <br /> будут результаты
          </h1>
          <p>
            Поиск может занять некоторое время,
            <br />
            просим сохранять терпение.
          </p>
        </div>
        <div className="image-block">
          <img src="/assets/result/top-img.png" alt="Target Illustration" />
        </div>
      </section>

      <section className="summary-section">
        <h2>Общая сводка</h2>
        <p>Найдено {docIds.length} вариантов</p>

        <div className="summary-carousel">
          <img
            src="/assets/home/arrow-left.svg"
            alt="Стрелка влево"
            onClick={scrollLeft}
          />
          <div className="summary-frame" ref={frameRef}>
            <div
              className={`summary-table ${
                isMobile ? "horizontal-view" : "vertical-view"
              }`}
            >
              <div className="summary-mobile-wrapper">
                <div className="summary-header-row">
                  <div className="cell">Период</div>
                  <div className="cell">Всего</div>
                  <div className="cell">Риски</div>
                </div>

                <div className="summary-slider" ref={sliderRef}>
                  {sortedTotalData.map((item, index) => (
                    <div className="summary-card" key={index}>
                      <div className="cell">{formatDate(item.date)}</div>
                      <div className="cell">{item.value}</div>
                      <div className="cell">
                        {sortedRiskData[index]?.value ?? 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <img
            src="/assets/home/arrow-right.svg"
            alt="Стрелка вправо"
            onClick={scrollRight}
          />
        </div>
      </section>

      <section className="documents-section">
        <h2>Список документов</h2>
        <div className="documents-list">
          {documents.map((doc, i) => (
            <div className="doc-card" key={i}>
              <div className="info">
                <p className="date">
                  {new Date(doc.ok.issueDate).toLocaleDateString("ru-RU")}
                </p>
                <a href="#" className="source" target="_blank" rel="noreferrer">
                  {doc.ok.source?.name || "Источник"}
                </a>
              </div>
              <a href={doc.ok.url || "#"} target="_blank" rel="noreferrer">
                <h3>{doc.ok.title?.text || "Без заголовка"}</h3>
              </a>
              {(doc.ok.attributes?.isTechNews ||
                doc.ok.attributes?.isAnnouncement ||
                doc.ok.attributes?.isDigest ||
                doc.ok.attributes?.isSpeechRecognition ||
                doc.ok.attributes?.isReducedContent) && (
                <p className="category">
                  {doc.ok.attributes?.isTechNews && (
                    <span className="tag">Технические новости</span>
                  )}
                  {doc.ok.attributes?.isAnnouncement && (
                    <span className="tag">Анонсы и события</span>
                  )}
                  {doc.ok.attributes?.isDigest && (
                    <span className="tag">Сводки новостей</span>
                  )}
                  {doc.ok.attributes?.isSpeechRecognition && (
                    <span className="tag">Распознание речи</span>
                  )}
                  {doc.ok.attributes?.isReducedContent && (
                    <span className="tag">Урезанный контент</span>
                  )}
                </p>
              )}
              <div className="doc-image">
                <img src="/assets/result/1.png" alt="Doc" />
              </div>
              {doc.ok.content.markup && (
                <p className="doc-text">
                  {extractText(doc.ok.content?.markup)}
                </p>
              )}
              <div className="doc-footer">
                <button>
                  <a href={doc.ok.url || "#"} target="_blank" rel="noreferrer">
                    Читать в источнике
                  </a>
                </button>
                <span>{doc.ok.attributes?.wordCount ?? 0} слов</span>
              </div>
            </div>
          ))}
        </div>

        {(docPage + 1) * DOCS_PER_PAGE < docIds.length && (
          <div className="load-more">
            <button
              className="load-button"
              onClick={() => setDocPage((p) => p + 1)}
            >
              Показать больше
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Result;
