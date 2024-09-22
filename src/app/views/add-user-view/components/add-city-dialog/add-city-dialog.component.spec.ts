import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddCityDialogComponent} from './add-city-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {provideAnimations} from "@angular/platform-browser/animations";
import {CityService} from "../../../../api/cities/services/city.service";
import {of} from "rxjs";

describe('AddCityDialogComponent', () => {
  let component: AddCityDialogComponent;
  let fixture: ComponentFixture<AddCityDialogComponent>;
  let cityService: CityService;

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCityDialogComponent, HttpClientTestingModule],
      providers: [
        {provide: MatDialogRef, useValue: mockDialogRef}, {
          provide: MAT_DIALOG_DATA,
          useValue: {country: {id: 0, name: 'countryName'}},
        },
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddCityDialogComponent);

    cityService = TestBed.inject(CityService);
    spyOn(cityService, 'addCity').and.returnValue(of(null));

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    component.ngOnInit();
    expect(component.cityForm).toBeTruthy();
    expect(component.cityForm.controls.cityName).toBeTruthy();
    expect(component.cityForm.controls.cityName.valid).toBeFalse(); // initially invalid
  });

  it('should add city and close the dialog on valid form save', () => {
    component.cityForm.controls.cityName.setValue('New City');

    component.onSave();

    expect(cityService.addCity).toHaveBeenCalledWith({
      id: null,
      name: 'New City',
      countryId: 0,
    });
    expect(mockDialogRef.close).toHaveBeenCalledWith('New City');
  });

  it('should not add city if the form is invalid', () => {
    component.onSave();

    expect(cityService.addCity).not.toHaveBeenCalled();
  });

  it('should close the dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
