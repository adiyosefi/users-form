import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';
import {ICountryModel} from "../models/i-country.model";

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private readonly apiUrl = `${apiConfig.rootApiUrl}/countries`;

  constructor(private http: HttpClient) {}

  getCountries(): Observable<ICountryModel[]> {
    return this.http.get<ICountryModel[]>(this.apiUrl);
  }
}
