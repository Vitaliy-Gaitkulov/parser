# Project Summary / Краткое содержание проекта

## 🎯 What is this project? / Что это за проект?

**[RU]** Это Node.js приложение для автоматизированного парсинга (извлечения данных) с веб-сайта https://www.tus.si. Программа автоматически скачивает PDF каталоги и сохраняет информацию о них в формате JSON.

**[EN]** This is a Node.js application for automated web scraping from the website https://www.tus.si. The program automatically downloads PDF catalogs and saves information about them in JSON format.

---

## 📊 Quick Facts / Быстрые факты

| Aspect / Аспект | Details / Детали |
|-----------------|------------------|
| **Language / Язык** | JavaScript (Node.js ES Modules) |
| **Type / Тип** | Web Scraper / Parser |
| **Main Dependencies / Основные зависимости** | axios, cheerio |
| **Entry Point / Точка входа** | index.js |
| **Lines of Code / Строк кода** | ~90 lines / строк |
| **Author / Автор** | Vitaliy Haitkulov |

---

## 📁 Project Structure / Структура проекта

```
parser/
├── 📄 index.js                    - Main entry point / Основной файл
├── 📄 services.js                 - Core functions / Основные функции
├── 📦 package.json                - Dependencies / Зависимости
├── 📖 README.md                   - Quick start guide (RU+EN)
├── 📖 PROJECT_ANALYSIS.md         - Full analysis (RU)
├── 📖 PROJECT_ANALYSIS_EN.md      - Full analysis (EN)
├── 📖 ARCHITECTURE.md             - Technical architecture (RU+EN)
└── 📖 SUMMARY.md                  - This file / Этот файл
```

---

## 🔧 How it works / Как это работает

### Simple Flow / Простой поток:
```
1. Fetch webpage HTML / Загрузить HTML страницы
        ↓
2. Parse and extract catalog data / Парсить и извлечь данные каталогов
        ↓
3. Download all PDF files / Скачать все PDF файлы
        ↓
4. Save metadata to JSON / Сохранить метаданные в JSON
```

### Technical Flow / Технический поток:
```javascript
// 1. Extract catalog information
const catalogs = await fetchCatalogs(url);
// Result: Array of {title, link, timeStart, timeEnd, savePDF}

// 2. Download PDF files in parallel
await downloadPDF(catalogs);
// Result: Files saved in downloads/ folder

// 3. Save metadata
await saveJSON(catalogs);
// Result: catalogs/catalogs.json created
```

---

## 🚀 Quick Start / Быстрый старт

```bash
# Install / Установка
npm install

# Run / Запуск
npm run start
```

---

## 📦 What gets created / Что создается

### After running the script / После запуска скрипта:

1. **downloads/** folder / папка:
   - Contains all downloaded PDF catalogs
   - Содержит все скачанные PDF каталоги
   - Example: `catalog-2024-spring.pdf`

2. **catalogs/catalogs.json** file / файл:
   - Contains metadata about all catalogs
   - Содержит метаданные о всех каталогах
   - Format: JSON array of catalog objects
   - Формат: JSON массив объектов каталогов

### Example JSON output / Пример JSON выхода:
```json
[
  {
    "title": "Spring Catalog 2024",
    "link": "https://www.tus.si/catalog-spring",
    "timeStart": "2024-03-01",
    "timeEnd": "2024-05-31",
    "savePDF": "https://www.tus.si/files/spring-2024.pdf"
  }
]
```

---

## 🛠 Technologies / Технологии

### Core / Основные:
- **Node.js** - Runtime environment / Среда выполнения
- **ES Modules** - Modern JavaScript modules / Современные JS модули

### Libraries / Библиотеки:
- **axios** (v1.7.2) - HTTP client for web requests / HTTP клиент для веб-запросов
- **cheerio** (v1.0.0-rc.12) - HTML parser (jQuery-like) / HTML парсер (подобен jQuery)
- **fs** (built-in) - File system operations / Операции файловой системы

---

## 💡 Key Features / Ключевые особенности

### ✅ Advantages / Преимущества:

1. **Automatic / Автоматический**
   - No manual downloading / Нет ручной загрузки
   - Single command execution / Выполнение одной командой

2. **Parallel Downloads / Параллельные загрузки**
   - All PDFs downloaded simultaneously / Все PDF скачиваются одновременно
   - Fast execution / Быстрое выполнение

3. **Structured Data / Структурированные данные**
   - JSON metadata for easy processing / JSON метаданные для легкой обработки
   - Machine-readable format / Машиночитаемый формат

4. **Error Resilient / Устойчивый к ошибкам**
   - Individual failures don't stop the process / Отдельные ошибки не останавливают процесс
   - Error logging / Логирование ошибок

---

## 📖 Documentation Guide / Руководство по документации

### Which document to read? / Какой документ читать?

| Document | Best For / Подходит для |
|----------|------------------------|
| **README.md** | Quick start, installation / Быстрый старт, установка |
| **SUMMARY.md** | Overview, high-level understanding / Обзор, общее понимание |
| **PROJECT_ANALYSIS.md** | Detailed analysis (Russian) / Детальный анализ (Русский) |
| **PROJECT_ANALYSIS_EN.md** | Detailed analysis (English) / Детальный анализ (Английский) |
| **ARCHITECTURE.md** | Technical details, diagrams / Технические детали, диаграммы |

---

## 🎓 Use Cases / Случаи использования

### This project is useful for / Этот проект полезен для:

1. **Data Collection / Сбор данных**
   - Archiving catalogs / Архивирование каталогов
   - Market research / Исследование рынка
   - Price monitoring / Мониторинг цен

2. **Learning / Обучение**
   - Web scraping techniques / Техники веб-скрапинга
   - Async JavaScript patterns / Паттерны асинхронного JavaScript
   - File system operations / Операции с файловой системой

3. **Automation / Автоматизация**
   - Scheduled data collection / Запланированный сбор данных
   - Batch processing / Пакетная обработка
   - Integration with other systems / Интеграция с другими системами

---

## 🔍 Code Quality / Качество кода

### Metrics / Метрики:

- **Modularity / Модульность**: ⭐⭐⭐⭐⭐ (5/5)
  - Clean separation of concerns / Четкое разделение ответственности
  
- **Readability / Читаемость**: ⭐⭐⭐⭐⭐ (5/5)
  - Clear function names / Понятные имена функций
  - Simple logic flow / Простой поток логики

- **Error Handling / Обработка ошибок**: ⭐⭐⭐⭐ (4/5)
  - Try/catch blocks present / Присутствуют блоки try/catch
  - Could add retry logic / Можно добавить логику повторов

- **Performance / Производительность**: ⭐⭐⭐⭐ (4/5)
  - Parallel downloads / Параллельные загрузки
  - Could add rate limiting / Можно добавить ограничение скорости

---

## 🚧 Future Improvements / Будущие улучшения

### Recommended / Рекомендуется:

1. ✨ Add CLI arguments for custom URLs
   - Добавить аргументы CLI для пользовательских URL

2. 🔄 Implement retry logic for failed downloads
   - Реализовать логику повторов для неудачных загрузок

3. 📊 Add progress bars and better console output
   - Добавить прогресс-бары и улучшенный консольный вывод

4. 🧪 Create unit and integration tests
   - Создать юнит и интеграционные тесты

5. 🔒 Fix security vulnerabilities in dependencies
   - Исправить уязвимости безопасности в зависимостях

---

## 📞 Contact / Контакты

**Author / Автор:** Vitaliy Haitkulov  
**GitHub:** [@Vitaliy-Gaitkulov](https://github.com/Vitaliy-Gaitkulov)  
**Repository / Репозиторий:** [parser](https://github.com/Vitaliy-Gaitkulov/parser)

---

## 📝 License / Лицензия

**ISC License**

---

**Last Updated / Последнее обновление:** October 16, 2025  
**Version / Версия:** 1.0.0
