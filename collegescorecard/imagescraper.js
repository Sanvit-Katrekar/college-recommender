// Web Scrapping using Node js and Cheerio Request

const axios = require("axios");
const cheerio = require("cheerio");

const getImages = async (base) => {
  
  const images = [];
  let count = 0;
  const resp = await axios.get(base);
  if (resp.status == 200) {
    const $ = cheerio.load(resp.data);

    $("img").each( (index, image) => {
      if (count >= 3) {
        return false;
      }
      var img = $(image).attr("src");
      let link = img;
      if (link) {
        if (link.includes(".jpg") || link.endsWith(".svg")) {
          if (!link.startsWith("http")) {
            link = base + link;
          }
          images.push(link);
          count += 1
        }
      }
    });

  }
  else {
    console.log("Error fetching images");
  }
  return images;
}

module.exports = { getImages }