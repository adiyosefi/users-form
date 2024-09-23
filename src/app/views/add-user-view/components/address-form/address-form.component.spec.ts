import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFormComponent } from './address-form.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormControl, FormGroup} from "@angular/forms";
import {IAddressFormModel} from "../../models/i-address-form.model";
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

  const mockAddressForm = new FormGroup<IAddressFormModel>({
    name: new FormControl(''),
    country: new FormControl(null),
    cityId: new FormControl(null),
    street: new FormControl(''),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressFormComponent, HttpClientTestingModule],
      providers: [provideAnimations(), { provide: MatDialog, useValue: mockDialog },]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressFormComponent);

    citiesService = TestBed.inject(CitiesService);

    component = fixture.componentInstance;

    component.addressForm = mockAddressForm;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should listen to country value changes and fetch cities', () => {
    spyOn(citiesService, 'getCitiesByCountryId').and.returnValue(of(citiesData));
    const countryValue = { id: 1, name: 'Country 1' };

    component.listenToCountryValueChange();
    component.addressForm.controls.country.setValue(countryValue);

    expect(citiesService.getCitiesByCountryId).toHaveBeenCalledWith(1);
  });

  it('should reset city when country changes', () => {
    component.listenToCountryValueChange();
    component.addressForm.controls.cityId.setValue(1);
    component.addressForm.controls.country.setValue(null);

    expect(component.addressForm.controls.cityId.value).toBeNull();
    expect(component.addressForm.controls.cityId.disabled).toBeTrue();
  });

  it('should enable cityId if cities exist', () => {
    component.enableDisableCityIfCitiesOptionsExist(citiesData);
    expect(component.addressForm.controls.cityId.enabled).toBeTrue();
  });

  it('should disable cityId if no cities exist', () => {
    component.enableDisableCityIfCitiesOptionsExist([]);
    expect(component.addressForm.controls.cityId.disabled).toBeTrue();
  });

  it('should open the add city dialog', () => {
    mockDialog.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of('New City'));

    component.openAddCityDialog();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should call get cities from api after closing add city dialog with new city name', () => {
    spyOn(citiesService, 'getCitiesByCountryId').and.returnValue(of(citiesData));

    const countryValue = { id: 1, name: 'Country 1' };
    component.addressForm.controls.country.setValue(countryValue);

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

    expect(component.addressForm.controls.cityId.value).toBe(1);
  });

  it('should not set city if newly added city does not exist', () => {
    component.citiesOptions = { 1: citiesData };
    component.setNewlyAddedCityByName(1, 'City 3');

    expect(component.addressForm.controls.cityId.value).toBeFalsy();
  });

  it('should register value change subscription with ControlValueAccessor', () => {
    const onChangeFn = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeFn);

    component.addressForm.controls.street.setValue('New Street');
    expect(onChangeFn).toHaveBeenCalledWith(component.addressForm.value);
  });

  it('should write form values using ControlValueAccessor', () => {
    const newValue = {
      name: 'name',
      country: { id: 1, name: 'Country 1' },
      cityId: 1,
      street: 'New Street'
    };

    component.writeValue(newValue);

    expect(component.addressForm.getRawValue()).toEqual(newValue);
  });

  it('should disable the form controls if setDisabledState is called with true', () => {
    spyOn(component.addressForm, 'disable').and.callThrough();
    component.setDisabledState(true);
    expect(component.addressForm.disable).toHaveBeenCalled();
  });

  it('should enable the form controls if setDisabledState is called with false', () => {
    spyOn(component.addressForm, 'enable').and.callThrough();
    component.setDisabledState(false);
    expect(component.addressForm.enable).toHaveBeenCalled();
  });

  it('should register onTouched callback correctly', () => {
    const onTouchedSpy = jasmine.createSpy('onTouched');

    component.registerOnTouched(onTouchedSpy);
    component.onTouched();

    expect(onTouchedSpy).toHaveBeenCalled();
  });
});
