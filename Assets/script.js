var crrntForecastList = document.querySelector('.crrntForecast')
var crrntTime = document.querySelector('.crrntTime')
var crrntCity = document.querySelector('.crrntCity')
var crrntIcon = document.querySelector('.crrntIcon')
var searchHistory = document.querySelector('.searchHistory')
var searchForm = document.querySelector('#searchForm')
var apiKey = '4dfeaa8e4d8b33658167594ae2075063'

var searchValue
var searchResult
var iconID

var prevSearchResults = localStorage.getItem('prevSearchResults')
prevSearchResults = JSON.parse(prevSearchResults)
if (prevSearchResults == null) {
    console.log('No search History')
    prevSearchResults = []
}
console.log(prevSearchResults)

function searchByHistory() {
    var clckTrgt = event.target
    if (clckTrgt.classList.value == 'prevSearch') {
        searchForm.children[0].value = clckTrgt.textContent
        searchByCity()
    }
}

function searchByCity() {
    console.log(event)
    event.preventDefault()
    searchValue = searchForm.children[0].value
    fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + searchValue + '&units=imperial&appid=' + apiKey)
        .then ( response => {
            if (response.ok != true) {
                console.log(response)
                throw new Error('Location not found!')
            }
            return response.json()
        })
        .then ( data => {
            searchResult = data
            console.log(searchResult)
            console.log(prevSearchResults)
            populateForcast()
            if (prevSearchResults.includes(searchValue)) {
                prevSearchResults.push(prevSearchResults.splice( prevSearchResults.indexOf(searchValue), 1)[0])
            } else {
                prevSearchResults.push(searchValue)
            }
            localStorage.setItem('prevSearchResults', JSON.stringify(prevSearchResults))
            populatePrevSearches()
        })
    .catch(function(error){
        console.log(error)
        alert(error + '\nWe could not find: ' + '"' + searchValue + '"')
    })
}

function populateForcast() {    
    crrntForecastList.innerHTML = ''
    iconID = searchResult.list[0].weather[0].icon
    crrntIcon.src = `https://openweathermap.org/img/wn/${iconID}@2x.png`
    crrntCity.textContent = searchResult.city.name
    crrntTime.textContent = dayjs.utc(searchResult.list[0].dt_txt).local().format('MM/DD/YYYY hh:mm')
    crrntForecastList.appendChild(document.createElement("li")).textContent = 'Temperature: ' + searchResult.list[0].main.temp
    crrntForecastList.appendChild(document.createElement("li")).textContent = 'Feels like: ' + searchResult.list[0].main.feels_like
    crrntForecastList.appendChild(document.createElement("li")).textContent = 'Wind speed: ' + searchResult.list[0].wind.speed
    crrntForecastList.appendChild(document.createElement("li")).textContent = 'Humidity: ' + searchResult.list[0].main.humidity
    crrntForecastList.appendChild(document.createElement("li")).textContent = 'Chance of rain: ' + searchResult.list[0].pop
    var x = 1
    for (let i = 7; i < searchResult.list.length; i += 8) {
            const element = searchResult.list[i];
            var foreCastBlock = document.querySelector(`.fiveDayDate-${x}`)
            var fiveDayForecast = document.querySelector(`.fiveDay-${x}-Forecast`)
            fiveDayIcon = document.querySelector(`.fiveDayIcon-${x}`)
            fiveDayForecast.innerHTML = ''
            iconID = searchResult.list[i].weather[0].icon
            fiveDayIcon.src = `https://openweathermap.org/img/wn/${iconID}@2x.png`
            foreCastBlock.textContent = dayjs.utc(searchResult.list[i].dt_txt).local().format('MM/DD/YYYY hh:mm')
            fiveDayForecast.appendChild(document.createElement("li")).textContent = 'Temperature: ' + searchResult.list[i].main.temp
            fiveDayForecast.appendChild(document.createElement("li")).textContent = 'Feels like: ' + searchResult.list[i].main.feels_like
            fiveDayForecast.appendChild(document.createElement("li")).textContent = 'Wind speed: ' + searchResult.list[i].wind.speed
            fiveDayForecast.appendChild(document.createElement("li")).textContent = 'Humidity: ' + searchResult.list[i].main.humidity
            fiveDayForecast.appendChild(document.createElement("li")).textContent = 'Chance of rain: ' + searchResult.list[i].pop
            x++
        }
}

function populatePrevSearches(){
    searchHistory.innerHTML = ''
    for (let i = 0; i < prevSearchResults.length; i++) {
        const element = prevSearchResults[i];
        var listitem = document.createElement('li')
        listitem.classList.add('prevSearch')
        listitem.prepend(document.createTextNode(prevSearchResults[i]))
        searchHistory.prepend(listitem)
    }
}

onload = (event) => {
    searchForm.children[0].value = (prevSearchResults[prevSearchResults.length - 1])
    console.log(searchValue)
    searchByCity()
    searchForm.children[0].value = ''
}

populatePrevSearches()

searchHistory.addEventListener('click', searchByHistory)
searchForm.addEventListener('submit', searchByCity)