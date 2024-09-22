import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';
import {ICityModel} from "../models/i-city.model";

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private readonly apiUrl = `${apiConfig.rootApiUrl}/city`;

  constructor(private http: HttpClient) {}

  addCity(city: ICityModel): Observable<void> {
    return this.http.post<void>(this.apiUrl, city);
  }
}
