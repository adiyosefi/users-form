import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule,} from "@angular/forms";
import {IAddressFormValueModel} from "../../models/i-address-form-value.model";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton} from "@angular/material/button";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ICountryModel} from "../../../../api/countries/models/i-country.model";
import {AddCityDialogComponent} from "../add-city-dialog/add-city-dialog.component";
import {finalize} from "rxjs";
import {ICityModel} from "../../../../api/cities/models/i-city.model";
import {CitiesService} from "../../../../api/cities/services/cities.service";

@Component({
    selector: 'app-address-form',
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
        { provide: NG_VALUE_ACCESSOR, useExisting: AddressFormComponent, multi: true }
    ],
    templateUrl: './address-form.component.html',
    styleUrl: './address-form.component.scss'
})
export class AddressFormComponent implements ControlValueAccessor {
  // inputs
  @Input() countriesOptions: ICountryModel[] = [];
  @Input() citiesOptions: Record<string, ICityModel[]> = {};

  // outputs
  @Output() citiesOptionsChange: EventEmitter<Record<string, ICityModel[]>> = new EventEmitter<Record<string, ICityModel[]>>();

  // form values
  name: string;
  country: ICountryModel;
  cityId: number;
  street: string;

  // ControlValueAccessor methods
  private onChange: (value: IAddressFormValueModel) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private dialog: MatDialog, private citiesService: CitiesService) {
  }

  /* control value accessor methods */
  writeValue(value: any): void {
    if (value) {
      this.name = value.name;
      this.country = value.country;
      this.cityId = value.cityId;
      this.street = value.street;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /* control value accessor methods - end */

  /* update value */
  updateValue(): void {
    this.onChange(this.gerFormValue());
  }

  gerFormValue(): IAddressFormValueModel {
    return {
      name: this.name,
      country: this.country,
      cityId: this.cityId,
      street: this.street,
    };
  }

  /* update value - end */

  /* add city dialog */
  openAddCityDialog() {
    if (this.country?.id) {
      // open dialog
      const dialogRef = this.dialog.open(AddCityDialogComponent, {
        width: '250px',
        data: {country: this.country}
      });
      // subscribe close
      this.afterCloseAddCityDialog(dialogRef);
    }
  }

  afterCloseAddCityDialog(dialogRef: MatDialogRef<AddCityDialogComponent, any>): void {
    dialogRef.afterClosed().subscribe(newCityName => {
      if (newCityName) {
        this.getCitiesByCountryId(this.country.id, newCityName); // on add city success, refresh cities array and update value to new city
      }
    });
  }

  /* add city dialog - end */

  /* country value change */
  listenToCountryValueChange(): void {
    this.cityId = null; // reset the city control
    this.country && !this.citiesOptions[this.country.id] &&
    this.getCitiesByCountryId(this.country.id); // fetch cities based on selected country

    this.updateValue();
  }

  getCitiesByCountryId(countryId: number, newlyAddedCityName?: string): void {
    this.citiesService.getCitiesByCountryId(countryId)
      .pipe(
        // enable or disable city if success or error
        finalize(() => {
          this.citiesOptionsChange.emit(this.citiesOptions);
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

  setNewlyAddedCityByName(countryId: number, newlyAddedCityName?: string): void {
    if (newlyAddedCityName) {
      this.cityId = this.citiesOptions[countryId].find(city => city.name === newlyAddedCityName)?.id; // set the city to the newly added one
    }
  }

  /* country value change - end */
}
