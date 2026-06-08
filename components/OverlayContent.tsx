"use client";

import { useState } from "react";

type OverlayContentProps = {
  progress: number;
};

const scenes = [
  {
    range: [0.05, 0.23],
    eyebrow: "01 / Цифровые решения",
    title: "Финансовая стабильность начинается с надежных систем",
    body: "DDC создает и сопровождает цифровые сервисы для Национального Банка и его дочерних организаций.",
  },
  {
    range: [0.29, 0.47],
    eyebrow: "02 / Информационная безопасность",
    title: "Защита данных как часть архитектуры",
    body: "Команды центра поддерживают отказоустойчивость, мониторинг, резервирование и развитие критичных IT-систем.",
  },
  {
    range: [0.54, 0.72],
    eyebrow: "03 / Оператор данных",
    title: "Технологический оператор для государственных сервисов",
    body: "Центр работает с высоконагруженными процессами, аналитикой и инфраструктурой, где важны прозрачность и точность.",
  },
  {
    range: [0.78, 0.96],
    eyebrow: "04 / Сервис 1477",
    title: "Контакт-центр и портал закупок в единой цифровой экосистеме",
    body: "DDC объединяет сервисную поддержку, закупочные процессы и эксплуатацию систем в понятный цифровой контур.",
  },
];

const servicePoints = [
  {
    id: "systems",
    label: "Разработка систем",
    shortLabel: "IT-системы",
    x: 58,
    y: 43,
    title: "Разработка и сопровождение IT-систем",
    body: "Проектирование, внедрение и развитие цифровых решений для финансовой инфраструктуры и внутренних сервисов.",
  },
  {
    id: "security",
    label: "ИБ",
    shortLabel: "Инфобез",
    x: 69,
    y: 57,
    title: "Информационная безопасность",
    body: "Мониторинг, защита данных, резервирование и техническая устойчивость критичных сервисов.",
  },
  {
    id: "support",
    label: "1477",
    shortLabel: "Поддержка 1477",
    x: 48,
    y: 62,
    title: "Сервисная поддержка",
    body: "Контакт-центр 1477 и поддержка пользователей в единой цифровой экосистеме DDC.",
  },
];

const getOpacity = (progress: number, start: number, end: number) => {
  const fade = 0.055;
  const fadeIn = Math.min(1, Math.max(0, (progress - start) / fade));
  const fadeOut = Math.min(1, Math.max(0, (end - progress) / fade));
  return Math.min(fadeIn, fadeOut);
};

const getHoldOpacity = (progress: number, start: number, fade = 0.06) =>
  Math.min(1, Math.max(0, (progress - start) / fade));

export function OverlayContent({ progress }: OverlayContentProps) {
  const [activePoint, setActivePoint] = useState(servicePoints[0].id);
  const hotspotOpacity = getHoldOpacity(progress, 0.66, 0.08);
  const introOpacity = Math.max(0, 1 - progress / 0.18);
  const activeService = servicePoints.find((point) => point.id === activePoint) ?? servicePoints[0];

  return (
    <div className="overlayContent">
      <section
        className="introBlock"
        style={{
          opacity: introOpacity,
          transform: `translate3d(0, ${(1 - introOpacity) * -18}px, 0)`,
          pointerEvents: introOpacity > 0.2 ? "auto" : "none",
        }}
      >
        <p className="kicker">Digital Development Center</p>
        <h1>Цифровые решения для финансовой стабильности государства.</h1>
        <p>
          Центр цифрового развития внедряет передовые IT-решения для Национального Банка Республики Казахстан
          и его структур.
        </p>
        <div className="metricGrid" aria-label="Ключевые показатели DDC">
          <span><strong>25+</strong> лет опыта</span>
          <span><strong>50</strong> систем разработано</span>
          <span><strong>24</strong> системы в эксплуатации</span>
        </div>
      </section>

      <div
        className="serviceHotspots"
        style={{
          opacity: hotspotOpacity,
          pointerEvents: hotspotOpacity > 0.2 ? "auto" : "none",
          transform: `translate3d(0, ${(1 - hotspotOpacity) * 18}px, 0)`,
        }}
        aria-label="Интерактивные услуги DDC"
      >
        {servicePoints.map((point) => (
          <button
            className={`hotspotButton ${point.id === activePoint ? "isActive" : ""}`}
            key={point.id}
            type="button"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            aria-label={point.label}
            onClick={() => setActivePoint(point.id)}
          >
            <span className="hotspotDot" />
            <span className="hotspotLabel">{point.shortLabel}</span>
          </button>
        ))}

        <article className="hotspotCard">
          <p>Наши услуги</p>
          <h2>{activeService.title}</h2>
          <span>{activeService.body}</span>
        </article>
      </div>

      {scenes.map((scene) => {
        const opacity = getOpacity(progress, scene.range[0], scene.range[1]) * (1 - hotspotOpacity);
        const translate = (1 - opacity) * 28;

        return (
          <article
            className="storyPanel"
            key={scene.eyebrow}
            style={{
              opacity,
              transform: `translate3d(0, ${translate}px, 0)`,
              pointerEvents: opacity > 0.2 ? "auto" : "none",
            }}
          >
            <p>{scene.eyebrow}</p>
            <h2>{scene.title}</h2>
            <span>{scene.body}</span>
          </article>
        );
      })}
    </div>
  );
}
