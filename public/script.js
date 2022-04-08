console.log("Hello");

const { axios } = window
const handlebars = window.Handlebars
const { alertify } = window

const output = document.getElementById("recommendations-output")
/* add college website in anchor tag*/

const templateRaw = `

<h2> Top colleges recommended for you! </h2>
<ol>
    {{#each topFiveRecs}}
    <li> <strong> {{latest.school.name}} </strong> - <a href="//{{latest.school.school_url}}"> {{latest.school.school_url}} </a> </li>
    <ul>
    <li> <b> City: </b> {{latest.school.city}} </li>
    <li> <b> Out of state fees: </b> \${{latest.cost.tuition.out_of_state}} </li>
    <li> <b> Admission test requirement: </b> {{latest.admissions.test_requirements}}
    <li> <b> Admission rate overall: </b> {{latest.admissions.admission_rate.overall}}
    <li> <b> Student size: </b> {{latest.student.size}}
    </ul
    <img src={{images.[0]}} width="400" height="300">
    <img src={{images.[1]}} width="400" height="300">
    <img src={{images.[2]}} width="400" height="300">
    {{/each}}

</ol>
`

const templateNoResults = `
<br>
<h2 style="text-align:center"> No results found! </h2>
`


const button = document.getElementById("submitButton")

const submitForm = async (event) => {
  try {
    event.preventDefault();
    console.log(event);

    disableButton()
    
    const { elements } = event.target
    const city = elements.city.value
    const fees = elements.fees.value
    
    let testrequirements = ''
    let checkboxlist = ["colreq", "colopt", "colrec", "colacc"]
    for (let i=0; i < checkboxlist.length; i++) {
      var checkboxobj = document.getElementById(checkboxlist[i])
      if (checkboxobj.checked) {
        testrequirements += (i + 1) + ','
      }
    }
    
    console.log(testrequirements)
    
    let result;
    let template;
    let html;

    try {
      result = await axios.post('/recommendations', { city, fees, testrequirements })
      alertify.success(`Success! <br> Total ${result.data.metadata.total} results matched search`)
    }
    catch (err) {
      let errMsg = err.response.data.message ? err.response.data.message : "Something went wrong.."
      template = handlebars.compile(templateNoResults)
      html = template()
      output.innerHTML = html
      return alertify.error(`${err.message} - No results found!`)
    }
    const n = 5
    const recommendations = result.data.results
    const topFiveRecs = recommendations.slice(0, n)
    
    template = handlebars.compile(templateRaw)
    html = template({ topFiveRecs })

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
