import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFormComponent } from './address-form.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {provideAnimations} from "@angular/platform-browser/animations";
import {CitiesService} from "../../../../api/cities/services/cities.service";
import {ICityModel} from "../../../../api/cities/models/i-city.model";
import {MatDialog} from "@angular/material/dialog";
import {of, throwError} from "rxjs";

describe('AddressFormComponent', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;
  let citiesService: CitiesService;
  let mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
  let dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

  const citiesData: ICityModel[] = [
    { id: 1, name: 'City 1', countryId: 1 },
    { id: 2, name: 'City 2', countryId: 2 }
  ];

  const countryValue = { id: 1, name: 'Country 1' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressFormComponent, HttpClientTestingModule],
      providers: [provideAnimations(), { provide: MatDialog, useValue: mockDialog },]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressFormComponent);

    citiesService = TestBed.inject(CitiesService);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should listen to country value changes and fetch cities', () => {
    spyOn(citiesService, 'getCitiesByCountryId').and.returnValue(of(citiesData));

    component.country = countryValue;
    component.listenToCountryValueChange();

    expect(citiesService.getCitiesByCountryId).toHaveBeenCalledWith(1);
  });

  it('should reset city when country changes', () => {
    component.cityId = 1;
    component.country = null;
    component.listenToCountryValueChange();

    expect(component.cityId).toBeNull();
  });

  it('should open the add city dialog', () => {
    component.country = countryValue;
    mockDialog.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of('New City'));

    component.openAddCityDialog();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should call get cities from api after closing add city dialog with new city name', () => {
    spyOn(citiesService, 'getCitiesByCountryId').and.returnValue(of(citiesData));

    component.country = countryValue;

    mockDialog.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of('New City'));

    component.openAddCityDialog();

    expect(citiesService.getCitiesByCountryId).toHaveBeenCalledWith(1);
  });

  it('should emit citiesOptionsChange after fetching cities', () => {
    spyOn(citiesService, 'getCitiesByCountryId').and.returnValue(of(citiesData));
    spyOn(component.citiesOptionsChange, 'emit');

    component.getCitiesByCountryId(1);

    expect(component.citiesOptions[1].length).toEqual(citiesData.length);
    expect(component.citiesOptionsChange.emit).toHaveBeenCalledWith(component.citiesOptions);
  });

  it('should emit citiesOptionsChange after fetching cities error', () => {
    spyOn(citiesService, 'getCitiesByCountryId').and.callFake(() => throwError(() => ''));
    spyOn(component.citiesOptionsChange, 'emit');

    component.getCitiesByCountryId(1);

    expect(component.citiesOptions[1].length).toEqual(0);
    expect(component.citiesOptionsChange.emit).toHaveBeenCalledWith(component.citiesOptions);
  });


  it('should set newly added city in form', () => {
    component.citiesOptions = { 1: citiesData };
    component.setNewlyAddedCityByName(1, 'City 1');

    expect(component.cityId).toBe(1);
  });

  it('should not set city if newly added city does not exist', () => {
    component.citiesOptions = { 1: citiesData };
    component.setNewlyAddedCityByName(1, 'City 3');

    expect(component.cityId).toBeFalsy();
  });

  it('should register value change subscription with ControlValueAccessor', () => {
    const onChangeFn = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeFn);

    component.street = 'New Street';
    component.updateValue();
    expect(onChangeFn).toHaveBeenCalledWith(component.gerFormValue());
  });

  it('should write form values using ControlValueAccessor', () => {
    const newValue = {
      name: 'name',
      country: countryValue,
      cityId: 1,
      street: 'New Street'
    };

    component.writeValue(newValue);

    expect(component.name).toEqual(newValue.name);
    expect(component.country).toEqual(newValue.country);
    expect(component.cityId).toEqual(newValue.cityId);
    expect(component.street).toEqual(newValue.street);
  });

  it('should register onTouched callback correctly', () => {
    const onTouchedSpy = jasmine.createSpy('onTouched');

    component.registerOnTouched(onTouchedSpy);
    component.onTouched();

    expect(onTouchedSpy).toHaveBeenCalled();
  });
});
