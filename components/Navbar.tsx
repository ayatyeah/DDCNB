"use client";

import { MouseEvent } from "react";

const scrollToTarget = (target: "top" | string) => {
  if (target === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const element = document.querySelector(target);
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const handleSamePageScroll =
  (target: "top" | string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname !== "/") return;

    event.preventDefault();
    scrollToTarget(target);
  };

export function Navbar() {
  return (
    <header className="siteNav">
      <a className="brandMark" href="/" aria-label="DDC главная" onClick={handleSamePageScroll("top")}>
        <span>DDC</span>
        <small>Digital Development Center</small>
      </a>

      <nav className="navLinks" aria-label="Основная навигация">
        <a href="/" onClick={handleSamePageScroll("top")}>Главная</a>
        <a href="/#services" onClick={handleSamePageScroll("#services")}>Услуги</a>
        <a href="/#about" onClick={handleSamePageScroll("#about")}>О центре</a>
      </nav>
    </header>
  );
}
