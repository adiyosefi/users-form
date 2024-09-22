import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfUsersViewComponent } from './list-of-users-view.component';
import {ActivatedRoute} from "@angular/router";
import {provideAnimations} from "@angular/platform-browser/animations";
import {IPersonModel} from "../../api/persons/models/i-person.model";
import {By} from "@angular/platform-browser";
import {MatPaginator} from "@angular/material/paginator";

describe('ListOfUsersViewComponent', () => {
  let component: ListOfUsersViewComponent;
  let fixture: ComponentFixture<ListOfUsersViewComponent>;

  const personsData: IPersonModel[] = [
    {id: 0, name: 'name', birthdate: 'date', addresses: []}
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfUsersViewComponent],
      providers: [
        provideAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {data: {persons: personsData}}}
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfUsersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the table data from the route snapshot', () => {
    expect(component.persons.data.length).toEqual(personsData.length);
  });

  it('should set the paginator after view init', () => {
    const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance;
    expect(component.persons.paginator).toBe(paginator);
  });
});
