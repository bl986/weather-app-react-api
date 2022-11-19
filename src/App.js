import { useState } from 'react';
import Search from './components/search/search';
import Forecast from './components/forecast/forecast';
import CurrentWeather from './components/current-weather/current-weather';
import {WEATHER_API_URL, WEATHER_API_KEY} from './api';
import './App.css';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  /*every time you make a change in this search box (e.g. type something),
  this function should run */
  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(' '); //store the latitude and longitude here after splitting them with the space between

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    /*The Promise.all() method takes an iterable of promises as input and returns a single Promise.
    This returned promise fulfills when all of the input's promises fulfill (including when an empty iterable is passed),
    with an array of the fulfillment values. It rejects when any of the input's promises rejects, with this first rejection reason.*/
    Promise.all([currentWeatherFetch, forecastFetch])
    //get response
    .then(async (response) => {
      //mapping to json
      const weatherResponse = await response[0].json();
      const forecastResponse = await response[1].json();

      setCurrentWeather({ city: searchData.label, ...weatherResponse });
      setForecast({ city: searchData.label, ...forecastResponse });
    })
    //if the above failed, we do the following:
    .catch((err)=> console.log(err));
  }

  //console.log(currentWeather);
  //console.log(forecast);

  return (
    <div className="container">
      {/* search box here */}
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;