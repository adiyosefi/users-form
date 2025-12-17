import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {IPersonModel} from "../../api/persons/models/i-person.model";
import {MatAnchor} from "@angular/material/button";
import {ActivatedRoute, RouterLink} from "@angular/router";

@Component({
    selector: 'app-list-of-users-view',
    imports: [
        MatTable,
        MatHeaderCell,
        MatColumnDef,
        MatHeaderRow,
        MatPaginator,
        MatCell,
        MatCellDef,
        MatHeaderCellDef,
        MatRow,
        MatRowDef,
        MatHeaderRowDef,
        MatAnchor,
        RouterLink
    ],
    templateUrl: './list-of-users-view.component.html',
    styleUrl: './list-of-users-view.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListOfUsersViewComponent implements OnInit, AfterViewInit {
  // table data
  persons = new MatTableDataSource<IPersonModel>([]);

  // table
  readonly displayedColumns: string[] = ['id', 'name', 'birthdate', 'addresses'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.persons.data = this.route.snapshot.data.persons;
  }

  ngAfterViewInit(): void {
    this.persons.paginator = this.paginator;
  }
}
