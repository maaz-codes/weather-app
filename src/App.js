import React, { useEffect, useState } from "react";
import "./App.css";

const api_key = "f93d7509f76d507aaddd1ee8f75e64b8";

export default function App() {

  const [query, setQuery] = useState("London");
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [weather, setWeather] = useState("");
  const [description, setDescription] = useState("");
  const [wind, setWind] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [visibility, setVisibility] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect( () => {
    const controller = new AbortController();

    async function fetchWeather() {

      try {
        setError('');
        setIsLoading(true);
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api_key}`, { signal: controller.signal });
        
        if (!res.ok) throw new Error("Something went wrong with fetching weather");
        const data = await res.json();
        console.log(data.main.temp);
        
        if(data.Response === "False") throw new Error("City not found!");
        
        setTemperature(data.main.temp);
        setCity(data.name);
        setWeather(data.weather[0].main);
        setDescription(data.weather[0].description);
        setWind(data.wind.speed);
        setHumidity(data.main.humidity);
        setVisibility((data.visibility)/1000);

        setError('');
      } catch (err) {
        console.error(err.message);

        if(err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    if(query.length < 3) {
      setError('');
      setIsLoading(false);
      return;
    }
    fetchWeather();
    
    return function () {
      controller.abort();
    }

  }, [query])

  return (
    <div className="App">
      <CityName>{city}</CityName>
      <CurrentDate />
      {
        isLoading ? <Loading /> : <Weather weather={weather} temperature={temperature} description={description} />
      }
      <WeatherElements wind={wind} humidity={humidity} visibility={visibility} />
      <Search query={query} setQuery={setQuery}/>
    </div>
  );
}

function Loading() {
  return(
    <div className="loading">
      <h1>Loading...</h1>
    </div>
  );
}

function CityName({ children }) {
  return(
    <h1 className="city-name">{children}</h1>
  );
}

function CurrentDate() {
  const date = new Date();
  const currentDate = String(date).slice(0,15);

  return(
    <div className="date">
      <p>{currentDate}</p>
    </div>
  );
}

function Weather({ weather, temperature, description }) {
  return(
    <div className="weather">
      <h4>{weather}</h4>
      <div className="temperature">{Math.round(temperature-273)}°C</div>
      <div className="weather-summary">
        <h3>Overview</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function WeatherElements({ wind, humidity, visibility }) {
  return(
    <div className="weather-elements">
      <div>
        <span><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256"><path d="M184,184a32,32,0,0,1-32,32c-13.7,0-26.95-8.93-31.5-21.22a8,8,0,0,1,15-5.56C137.74,195.27,145,200,152,200a16,16,0,0,0,0-32H40a8,8,0,0,1,0-16H152A32,32,0,0,1,184,184Zm-64-80a32,32,0,0,0,0-64c-13.7,0-26.95,8.93-31.5,21.22a8,8,0,0,0,15,5.56C105.74,60.73,113,56,120,56a16,16,0,0,1,0,32H24a8,8,0,0,0,0,16Zm88-32c-13.7,0-26.95,8.93-31.5,21.22a8,8,0,0,0,15,5.56C193.74,92.73,201,88,208,88a16,16,0,0,1,0,32H32a8,8,0,0,0,0,16H208a32,32,0,0,0,0-64Z"></path></svg></span>
        <h4>{Math.round(wind*10)/10}km/h</h4>
        <p>Wind</p>
      </div>
      
      <div>
        <span><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256"><path d="M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75ZM128,216a72.08,72.08,0,0,1-72-72c0-57.23,55.47-105,72-118,16.53,13,72,60.75,72,118A72.08,72.08,0,0,1,128,216Zm55.89-62.66a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z"></path></svg></span>
        <h4>{humidity}%</h4>
        <p>Humidity</p>
      </div>

      <div>
        <span><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg></span>
        <h4>{visibility}km</h4>
        <p>Visibility</p>
      </div>
    </div>
  ); 
}

function Search({query, setQuery}) {

  return(
    <input 
      type="text" 
      className="search" 
      placeholder="city name"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onClick={() => {}}
      />
  );
}