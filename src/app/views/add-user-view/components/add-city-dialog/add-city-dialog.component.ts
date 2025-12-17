import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {ICityFormModel} from "../../models/i-city-form.model";
import {ICountryModel} from "../../../../api/countries/models/i-country.model";
import {CityService} from "../../../../api/cities/services/city.service";
import {ICityModel} from "../../../../api/cities/models/i-city.model";

@Component({
    selector: 'app-add-city-dialog',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        MatDialogActions,
        MatButton
    ],
    templateUrl: './add-city-dialog.component.html',
    styleUrl: './add-city-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCityDialogComponent implements OnInit {
  cityForm: FormGroup<ICityFormModel>;

  constructor(
    private dialogRef: MatDialogRef<AddCityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { country: ICountryModel },
    private cityService: CityService
  ) {
  }

  ngOnInit(): void {
    this.initCityForm();
  }

  /* city form */
  initCityForm(): void {
    this.cityForm = new FormGroup<ICityFormModel>({
      cityName: new FormControl('', Validators.required)
    });
  }

  onSave(): void {
    if (this.cityForm.valid) {
      const newCity: ICityModel = {
        id: null,
        name: this.cityForm.controls.cityName.value,
        countryId: this.data.country.id
      };
      this.cityService.addCity(newCity).subscribe(() => this.dialogRef.close(newCity.name))
    }
  }

  /* city form - end */

  onCancel(): void {
    this.dialogRef.close();
  }
}
