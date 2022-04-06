const express = require("express");
const { getRecommendations } = require("./collegescorecard/actions")
const axios = require("axios")

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/postmen.html");
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/public/index2.html");
});

app.post("/recommendations", async (req, res) => {
  
  if (!req.body) {
    return res.status(400).send({ message: "Bad request! Must provide a body" })
  }
  const { city, fees, admissionrate, testrequirements } = req.body
  
  
  try {
    const recommendations = await getRecommendations(axios, { city, fees, admissionrate, testrequirements })
    if (!recommendations.metadata.total) {
      return res.status(404).send({ message: "No recommendations found!" })
    }
    return res.send(recommendations)
  }
  catch (err) {
    console.error(err.message)
    return res.status(404).send({ message: "No recommendations found!" })
  }

});
console.log("Hello from the server!");

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}! Wow!`);
});