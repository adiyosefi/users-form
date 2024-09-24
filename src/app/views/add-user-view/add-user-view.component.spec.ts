import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserViewComponent } from './add-user-view.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ActivatedRoute, Router} from "@angular/router";
import {provideNativeDateAdapter} from "@angular/material/core";
import {provideAnimations} from "@angular/platform-browser/animations";
import {ICountryModel} from "../../api/countries/models/i-country.model";
import {PersonService} from "../../api/persons/services/person.service";
import {of} from "rxjs";

describe('AddUserViewComponent', () => {
  let component: AddUserViewComponent;
  let fixture: ComponentFixture<AddUserViewComponent>;
  let personService: PersonService;
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  const countriesData: ICountryModel[] = [
    {id: 0, name: 'name'}
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserViewComponent, HttpClientTestingModule],
      providers: [
        provideNativeDateAdapter(),
        provideAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {data: {countries: countriesData}}},
        },
        { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserViewComponent);

    personService = TestBed.inject(PersonService);
    spyOn(personService, 'addPerson').and.returnValue(of(null));

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the user form on component init', () => {
    expect(component.userForm).toBeDefined();
    expect(component.userForm.controls.name).toBeDefined();
    expect(component.userForm.controls.birthdate).toBeDefined();
    expect(component.userForm.controls.addresses).toBeDefined();
  });

  it('should initialize countries from route data', () => {
    expect(component.countries.length).toEqual(countriesData.length);
  });

  it('should add an address form group', () => {
    const initialAddressCount = component.userForm.controls.addresses.length;
    component.addAddress();
    expect(component.userForm.controls.addresses.length).toBe(initialAddressCount + 1);
  });

  it('should remove an address form group', () => {
    component.addAddress();
    const initialAddressCount = component.userForm.controls.addresses.length;
    component.removeAddress(1);
    expect(component.userForm.controls.addresses.length).toBe(initialAddressCount - 1);
  });

  it('should not remove the last address form group', () => {
    component.removeAddress(0);
    expect(component.userForm.controls.addresses.length).toBe(1); // minimum of 1 address
  });

  it('should submit the form if valid and call add person api', () => {
    component.userForm.controls.name.setValue('John Doe');
    component.userForm.controls.birthdate.setValue(new Date('1990-01-01'));
    component.userForm.controls.addresses.controls[0].setValue({name: 'Home', street: '123 Main St'});

    component.onSubmit();

    expect(personService.addPerson).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/list-of-users']);
  });

  it('should not submit the form if invalid', () => {
    component.userForm.controls.name.setValue('');
    component.onSubmit();
    expect(personService.addPerson).not.toHaveBeenCalled();
  });
});
