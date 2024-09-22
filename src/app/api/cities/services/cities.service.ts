import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';
import {ICityModel} from "../models/i-city.model";

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private readonly apiUrl = `${apiConfig.rootApiUrl}/cities`;

  constructor(private http: HttpClient) {}

  getCitiesByCountryId(countryId: number): Observable<ICityModel[]> {
    return this.http.get<ICityModel[]>(`${this.apiUrl}/${countryId}`);
  }
}
