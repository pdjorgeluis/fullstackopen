import { useEffect, useState } from 'react'
import countrieService from './services/countries'

const CountryInput = ( {value, onInputChange} ) => {
  return(
    <div>
      find countries<input value={value} onChange={onInputChange}/>     
    </div>
  )
}

const Countries = ({ countriesToShow, onButtonClick, weather, icon }) => {
  if( countriesToShow.length > 10 || !countriesToShow.length)
    return <p>Too many matches, specify another filter</p>
  else if ( countriesToShow.length === 1) {
    return (
      <div>
        <h1>{countriesToShow[0].name.official}</h1>
        <p>capital {countriesToShow[0].capital} <br/>
        area {countriesToShow[0].area}</p>
        <h3>languages</h3>
        <ul>
          {Object.keys(countriesToShow[0].languages).map(key => <li key={key}>{countriesToShow[0].languages[key]}</li>)}
        </ul>
        <img src={countriesToShow[0].flags.png}></img>

        <h2>Wather in {countriesToShow[0].capital}</h2>
        <p>temperature {weather.temperature} Celcius</p>
        <img src={`${icon}/${weather.icon}@2x.png`}></img>
        <p>wind {weather.wind} m/s</p>
      </div>
    )
  }
  else{
    return (
      <ul>
        {countriesToShow.map(country => 
        <li key={country.cca2}>{country.name.official} <button onClick={() => onButtonClick(country)}>show</button></li>)}
      </ul>
    )
  }
}



const App = () => {
const [countries, setCountries] = useState([])
const [countryFilter, setCountryFilter] = useState('')
const [weather, setWeather] = useState({temperature: '', icon: '', wind: ''})

const iconUrl = 'https://openweathermap.org/img/wn/'

useEffect(() => {
  countrieService
    .getAll()
    .then(initialCountries => setCountries(initialCountries))
},[])

useEffect(() => {
  if(countriesToShow.length)
  {
    countrieService
    .getWeather(countriesToShow[0].capital)
    .then(data => {
      const newWeather = {
        temperature: data.main.temp,
        icon: data.weather[0].icon,
        wind: data.wind.speed
      }
      setWeather(newWeather)
    })
    .catch(error => console.log(error.response.data.error))
  }
  
}, [countryFilter])

const handleCountryInputChange = (event) => {
  setCountryFilter(event.target.value)
}

const handleButtonClick = (country) => {
  setCountryFilter(country.name.official)
  getTheWeather(country.capital)
}

const getTheWeather = (capital) => {
  countrieService
    .getWeather(capital)
    .then(data => {
      const newWeather = {
        temperature: data.main.temp,
        icon: data.weather.icon,
        wind: data.wind.speed
      }
      setWeather(newWeather)
    })
    .catch(error => console.log(error.response.data.error))
}

const countriesToShow = countryFilter === '' ? [] : countries.filter(country => country.name.official.toLowerCase().includes(countryFilter.toLowerCase()));
//if(countriesToShow.length) getTheWeather(countriesToShow[0].capital) //Check this. consider useEffect


  return (
    <div>
      <CountryInput value={countryFilter} onInputChange={handleCountryInputChange}/>
      <Countries countriesToShow={countriesToShow} onButtonClick={handleButtonClick} weather={weather} icon={iconUrl}/>
      
    </div>
  )
}

export default App
