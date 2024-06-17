import { fetchCatalogs, downloadPDF, saveJSON } from "./services.js";
const url = "https://www.tus.si/#s2";

(async function main() {
  const catalogs = await fetchCatalogs(url);
  await downloadPDF(catalogs);
  await saveJSON(catalogs);
})();
