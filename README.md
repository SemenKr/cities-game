# Игра в города на время

Frontend pet-project на `React` и `TypeScript`: игра в классические "Города" против компьютера с таймером, уровнями сложности, подсказками и сохранением статистики.

[Live demo](https://semenkr.github.io/cities-game/) · [Repository](https://github.com/SemenKr/cities-game)

## Скриншоты

<p align="center">
  <img src="./docs/screenshots/start-screen.png" alt="Стартовый экран игры" width="720" />
</p>

<p align="center">
  <img src="./docs/screenshots/mobile-start-screen.png" alt="Мобильная версия стартового экрана" width="280" />
</p>

## Что есть в проекте

- игра против компьютера с проверкой правил, повторов и последней буквы;
- выбор длительности хода и сложности перед стартом;
- умный ход компьютера: `easy`, `medium`, `hard`;
- подсказки по доступным городам;
- финальный экран с причиной завершения партии;
- накопительная статистика в `localStorage`;
- адаптивный интерфейс для desktop и mobile;
- unit- и scenario-тесты на ключевые игровые сценарии.

## Почему проект хорошо смотрится в портфолио

- Доменные правила вынесены из UI в [cityRules.ts](./src/lib/cityRules.ts) и [gameStats.ts](./src/lib/gameStats.ts).
- Игровой поток покрыт тестами: выбор хода ИИ, таймаут игрока, победа при отсутствии ответа у компьютера, обновление статистики.
- Production-сборка разбита на чанки, а экраны загружаются через lazy loading.

## Стек

`React 18` · `TypeScript` · `Vite` · `Ant Design` · `SCSS Modules` · `Vitest` · `Testing Library`

## Запуск

```bash
npm install
npm run dev
```

## Полезные команды

```bash
npm run build
npm run lint
npm test
npm run preview
npm run deploy
```

## Что можно развить дальше

- расширить базу городов;
- добавить новые режимы игры;
- заменить SVG social preview на реальный PNG/OG image;
- доснять отдельные скриншоты геймплея и финального экрана.
