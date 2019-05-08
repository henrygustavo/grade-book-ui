import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']

})
export class DashBoardComponent implements OnInit {

  constructor(private _menuService: MenuService) {

  }

  ngOnInit(): void {

    this._menuService.selectMenuItem('dashboard');

  }
}
