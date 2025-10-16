# Architecture Documentation / Архитектурная документация

## System Architecture / Системная архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                         Parser Application                       │
│                        (Node.js + ES Modules)                    │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   │
                    ┌──────────────┴──────────────┐
                    │                              │
         ┌──────────▼──────────┐      ┌───────────▼──────────┐
         │     index.js        │      │    services.js       │
         │  (Entry Point)      │      │  (Core Functions)    │
         │                     │      │                      │
         │  • Orchestrates     │      │  • fetchCatalogs()   │
         │    workflow         │◄─────┤  • downloadPDF()     │
         │  • Calls services   │      │  • saveJSON()        │
         │  • Main function    │      │  • getHTML()         │
         └─────────────────────┘      └──────────────────────┘
                    │                            │
                    │                            │
                    └────────────┬───────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │    External Dependencies   │
                    └────────────────────────────┘
                                 │
          ┏━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━┓
          ┃                                             ┃
    ┌─────▼─────┐         ┌─────────▼─────────┐  ┌────▼────┐
    │   axios   │         │     cheerio       │  │   fs    │
    │ (v1.7.2)  │         │  (v1.0.0-rc.12)   │  │(built-in)│
    │           │         │                   │  │         │
    │ HTTP      │         │ HTML Parser       │  │ File    │
    │ Client    │         │ jQuery-like API   │  │ System  │
    └─────┬─────┘         └─────────┬─────────┘  └────┬────┘
          │                         │                  │
          │                         │                  │
    ┌─────▼─────┐         ┌─────────▼─────────┐  ┌────▼────┐
    │  Web      │         │  HTML DOM         │  │  Local  │
    │  Server   │         │  Manipulation     │  │  Files  │
    │           │         │                   │  │         │
    │ tus.si    │         │  Extract data     │  │ • PDFs  │
    └───────────┘         │  from selectors   │  │ • JSON  │
                          └───────────────────┘  └─────────┘
```

## Data Flow / Поток данных

```
┌────────────────────────────────────────────────────────────────┐
│ 1. START: npm run start                                        │
└────────┬───────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│ 2. fetchCatalogs(url)                                          │
│    ┌───────────────────────────────────────────────────────┐  │
│    │ • GET https://www.tus.si/#s2                          │  │
│    │ • Parse HTML with cheerio                             │  │
│    │ • Extract: title, link, timeStart, timeEnd, savePDF   │  │
│    └───────────────────────────────────────────────────────┘  │
└────────┬───────────────────────────────────────────────────────┘
         │
         ▼  catalogs[] array
         │
┌────────▼───────────────────────────────────────────────────────┐
│ 3. downloadPDF(catalogs)                                       │
│    ┌───────────────────────────────────────────────────────┐  │
│    │ Promise.all([                                         │  │
│    │   • GET PDF URL (binary)                              │  │
│    │   • Extract filename from URL                         │  │
│    │   • Create downloads/ directory                       │  │
│    │   • Save to downloads/{filename}.pdf                  │  │
│    │ ]) // Parallel execution                              │  │
│    └───────────────────────────────────────────────────────┘  │
└────────┬───────────────────────────────────────────────────────┘
         │
         ▼  catalogs[] array
         │
┌────────▼───────────────────────────────────────────────────────┐
│ 4. saveJSON(catalogs)                                          │
│    ┌───────────────────────────────────────────────────────┐  │
│    │ • Convert array to JSON                               │  │
│    │ • Create catalogs/ directory                          │  │
│    │ • Save to catalogs/catalogs.json                      │  │
│    └───────────────────────────────────────────────────────┘  │
└────────┬───────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│ 5. END: Process complete                                       │
│    Results:                                                    │
│    • downloads/*.pdf (multiple PDF files)                      │
│    • catalogs/catalogs.json (metadata)                         │
└────────────────────────────────────────────────────────────────┘
```

## Component Details / Детали компонентов

### 1. Entry Point: index.js

**Responsibility / Ответственность:**
- Application initialization / Инициализация приложения
- Workflow orchestration / Оркестрация рабочего процесса
- Sequential function calls / Последовательные вызовы функций

**Dependencies / Зависимости:**
- services.js (fetchCatalogs, downloadPDF, saveJSON)

**Exports / Экспорты:**
- None (self-executing) / Нет (самовыполняющийся)

---

### 2. Core Module: services.js

#### 2.1 Function: `getHTML(url)`

**Type / Тип:** Helper function / Вспомогательная функция

**Input / Вход:**
- `url` (string): URL to fetch / URL для загрузки

**Output / Выход:**
- Cheerio object / Объект Cheerio

**Process / Процесс:**
```javascript
axios.get(url) → HTML string → cheerio.load() → $ (Cheerio object)
```

---

#### 2.2 Function: `fetchCatalogs(url)`

**Type / Тип:** Async function / Асинхронная функция

**Input / Вход:**
- `url` (string): Page URL / URL страницы

**Output / Выход:**
- `catalogs[]` (Array): List of catalog objects / Список объектов каталогов

**CSS Selectors Used / Используемые CSS селекторы:**
```css
#s2 > div > ul li                                    /* List items */
div > div.hover > h3 > a                            /* Title & Link */
div > p > time:nth-child(1)                         /* Start date */
div > p > time:nth-child(2)                         /* End date */
div > div.hover > figure > figcaption > a.link-icon.solid.pdf  /* PDF link */
```

**Error Handling / Обработка ошибок:**
- Try/catch with console.error

---

#### 2.3 Function: `downloadPDF(catalogs)`

**Type / Тип:** Async function / Асинхронная функция

**Input / Вход:**
- `catalogs[]` (Array): Catalog objects / Объекты каталогов

**Output / Выход:**
- void (side effect: files saved) / void (побочный эффект: файлы сохранены)

**Process / Процесс:**
```javascript
Promise.all(
  catalogs.map(async (item) => {
    axios.get(PDF_URL, { responseType: 'arraybuffer' })
    → Binary data
    → fs.writeFileSync()
    → Save to downloads/
  })
)
```

**Parallelism / Параллелизм:**
- All PDFs downloaded simultaneously / Все PDF загружаются одновременно
- Uses Promise.all() for parallel execution / Использует Promise.all() для параллельного выполнения

**Error Handling / Обработка ошибок:**
- Try/catch per file (doesn't stop on individual errors)
- Try/catch для каждого файла (не останавливается при отдельных ошибках)

---

#### 2.4 Function: `saveJSON(catalogs)`

**Type / Тип:** Async function / Асинхронная функция

**Input / Вход:**
- `catalogs[]` (Array): Catalog objects / Объекты каталогов

**Output / Выход:**
- void (side effect: JSON file saved) / void (побочный эффект: JSON файл сохранен)

**Process / Процесс:**
```javascript
catalogs[] → JSON.stringify(catalogs, null, 2) → fs.writeFileSync() → Save to catalogs/
```

**JSON Formatting / Форматирование JSON:**
- Pretty-printed with 2-space indentation
- Красиво отформатирован с 2-пробельным отступом

---

## Directory Structure / Структура директорий

```
parser/
│
├── Source Files / Исходные файлы
│   ├── index.js              # Entry point / Точка входа
│   └── services.js           # Core logic / Основная логика
│
├── Configuration / Конфигурация
│   ├── package.json          # Dependencies & scripts
│   ├── package-lock.json     # Locked versions
│   └── .gitignore            # Ignored files
│
├── Documentation / Документация
│   ├── README.md             # Quick start (RU+EN)
│   ├── PROJECT_ANALYSIS.md   # Full analysis (RU)
│   ├── PROJECT_ANALYSIS_EN.md# Full analysis (EN)
│   └── ARCHITECTURE.md       # This file (RU+EN)
│
└── Generated (runtime) / Генерируемые (во время выполнения)
    ├── downloads/            # PDF files
    │   └── *.pdf
    ├── catalogs/             # Metadata
    │   └── catalogs.json
    └── node_modules/         # Dependencies
```

## Design Patterns / Паттерны проектирования

### 1. Module Pattern / Модульный паттерн
- ES6 modules with import/export
- Separation of concerns (index.js vs services.js)

### 2. Async/Await Pattern / Паттерн Async/Await
- Modern asynchronous code
- Better error handling and readability

### 3. Parallel Execution / Параллельное выполнение
- Promise.all() for concurrent downloads
- Maximizes performance

### 4. Helper Function Pattern / Паттерн вспомогательных функций
- getHTML() encapsulates common logic
- Reusable across multiple functions

## Performance Considerations / Соображения производительности

### Optimization / Оптимизация:
✅ Parallel PDF downloads (Promise.all)
✅ Single HTTP request for HTML parsing
✅ In-memory processing (no intermediate files)

### Potential Bottlenecks / Потенциальные узкие места:
⚠️ Network bandwidth for large PDFs
⚠️ Memory usage for large file sets
⚠️ No rate limiting (could be blocked by server)

## Error Recovery / Восстановление после ошибок

### Current Implementation / Текущая реализация:
- Individual PDF download failures don't stop the process
- Errors logged to console
- No retry mechanism

### Recommendations / Рекомендации:
1. Add retry logic with exponential backoff
2. Implement request rate limiting
3. Add detailed error logging (file-based)
4. Validate downloaded files

## Security Considerations / Соображения безопасности

### Current State / Текущее состояние:
⚠️ 2 npm vulnerabilities (1 high, 1 critical)
- Run `npm audit fix` to address

### Best Practices / Лучшие практики:
1. Regular dependency updates
2. Input validation for extracted data
3. Sanitize filenames before saving
4. HTTPS verification (axios default)

## Extensibility / Расширяемость

### Easy Extensions / Простые расширения:
- Add more data fields to extract
- Support multiple websites
- Different output formats (CSV, XML)
- Database integration

### Moderate Extensions / Умеренные расширения:
- CLI arguments for configuration
- Scheduling/cron job support
- Email notifications
- Progress bars and better UX

### Complex Extensions / Сложные расширения:
- Distributed scraping
- Proxy rotation
- Browser automation (Puppeteer/Playwright)
- Machine learning for adaptive parsing

## Testing Strategy / Стратегия тестирования

### Recommended Tests / Рекомендуемые тесты:

1. **Unit Tests:**
   - fetchCatalogs() with mock HTML
   - downloadPDF() with mock axios
   - saveJSON() with mock fs

2. **Integration Tests:**
   - Full workflow with test data
   - Error handling scenarios
   - File system operations

3. **E2E Tests:**
   - Real website scraping (with caution)
   - Verify downloaded files
   - Validate JSON output

## Dependencies Graph / Граф зависимостей

```
parser
├── axios@1.7.2
│   ├── follow-redirects@1.15.6
│   ├── form-data@4.0.0
│   │   ├── asynckit@0.4.0
│   │   ├── combined-stream@1.0.8
│   │   └── mime-types@2.1.35
│   └── proxy-from-env@1.1.0
└── cheerio@1.0.0-rc.12
    ├── cheerio-select@2.1.0
    ├── dom-serializer@2.0.0
    ├── domhandler@5.0.3
    ├── domutils@3.1.0
    ├── htmlparser2@8.0.2
    ├── parse5@7.1.2
    └── parse5-htmlparser2-tree-adapter@7.0.0
```

Total: 24 packages

## Maintenance / Поддержка

### Regular Tasks / Регулярные задачи:
- [ ] Update dependencies monthly
- [ ] Run security audits
- [ ] Monitor website structure changes
- [ ] Review error logs
- [ ] Backup downloaded files

### Monitoring / Мониторинг:
- Console output (manual)
- File system (downloads count)
- JSON validation (catalog count)

---

**Last Updated / Последнее обновление:** 2025-10-16
**Version / Версия:** 1.0.0
