import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, of} from "rxjs";
import {inject} from "@angular/core";
import {CountriesService} from "../services/countries.service";
import {ICountryModel} from "../models/i-country.model";

export const countriesResolver: ResolveFn<ICountryModel[]> = (_route: ActivatedRouteSnapshot,
                                                             _state: RouterStateSnapshot): Observable<ICountryModel[]> => {
  return inject(CountriesService).getCountries().pipe(catchError(() => of([])));
};
