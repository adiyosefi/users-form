import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';
import {IPersonModel} from "../models/i-person.model";

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private readonly apiUrl = `${apiConfig.rootApiUrl}/person`;

  constructor(private http: HttpClient) {}

  addPerson(person: IPersonModel): Observable<void> {
    return this.http.post<void>(this.apiUrl, person);
  }
}
