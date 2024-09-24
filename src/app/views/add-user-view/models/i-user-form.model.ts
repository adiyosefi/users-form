import {FormArray, FormControl} from "@angular/forms";
import {IAddressFormValueModel} from "./i-address-form-value.model";

export interface IUserFormModel {
  name: FormControl<string>;
  birthdate: FormControl<Date>;
  addresses: FormArray<FormControl<IAddressFormValueModel>>;
}
