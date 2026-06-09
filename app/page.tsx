"use client";

import { useEffect, useMemo, useState } from "react";
import { FrameBackground } from "@/components/FrameBackground";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const services = [
  {
    id: "1477",
    title: "Контакт-центр 1477",
    lead: "Единая точка консультационной и технической поддержки пользователей сервисов Национального Банка.",
    items: ["административная отчетность", "веб-порталы НБРК", "маршрутизация обращений"],
  },
  {
    id: "PROC",
    title: "Портал закупок",
    lead: "Техническая эксплуатация, сопровождение и развитие электронной платформы закупок.",
    items: ["24/7 доступность", "поддержка поставщиков", "мониторинг и обновления"],
  },
  {
    id: "DATA",
    title: "Оператор данных",
    lead: "Профессиональная обработка, хранение и управление данными в защищенной цифровой среде.",
    items: ["базы данных", "целостность информации", "системы хранения"],
  },
  {
    id: "IT",
    title: "Единый центр IT-услуг",
    lead: "Инженерная поддержка инфраструктуры, систем и программных продуктов полного цикла.",
    items: ["интеграция", "администрирование", "корпоративные сети"],
  },
];

const timeline = [
  ["1996", "Создание Банковского сервисного бюро Национального Банка Республики Казахстан."],
  ["2003", "Сертификация системы менеджмента качества по стандарту ISO 9001."],
  ["2015", "Преобразование в акционерное общество Банковское сервисное бюро."],
  ["2020", "Портал закупок введен в промышленную эксплуатацию."],
  ["2021", "Статус технологического оператора данных НБРК."],
  ["2025", "Преобразование в АО «Центр цифрового развития Национального Банка Казахстана»."],
];

const people = [
  ["Zhalenov_Binur.jpg", "Бинур Жаленов", "Председатель Совета директоров"],
  ["Amardinov.jpg", "Малик Амардинов", "Председатель Правления"],
  ["Uzbekov_Askhat.png", "Асхат Узбеков", "Член Совета директоров"],
  ["Arinova_Aizhan.jpg", "Айжан Аринова", "Член Совета директоров"],
  ["Bayan_Kb.png", "Баян Конирбаев", "Независимый директор"],
  ["Alpamysov_Abai.png", "Абай Алпамысов", "Независимый директор"],
  ["Marat_Askar.png", "Аскар Марат", "Независимый директор"],
  ["Durmagambetov.jpg", "Ерлан Дурмагамбетов", "Первый заместитель Председателя Правления"],
  ["Kentbekov.jpg", "Аргын Кентбеков", "Заместитель Председателя Правления"],
  ["Imajanov.jpg", "Бахытжан Имажанов", "Заместитель Председателя Правления"],
];

const servicePoints = [
  {
    id: "1477",
    shortLabel: "1477",
    x: 18,
    y: 25,
    title: "Контакт-центр 1477",
    body: "Единая линия консультаций, маршрутизация обращений и техническая поддержка пользователей сервисов Национального Банка.",
  },
  {
    id: "PROC",
    shortLabel: "Закупки",
    x: 64,
    y: 22,
    title: "Портал закупок",
    body: "Сопровождение электронной платформы закупок, доступность 24/7 и развитие пользовательских процессов.",
  },
  {
    id: "DATA",
    shortLabel: "Данные",
    x: 34,
    y: 60,
    title: "Оператор данных",
    body: "Хранение, обработка и защита данных в критичных системах с упором на точность и надежность.",
  },
  {
    id: "IT",
    shortLabel: "IT-услуги",
    x: 74,
    y: 58,
    title: "Единый центр IT-услуг",
    body: "Инженерная поддержка инфраструктуры, корпоративных сетей и бизнес-систем полного цикла.",
  },
];

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        setProgress(clamp(window.scrollY / max));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}

function ServiceShowcase() {
  const [activePoint, setActivePoint] = useState(servicePoints[0].id);
  const activeService = servicePoints.find((point) => point.id === activePoint) ?? servicePoints[0];

  return (
    <div className="serviceShowcase" aria-label="Интерактивные услуги DDC">
      <div className="serviceShowcaseFrame">
        {servicePoints.map((point) => (
          <button
            className={`hotspotButton ${point.id === activePoint ? "isActive" : ""}`}
            key={point.id}
            type="button"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            aria-label={point.title}
            onMouseEnter={() => setActivePoint(point.id)}
            onFocus={() => setActivePoint(point.id)}
            onClick={() => setActivePoint(point.id)}
          >
            <span className="hotspotDot" />
            <span className="hotspotLabel">{point.shortLabel}</span>
          </button>
        ))}

        <article className="hotspotCard">
          <p>Каталог услуг</p>
          <h3>{activeService.title}</h3>
          <span>{activeService.body}</span>
        </article>
      </div>
    </div>
  );
}

export default function Home() {
  const progress = useScrollProgress();
  const activeService = useMemo(
    () => services[Math.min(services.length - 1, Math.floor(progress * services.length))],
    [progress],
  );
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="pageShell">
      <FrameBackground progress={progress} />

      <div className="progressTrack" aria-hidden="true">
        <div style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className={`nav ${menuOpen ? "isOpen" : ""}`}>
        <a href="#top" className="brand" aria-label="DDC">
          <span>DDC</span>
          <small>Центр цифрового развития</small>
        </a>
        <button
          type="button"
          className="navBurger"
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className="navLinks">
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Услуги
          </a>
          <a href="#mission" onClick={() => setMenuOpen(false)}>
            Миссия
          </a>
          <a href="#team" onClick={() => setMenuOpen(false)}>
            Команда
          </a>
          <a href="#contacts" onClick={() => setMenuOpen(false)}>
            Контакты
          </a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="heroCopy">
          <p className="eyebrow">АО «Центр цифрового развития»</p>
          <h1>Цифровая инфраструктура для финансовой стабильности Казахстана</h1>
          <p>
            Развиваем сервисы Национального Банка: портал закупок, контакт-центр 1477, инженерную поддержку,
            управление данными и критичные IT-системы.
          </p>
          <div className="heroButtons">
            <a href="#services">Смотреть услуги</a>
            <a href="#contacts">Связаться</a>
          </div>
        </div>

        <aside className="signalPanel">
          <span>{activeService.id}</span>
          <h2>{activeService.title}</h2>
          <p>{activeService.lead}</p>
        </aside>
      </section>

      <section className="stats">
        <article>
          <strong>25+</strong>
          <span>лет опыта с 1996 года</span>
        </article>
        <article>
          <strong>50/24</strong>
          <span>систем разработано / используется</span>
        </article>
        <article>
          <strong>1477</strong>
          <span>единый контакт-центр НБРК</span>
        </article>
      </section>

      <section id="services" className="section services">
        <div className="sectionTitle">
          <p className="eyebrow">Каталог услуг</p>
          <h2>Тихая, надежная система сервисов вокруг Национального Банка</h2>
          <p className="sectionLead">
            Пролистай до экрана компьютера: точки на дисплее раскрывают краткое название услуги, а описание появляется по
            наведению или клику.
          </p>
        </div>
        <div className="serviceGrid">
          {services.map((service) => (
            <article className="service" key={service.id}>
              <div>
                <span>{service.id}</span>
                <h3>{service.title}</h3>
                <p>{service.lead}</p>
              </div>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <ServiceShowcase />
      </section>

      <section id="mission" className="section split">
        <div>
          <p className="eyebrow">Миссия</p>
          <h2>Быть лидером в цифровой трансформации финансовой экосистемы</h2>
        </div>
        <div className="textBlock">
          <p>
            ЦЦР обеспечивает Национальный Банк и его дочерние структуры передовыми IT-решениями, ускоряет инновации,
            поддерживает стабильность и задает новые стандарты качества в управлении данными и технологиями.
          </p>
          <div className="values">
            <span>Инновации</span>
            <span>Прозрачность</span>
            <span>Качество</span>
            <span>Надежность</span>
            <span>Партнерство</span>
          </div>
        </div>
      </section>

      <section className="section timeline">
        <div className="sectionTitle">
          <p className="eyebrow">История</p>
          <h2>От сервисного бюро до центра цифрового развития</h2>
        </div>
        <div className="timelineGrid">
          {timeline.map(([year, text]) => (
            <article key={year}>
              <strong>{year}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="team" className="section team">
        <div className="sectionTitle">
          <p className="eyebrow">Управление</p>
          <h2>Команда стратегического развития</h2>
        </div>
        <div className="peopleGrid">
          {people.map(([image, name, role]) => (
            <article key={name} className="person">
              <img src={`/people/${image}`} alt={name} />
              <div>
                <h3>{name}</h3>
                <p>{role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contacts" className="section contacts">
        <div>
          <p className="eyebrow">Контакты</p>
          <h2>Готовы ответить на вопросы по сервисам и деятельности центра</h2>
        </div>
        <address>
          <a href="tel:+77272584958">+7 (727) 258-49-58</a>
          <a href="mailto:info@bsbnb.kz">info@bsbnb.kz</a>
          <span>РК, г. Астана, пр. Мангилик Ел, 57А</span>
          <span>Контакт-центр: 1477</span>
        </address>
      </section>
    </main>
  );
}