# Parser Project Analysis

## Project Overview

This is a Node.js application for parsing (extracting) catalogs from the website **https://www.tus.si**. The project automatically downloads catalog PDF files and saves their metadata in JSON format.

## Project Structure

```
parser/
├── .git/                   # Git repository
├── .gitignore             # Git ignored files
├── README.md              # Main documentation (Russian)
├── PROJECT_ANALYSIS.md    # Detailed analysis (Russian)
├── PROJECT_ANALYSIS_EN.md # This file - detailed analysis (English)
├── package.json           # Project configuration and dependencies
├── package-lock.json      # Locked dependency versions
├── index.js               # Main application file (entry point)
├── services.js            # Module with core functions
├── downloads/             # Folder for downloaded PDFs (auto-created)
└── catalogs/              # Folder for JSON metadata files (auto-created)
```

## Core Components

### 1. **index.js** - Application Entry Point

The main file that initiates the parsing process:

```javascript
import { fetchCatalogs, downloadPDF, saveJSON } from "./services.js";
const url = "https://www.tus.si/#s2";

(async function main() {
  const catalogs = await fetchCatalogs(url);  // Fetch catalog list
  await downloadPDF(catalogs);                 // Download PDF files
  await saveJSON(catalogs);                    // Save metadata to JSON
})();
```

**Functionality:**
- Defines the target URL for parsing
- Sequentially calls three main functions:
  1. Extract catalog information
  2. Download PDF files
  3. Save metadata

### 2. **services.js** - Core Functions Module

Contains three key functions:

#### 2.1. `getHTML(url)`
- Helper function to fetch HTML content from a page
- Uses **axios** library for HTTP requests
- Returns a **cheerio** object for HTML parsing

#### 2.2. `fetchCatalogs(url)`
- **Purpose**: Extracts catalog information from a webpage
- **Process**:
  1. Loads page HTML
  2. Searches for catalog list items using selector `#s2 > div > ul li`
  3. For each catalog, extracts:
     - `title` - catalog name
     - `link` - link to catalog page
     - `timeStart` - catalog validity start date
     - `timeEnd` - catalog validity end date
     - `savePDF` - link to catalog PDF file
- **Returns**: Array of objects with catalog information
- **Error Handling**: Logs errors to console

#### 2.3. `downloadPDF(catalogs)`
- **Purpose**: Downloads catalog PDF files
- **Process**:
  1. Processes all catalogs in parallel (Promise.all)
  2. For each catalog:
     - Extracts filename from URL
     - Downloads PDF as binary data
     - Creates `downloads/` folder if it doesn't exist
     - Saves file to `downloads/`
     - Outputs success message
- **Error Handling**: Logs download errors for individual files

#### 2.4. `saveJSON(catalogs)`
- **Purpose**: Saves catalog metadata to a JSON file
- **Process**:
  1. Converts catalog array to formatted JSON
  2. Creates `catalogs/` folder if it doesn't exist
  3. Saves to `catalogs/catalogs.json` file
  4. Outputs success message
- **Error Handling**: Logs save errors

## Technologies and Libraries Used

### 3.1. **Node.js with ES Modules**
- Project uses modern ES module syntax (`type: "module"` in package.json)
- Imports via `import` instead of `require`

### 3.2. **Dependencies (package.json)**

1. **axios (v1.7.2)**
   - Library for making HTTP requests
   - Used for:
     - Loading HTML pages
     - Downloading PDF files

2. **cheerio (v1.0.0-rc.12)**
   - Fast and flexible HTML parsing library
   - Implements jQuery-like syntax for DOM manipulation
   - Used for extracting data from HTML

3. **fs (built-in Node.js module)**
   - File system operations
   - Creating directories
   - Saving files

## Application Workflow

```
1. Start application (npm run start)
           ↓
2. Load HTML from https://www.tus.si/#s2
           ↓
3. Parse HTML and extract catalog information
           ↓
4. Parallel download of all PDF files to downloads/ folder
           ↓
5. Save metadata to catalogs/catalogs.json
           ↓
6. Complete execution
```

## Data Structure

### Catalog Object:
```javascript
{
  "title": "Catalog Name",
  "link": "https://www.tus.si/catalog-path",
  "timeStart": "2024-01-01",
  "timeEnd": "2024-12-31",
  "savePDF": "https://www.tus.si/path-to-pdf-file.pdf"
}
```

## Installation and Running

### Install Dependencies:
```bash
npm install
```

### Run Application:
```bash
npm run start
```

### Results:
- **downloads/** - folder with downloaded PDF catalogs
- **catalogs/catalogs.json** - file with information about all catalogs

## Implementation Features

### Advantages:
1. **Modular Structure** - logic separated into distinct functions
2. **ES Modules** - modern JavaScript syntax
3. **Asynchronous** - uses async/await for readable code
4. **Parallel Downloads** - PDF files downloaded simultaneously
5. **Error Handling** - try/catch blocks in critical functions
6. **Auto Directory Creation** - checks and creates folders automatically

### Potential Improvements:
1. **Logging** - add more detailed logging
2. **Configuration** - extract URLs and paths to config file
3. **Data Validation** - verify received data before saving
4. **Retry Logic** - implement retry for failed downloads
5. **Tests** - add unit and integration tests
6. **CLI Interface** - add command-line arguments

## Project Type

**Web Scraper / Parser** - specialized application for automated data extraction from websites.

## Purpose

Automates the process of:
- Collecting information about product/service catalogs from tus.si website
- Downloading PDF versions of catalogs
- Archiving metadata for future use

## Author

**Vitaliy Haitkulov**
- GitHub: https://github.com/Vitaliy-Gaitkulov/parser

## Technical Notes

### Security Considerations:
- The project currently has 2 npm vulnerabilities (1 high, 1 critical)
- Run `npm audit fix` to address security issues

### Dependencies:
- 24 packages total
- 14 packages are looking for funding
- Uses stable versions of axios and cheerio

### File System:
- Automatically creates required directories (`downloads/`, `catalogs/`)
- Binary file handling for PDF downloads
- JSON formatting with 2-space indentation
