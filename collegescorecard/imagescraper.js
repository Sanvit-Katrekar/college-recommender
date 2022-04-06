// Web Scrapping using Node js and Cheerio Request

// Asynchronous javscxript with call back - Trial 1

//const cheerio = require("cheerio");
// const request = require("request");

// //var images = []
// const getImages = async (base) => {
//   const images = [];
//   await request(base, (err, resp, html) => {
//     if (!err && resp.statusCode == 200) {
//       console.log("Request successful!");

//       // Defining Cheerio or $ Object
//       const $ = cheerio.load(html);
//       let link;

//       $("img").each((index, image) => {
//         var img = $(image).attr("src");
//         link = img;
//         if (link) {
//           if (link.endsWith(".jpg") || link.endsWith(".svg")) {
//             if (!link.startsWith("http")) {
//               link = base + link;
//             }
//             images.push(link);
//           }
//         }
//       });
//     } else {
//       console.log("Request failed!");
//     }
//     console.log("Image: ");
//     console.log(images.slice(0, 5));
//     console.log("^ Seems to work till here ^");
//   });
//   console.log("Array fluctuates out of existence here ->")
//   console.log(images);
//   console.log("...");
//   return images
//   // return ["https://ihsdubai.org/wp-content/uploads/2021/02/60@50-logo-308x400.png"]
// };

// module.exports = { getImages };


/*
// Trial 2
const cheerio = require("cheerio");
const request = require("request-promise");

//var images = []
const getImages = async (base) => {
  const images = [];
  const resp = await request(base);

  if (resp.statusCode == 200) {
    console.log("Request successful!");

    const $ = cheerio.load(resp.body());
    let link;

    // Defining Cheerio or $ Object
    $("img").each((index, image) => {
      var img = $(image).attr("src");
      link = img;
      if (link) {
        if (link.endsWith(".jpg") || link.endsWith(".svg")) {
          if (!link.startsWith("http")) {
            link = base + link;
          }
          images.push(link);
        }
      }
    });
  } else {
    console.log("Request failed!");
  }

  console.log("Image: ");
  console.log(images.slice(0, 5));
  console.log("^ Seems to work till here ^");
  console.log("Array fluctuates out of existence here ->")
  console.log(images);
  console.log("...");
  return images
};

module.exports = { getImages };
*/



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
        if (link.endsWith(".jpg") || link.endsWith(".svg")) {
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