import { Routes } from '@angular/router';
import {personsResolver} from "./api/persons/resolvers/persons.resolver";
import {countriesResolver} from "./api/countries/resolvers/countries.resolver";

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'list-of-users',
        pathMatch: 'full'
      },
      {
        path: 'list-of-users',
        loadComponent: () => import('./views/list-of-users-view/list-of-users-view.component').then(c => c.ListOfUsersViewComponent),
        resolve: {
          persons: personsResolver
        }
      },
      {
        path: 'add-user',
        loadComponent: () => import('./views/add-user-view/add-user-view.component').then(c => c.AddUserViewComponent),
        resolve: {
          countries: countriesResolver
        }
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/list-of-users',
  },
];
