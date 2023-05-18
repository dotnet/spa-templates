import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts: WeatherForecast[] = [];

  constructor(@Inject('BASE_URL') baseUrl: string) {
    fetch(baseUrl + 'weatherforecast').then(response => {
////#if (IndividualLocalAuth)
      if (response.redirected && response.url.startsWith(`${baseUrl}Identity/Account/Login`)) {
        window.location.href = `${baseUrl}Identity/Account/Login?ReturnUrl=/fetch-data`;
      }
////#endif
      return response.json();
    }).then(result => {
      this.forecasts = result;
    }, error => console.error(error));
  }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
