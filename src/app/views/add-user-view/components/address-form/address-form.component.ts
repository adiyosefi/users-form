import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import {IAddressFormModel} from "../../models/i-address-form.model";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton} from "@angular/material/button";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ICountryModel} from "../../../../api/countries/models/i-country.model";
import {AddCityDialogComponent} from "../add-city-dialog/add-city-dialog.component";
import {finalize, Subject, takeUntil} from "rxjs";
import {ICityModel} from "../../../../api/cities/models/i-city.model";
import {CitiesService} from "../../../../api/cities/services/cities.service";

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    FormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatButton
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: AddressFormComponent, multi: true}
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent implements OnInit, OnDestroy, ControlValueAccessor {
  // inputs
  @Input() addressForm: FormGroup<IAddressFormModel>;
  @Input() countriesOptions: ICountryModel[] = [];
  @Input() citiesOptions: Record<string, ICityModel[]> = {};

  // outputs
  @Output() citiesOptionsChange: EventEmitter<Record<string, ICityModel[]>> = new EventEmitter<Record<string, ICityModel[]>>();

  private onTouchedCallback: () => void = () => {};

  // unsubscribe
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private dialog: MatDialog, private citiesService: CitiesService) {
  }

  ngOnInit(): void {
    this.listenToCountryValueChange();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /* control value accessor methods */
  registerOnChange(fn: (v: any) => void): void {
    this.addressForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.addressForm.disable() : this.addressForm.enable();
  }

  writeValue(value: any): void {
    if (value) {
      this.addressForm.patchValue(value);
    }
  }

  // called when any form field loses focus (blur event)
  onTouched(): void {
    this.onTouchedCallback();
  }
  /* control value accessor methods - end */

  /* add city dialog */
  openAddCityDialog() {
    // open dialog
    const dialogRef = this.dialog.open(AddCityDialogComponent, {
      width: '250px',
      data: {country: this.addressForm.controls.country.value}
    });
    // subscribe close
    this.afterCloseAddCityDialog(dialogRef);
  }

  afterCloseAddCityDialog(dialogRef: MatDialogRef<AddCityDialogComponent, any>): void {
    dialogRef.afterClosed().subscribe(newCityName => {
      if (newCityName) {
        this.getCitiesByCountryId(this.addressForm.controls.country.value.id, newCityName); // on add city success, refresh cities array and update value to new city
      }
    });
  }
  /* add city dialog - end */

  /* country value change */
  listenToCountryValueChange(): void {
    this.addressForm.controls.country.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(countryValue => {
      this.addressForm.controls.cityId.reset(); // reset the city control
      countryValue ?
        this.getCitiesByCountryIdAndEnable(countryValue.id) : // fetch cities based on selected country
        this.addressForm.controls.cityId.disable() // disable cityId if no country
    });
  }

  getCitiesByCountryIdAndEnable(countryId: number): void {
    !this.citiesOptions[countryId] ?
      this.getCitiesByCountryId(countryId) :
      this.enableDisableCityIfCitiesOptionsExist(this.citiesOptions[countryId]);
  }

  getCitiesByCountryId(countryId: number, newlyAddedCityName?: string): void {
    this.citiesService.getCitiesByCountryId(countryId)
      .pipe(
        // enable or disable city if success or error
        finalize(() => {
          this.citiesOptionsChange.emit(this.citiesOptions);
          this.enableDisableCityIfCitiesOptionsExist(this.citiesOptions[countryId]);
        }),
      )
      .subscribe({
      next: cities => {
        this.citiesOptions[countryId] = cities;
        this.setNewlyAddedCityByName(countryId, newlyAddedCityName);
      },
      error: () => this.citiesOptions[countryId] = [],
    })
  }

  enableDisableCityIfCitiesOptionsExist(cities: ICityModel[]): void {
    cities.length ?
      this.addressForm.controls.cityId.enable() : // enable cityId when cities options has values
      this.addressForm.controls.cityId.disable(); // disable cityId if no cities
  }

  setNewlyAddedCityByName(countryId: number, newlyAddedCityName?: string): void {
    if (newlyAddedCityName) {
      const newCityId = this.citiesOptions[countryId].find(city => city.name === newlyAddedCityName)?.id;
      this.addressForm.controls.cityId.setValue(newCityId); // set the city to the newly added one
    }
  }
  /* country value change - end */
}
