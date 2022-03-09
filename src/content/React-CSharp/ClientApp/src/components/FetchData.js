import React from 'react';
import { useState, useEffect } from 'react';
////#if (IndividualLocalAuth)
import authService from './api-authorization/AuthorizeService'
////#endif

export function FetchData() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(async () => {
    populateWeatherData();
  }, [])
  
  const populateWeatherData = async () => {
    ////#if (IndividualLocalAuth)
    const token = await authService.getAccessToken();
    const response = await fetch('weatherforecast', {
      headers: !token ? {} : {'Authorization': `Bearer ${token}`}
    });
    ////#else
    const response = await fetch('weatherforecast');
    ////#endif
    const data = await response.json();
    setForecasts(data);
    setLoading(false);
  };

  const renderForecastsTable = (forecasts) => {
    return (
      <table className='table table-striped' aria-labelledby="tableLabel">
        <thead>
        <tr>
          <th>Date</th>
          <th>Temp. (C)</th>
          <th>Temp. (F)</th>
          <th>Summary</th>
        </tr>
        </thead>
        <tbody>
        {forecasts.map(forecast =>
          <tr key={forecast.date}>
            <td>{forecast.date}</td>
            <td>{forecast.temperatureC}</td>
            <td>{forecast.temperatureF}</td>
            <td>{forecast.summary}</td>
          </tr>
        )}
        </tbody>
      </table>
    );
  }

  let contents = loading
      ? <p><em>Loading...</em></p>
      : renderForecastsTable(forecasts);

  return (
    <div>
      <h1 id="tableLabel">Weather forecast</h1>
      <p>This component demonstrates fetching data from the server.</p>
      {contents}
    </div>
  );
}