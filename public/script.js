console.log("Hello");

const { axios } = window
const handlebars = window.Handlebars

const output = document.getElementById("recommendations-output")
/* add college website in anchor tag*/
const templateRaw = `

<h2> Top colleges recommended for you! </h2>
<ol>
    {{#each topFiveRecs}}
    <li> <strong> {{latest.school.name}} </strong> - <a href="//{{latest.school.school_url}}"> {{latest.school.school_url}} </a> </li>
    <img src={{images.[0]}} width="400" height="300">
    <img src={{images.[1]}} width="400" height="300">
    <img src={{images.[2]}} width="400" height="300">
    {{/each}}

</ol>`


const button = document.getElementById("submitButton")

const submitForm = async (event) => {
  try {
    event.preventDefault();
    console.log(event);

    disableButton()
    
    const { elements } = event.target
    const city = elements.city.value
    const fees = elements.fees.value
    const admissionrate = elements.admissionrate.value
    const testrequirements = elements.testrequirements.value

    console.log(`The city is ${city}`);
    console.log(`The fees is ${fees}`);
    
    let result;

    try {
      result = await axios.post('/recommendations', { city, fees, admissionrate, testrequirements })
    }
    catch (err) {
      let errMsg = err.response.data.message ? err.response.data.message : "Something went wrong.."
      return alert(err.message)
    }
    const n = 5
    const recommendations = result.data.results
    const topFiveRecs = recommendations.slice(0, n)
    /*
    const recommendations = result.data.tracks
    const topFiveRecs = recommendations.slice(0, 5)
    */
    const template = handlebars.compile(templateRaw)

    const html = template({ topFiveRecs })

    output.innerHTML = html
    
  }
  catch (err) {
    console.error(err)
  }
  finally {
    enableButton()
  }
  
};

const enableButton = () => {
  button.disabled = false
  button.value = "Get recommendations"
}
const disableButton = () => {
  button.disabled = true
  button.value = "Loading..."
}
