export interface IPersonModel {
  id: number;
  name: string;
  birthdate: string;
  addresses: IAddressModel[]
}

export interface IAddressModel {
  name: string;
  countrId: number;
  cityId: number;
  street: string;
}
