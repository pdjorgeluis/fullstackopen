import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
//const wKey = '7582a4d87d3f9518c04952887c558df3'
const wKey = import.meta.env.VITE_SOME_KEY

//const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${wKey}&units=metric`

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getWeather =(capital) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${wKey}&units=metric`
    const request =axios.get(weatherUrl)
    return request.then(response => response.data)
}

export default { getAll, getWeather }