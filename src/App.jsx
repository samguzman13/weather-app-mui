// src/App.jsx
import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import axios from "axios";
import SearchField from "./componets/SearchField";
import CurrentWeather from "./componets/CurrentWeather";
import Forecast from "./componets/Forecast";
import { Box } from "@mui/material";


const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [coords, setCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  console.log ("API Key:", apiKey)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => console.error("Geolocation error:", error)
    );
  }, []);

  useEffect(() => {
    if (coords) {
      fetchWeatherByCoords(coords.lat, coords.lon);
    }
  }, [coords]);

  const fetchWeatherByCoords = async (lat, lon) => {
    const resCurrent = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const resForecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    setWeather(resCurrent.data);
    setForecast(filterDailyForecast(resForecast.data.list));
  };

  const fetchWeatherByCity = async () => {
    const geoRes = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    if (geoRes.data.length > 0) {
      const { lat, lon } = geoRes.data[0];
      fetchWeatherByCoords(lat, lon);
    }
  };

  const fetchCitySuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    const res = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    );
    const names = res.data.map(
      (c) => `${c.name}${c.state ? ", " + c.state : ""}, ${c.country}`
    );
    setSuggestions(names);
  };

  const filterDailyForecast = (list) => {
    const days = {};
    list.forEach((entry) => {
      const date = new Date(entry.dt_txt);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
      if (!days[day] && date.getHours() === 12) {
        days[day] = entry;
      }
    });
    return Object.values(days).slice(0, 4);
  };
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f0f4f8',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          bgcolor: '#fff',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Weather App
        </Typography>
        <SearchField
          city={city}
          setCity={setCity}
          fetchWeatherByCity={fetchWeatherByCity}
          suggestions={suggestions}
          fetchCitySuggestions={fetchCitySuggestions}
        />
        {weather && <CurrentWeather weather={weather} />}
        {forecast.length > 0 && <Forecast forecast={forecast} />}
      </Container>
    </Box>
  );
  
};

export default App;