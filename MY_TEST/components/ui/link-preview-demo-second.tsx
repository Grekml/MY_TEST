"use client";

import React from "react";
import { LinkPreview } from "./link-preview";

export function LinkPreviewDemoSecond() {
  return (
    <section id="link-preview-demo-second" className="relative py-16 bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black">
      <div className="container mx-auto px-4 max-w-5xl">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Командная благодарность</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Наша команда выражает искреннюю признательность за качественную работу, высокий профессионализм и охват знаний, которыми мы делимся друг с другом.
          Это не только результат индивидуальных усилий, но и синергия, которая поднимает нас выше.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <LinkPreview
            href="#"
            title="Первая демонстрация"
            description="Положительный пример превью проекта после завершения задачи"
            previews={[
              { src: "/screenshots/team-feedback-1.jpg", alt: "feedback 1", caption: "Согласование" },
              { src: "/screenshots/team-feedback-2.jpg", alt: "feedback 2", caption: "Качество" },
              { src: "/screenshots/team-feedback-3.jpg", alt: "feedback 3", caption: "Обмен опытом" },
            ]}
          />
          <LinkPreview
            href="#"
            title="Вдохновение и рост"
            description="Показатели эффективности и стремление к экспериментам"
            previews={[
              { src: "/screenshots/team-feedback-2.jpg", alt: "feedback 2", caption: "Рост" },
              { src: "/screenshots/team-feedback-1.jpg", alt: "feedback 1", caption: "Идеи" },
              { src: "/screenshots/team-feedback-3.jpg", alt: "feedback 3", caption: "Сотрудничество" },
            ]}
          />
          <LinkPreview
            href="#"
            title="Обмен знаниями"
            description="Поддержка коллег и совместное решение задач"
            previews={[
              { src: "/screenshots/team-feedback-3.jpg", alt: "feedback 3", caption: "Помощь" },
              { src: "/screenshots/team-feedback-1.jpg", alt: "feedback 1", caption: "Мастерство" },
              { src: "/screenshots/team-feedback-2.jpg", alt: "feedback 2", caption: "Обучение" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

export default LinkPreviewDemoSecond;
