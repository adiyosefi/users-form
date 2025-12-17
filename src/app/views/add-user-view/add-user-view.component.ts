import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IUserFormModel} from "./models/i-user-form.model";
import {MatError, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatAnchor, MatButton} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {AddressFormComponent} from "./components/address-form/address-form.component";
import {ICountryModel} from "../../api/countries/models/i-country.model";
import {PersonService} from "../../api/persons/services/person.service";
import {IPersonModel} from "../../api/persons/models/i-person.model";
import {DatePipe} from "@angular/common";
import {ICityModel} from "../../api/cities/models/i-city.model";
import {addressValidator} from "./validators/address.validator";
import {IAddressFormValueModel} from "./models/i-address-form-value.model";

@Component({
  selector: 'app-add-user-view',
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatError,
    MatLabel,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatAnchor,
    MatButton,
    AddressFormComponent
  ],
  providers: [DatePipe],
  templateUrl: './add-user-view.component.html',
  styleUrl: './add-user-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUserViewComponent implements OnInit {
  // form
  userForm: FormGroup<IUserFormModel>;
  readonly maxDate = new Date();

  // address form data
  countries: ICountryModel[] = [];
  citiesOptions: Record<string, ICityModel[]> = {};

  constructor(private route: ActivatedRoute,
              private personService: PersonService,
              private datePipe: DatePipe,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getRouteData();
    this.initUsersForm();
  }

  getRouteData(): void {
    this.countries = this.route.snapshot.data.countries;
  }

  /* users form */
  initUsersForm(): void {
    this.userForm = new FormGroup<IUserFormModel>({
      name: new FormControl('', Validators.required),
      birthdate: new FormControl(null),
      addresses: new FormArray<FormControl<IAddressFormValueModel>>([this.createAddressFormControl()], addressValidator()) // at least one address
    });
  }

  onSubmit(): void {
    // handle form submission
    if (this.userForm.valid) {
      const newPerson: IPersonModel = this.mapUserFormValueToUser();
      this.personService.addPerson(newPerson).subscribe(() => this.navigateToUsersListPage())
    }
  }

  mapUserFormValueToUser(): IPersonModel {
    const formValue = this.userForm.value;
    return {
      id: null,
      name: formValue.name,
      birthdate: this.datePipe.transform(formValue.birthdate),
      addresses: formValue.addresses.map(address => ({
        name: address.name,
        countrId: address.country?.id,
        cityId: address.cityId,
        street: address.street
      }))
    };
  }

  /* users form - end */

  /* address form */
  createAddressFormControl(): FormControl<IAddressFormValueModel> {
    return new FormControl<IAddressFormValueModel>({
      name: '',
      country: null,
      cityId: null,
      street: ''
    },);
  }

  addAddress(): void {
    this.userForm.controls.addresses.push(this.createAddressFormControl());
  }

  removeAddress(index: number): void {
    if (this.userForm.controls.addresses.length > 1) {
      this.userForm.controls.addresses.removeAt(index);
    }
  }

  /* address form - end */

  navigateToUsersListPage(): void {
    this.router.navigate(['/list-of-users']);
  }
}
