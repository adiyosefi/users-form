import {FormControl} from "@angular/forms";
import {ICountryModel} from "../../../api/countries/models/i-country.model";

export interface IAddressFormModel {
  name: FormControl<string>;
  country: FormControl<ICountryModel>;
  cityId: FormControl<number>;
  street: FormControl<string>;
}
