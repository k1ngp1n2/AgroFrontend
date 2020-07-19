# Ferma Store App

## Параметры запуска

1. Скачать этот репозиторий (зеленая кнопка Clone or download и там ссылка Download zip)
1. Разархивировать в отдельную папку
1. Установить Node.js (версия 12.xx.x LTS) с сайта `https://nodejs.org`
1. Запустить Windows Start -> Node.js -> Node.js command prompt
1. Ввести  
   `cd c:\путь_к_разархивированной_папке`
1. Ввести  
   `npm install`  
   и дождаться окончания установки
1. Запустить сервер для разработки:  
   `npm run dev`  
   и сайт откроется в окне браузера

### Для разработчиков

1. Подготовка файлов для публикации на сервере:  
   `npm run build`
1. Создание шаблона нового компонента в папке `src\components`:  
   `npm run cc имя_нового_компонента`

## Локальные серверы

Локальный сервер сайта доступен по адресу `localhost:8080`.
Адрес сервера бэкенда указывается в файле `ServerAddress.js`.

## Sources

- В папке `src` находится файл index.jsx.
- В папке `mocks` находятся файлы для эмуляции работы сервера.
- В папке `src/img` находятся файлы изображений.
- В папке `src/pages` находятся исходные файлы шаблонов страниц на JSX.
- В папке `src/components` находятся исходные файлы компонентов на JSX.
- В папке `src/constants` находятся файлы констант.
- В папке `src/helpers` находятся файлы вспомогательных функций.

## Параметры работы webpack

Выполняется проверка кода в es lint (js и jsx), sass lint.  
Осуществляется транспиляция в babel 7.  
Код из sass преобразуется в css.  
Для CSS автоматически добавляются префиксы.  
CSS файлы оптимизируются и минифицируются.  
Для исходников создаются карты, облегчающие отладку.  
Созданный проект записывается в папку `dist`.  
Изображения при построении проекта не изменяются.
