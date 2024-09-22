import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';
import {IPersonModel} from "../models/i-person.model";

@Injectable({
  providedIn: 'root',
})
export class PersonsService {
  private readonly apiUrl = `${apiConfig.rootApiUrl}/persons`;

  constructor(private http: HttpClient) {}

  getPersons(): Observable<IPersonModel[]> {
    return this.http.get<IPersonModel[]>(this.apiUrl);
  }
}
