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

## Performance

- экраны загружаются через lazy loading;
- production-сборка разбита на отдельные чанки для `react`, `antd`, `rc-*` и иконок;
- доменная логика вынесена в [cityRules.ts](./src/lib/cityRules.ts) и [gameStats.ts](./src/lib/gameStats.ts), что упрощает поддержку и тестирование.

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
