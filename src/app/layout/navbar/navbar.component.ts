import { Component } from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIconButton} from "@angular/material/button";

@Component({
    selector: 'app-navbar',
    imports: [
        MatToolbar,
        MatIcon,
        RouterLink,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        MatIconButton
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
