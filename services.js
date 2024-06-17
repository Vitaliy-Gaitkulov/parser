import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const getHTML = async (url) => {
  const { data } = await axios.get(url);
  
  return cheerio.load(data);
};

export const fetchCatalogs = async (url) => {
  try {
    const $ = await getHTML(url);
    const catalogs = [];

    $("#s2 > div > ul")
      .find("li")
      .each(function (index, element) {
        const title = $(element).find("div > div.hover > h3 > a").text();
        const link = $(element).find("div > div.hover > h3 > a").attr("href");
        const timeStart = $(element)
          .find("div > p > time:nth-child(1)")
          .attr("datetime");
        const timeEnd = $(element)
          .find("div > p > time:nth-child(2)")
          .attr("datetime");
        const savePDF = $(element)
          .find("div > div.hover > figure > figcaption > a.link-icon.solid.pdf")
          .attr("href");

        catalogs.push({ title, link, timeStart, timeEnd, savePDF });
      });

    return catalogs;
  } catch (error) {
    console.error("Error fetching the catalogs:", error);
  }
};

export const downloadPDF = async (catalogs) => {
  await Promise.all(
    catalogs.map(async (item, index) => {
      try {
        const { title, savePDF } = item;
        const nameCatalog =
          savePDF.match(/\/([^\/]+\.pdf)$/)[1] || `catalog${index}`;
        const { data: body } = await axios({
          method: "get",
          url: savePDF,
          responseType: "arraybuffer",
        });
        const dir = "./downloads";

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }

        fs.writeFileSync(`./downloads/${nameCatalog}`, body, "binary");
        console.log(`PDF file ${title} download!`);
      } catch (error) {
        console.error("Error download PDF file!", error);
      }
    })
  );
};

export const saveJSON = async (catalogs) => {
  try {
    const json = JSON.stringify(catalogs, null, 2);
    const dir = "./catalogs";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.writeFileSync("./catalogs/catalogs.json", json);
    console.log("Information saved in file catalogs.json");
  } catch (error) {
    console.error("Error save JSON file!", error);
  }
};
