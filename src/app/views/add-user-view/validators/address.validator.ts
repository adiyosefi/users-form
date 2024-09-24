import {FormArray, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {IAddressFormValueModel} from "../models/i-address-form-value.model";

export function addressValidator(): ValidatorFn {
  return (addresses: FormArray<FormControl<IAddressFormValueModel>>): ValidationErrors | null => {

    if (!addresses) {
      return null;
    }

    let invalid = false;
    addresses.controls.forEach((addressControl) => {
      const addressControlValue = addressControl.value;

      if (!addressControlValue.name || !addressControlValue.street) {
        invalid = true;
      }
    });

    return invalid ? { addressFieldsRequired: true } : null;
  };
}
