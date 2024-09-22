import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {IPersonModel} from "../models/i-person.model";
import {catchError, Observable, of} from "rxjs";
import {inject} from "@angular/core";
import {PersonsService} from "../services/persons.service";

export const personsResolver: ResolveFn<IPersonModel[]> = (_route: ActivatedRouteSnapshot,
                                                           _state: RouterStateSnapshot): Observable<IPersonModel[]> => {
  return inject(PersonsService).getPersons().pipe(catchError(() => of([])));
};
