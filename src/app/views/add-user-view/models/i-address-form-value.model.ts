import {ICountryModel} from "../../../api/countries/models/i-country.model";

export interface IAddressFormValueModel {
  name: string;
  country?: ICountryModel;
  cityId?: number;
  street: string;
}
