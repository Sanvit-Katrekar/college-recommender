const { getImages } = require("./imagescraper")

const baseUrl = "https://api.data.gov/ed/collegescorecard/v1"

const getRecommendations = async (http, { city, fees, admissionrate, testrequirements }) => {
  
  
  let apiRequest = `${baseUrl}/schools?`
  const mappings = {
    city: [city ? "school.city" : "", city],
    fees: [fees ? "cost.tuition.out_of_state" : "", fees],
    testrequirements: [testrequirements ? "admissions.test_requirements" : "", testrequirements]
  }

  Object.entries(mappings).forEach((entry) => {
    const [key, value] = entry;
    apiRequest += `&${value[0]}=${value[1].replace(/, /g, ",")}`
  });
  
  //Adding the api key
  apiRequest += `&api_key=${process.env.API_KEY}`
  console.log(apiRequest);
  
  const config = {
    method: "get",
    url: apiRequest
  };
  
  let result = await http(config).then((response) => response.data)
  
  let collegeUrl
  
  const testreqs = ["Required", "Optional", "Recommended", "Accepted"]
  
  for (let i = 0; i < result.results.length; i++) {
    console.log("College website: >>")
    collegeUrl = `${result.results[i].latest.school.school_url}`
    if (!collegeUrl.startsWith("http")) {
      collegeUrl = 'https://' + collegeUrl
    }
    console.log(collegeUrl)
    var images = await getImages(collegeUrl)
    result.results[i].images = [...images]
    var testreq = result.results[i].latest.admissions.test_requirements
    result.results[i].latest.admissions.test_requirements = testreqs[testreq - 1]
    console.log(result.results[i].images)
  }
  console.log(result)
  return result
};

module.exports = { getRecommendations };
