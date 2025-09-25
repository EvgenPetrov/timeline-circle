# Исторические даты — Timeline Block (React + TS + Webpack)

Интерактивный блок с временными отрезками и слайдером событий для активного отрезка.  
Изолирован: можно рендерить несколько инстансов на странице. Стили — CSS Modules.  
Слайдер — Swiper. Анимации — gsap. Стили — SCSS. Сборка — Webpack 5.

## Скрипты

- `npm run dev` — локальная разработка (http://localhost:5173)
- `npm run build` — продакшен-сборка в `dist/`

## Структура данных

См. `src/data/timelineData.ts`. Каждый сегмент:

```ts
type TimelineSegment = {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  events: { year: number; title: string; text: string }[];
};
```
