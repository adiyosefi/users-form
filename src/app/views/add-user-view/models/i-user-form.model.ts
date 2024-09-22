import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {IAddressFormModel} from "./i-address-form.model";

export interface IUserFormModel {
  name: FormControl<string>;
  birthdate: FormControl<Date>;
  addresses: FormArray<FormGroup<IAddressFormModel>>;
}
