import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; 

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoadingComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }
}
//autor:Daniela Marbella Peña Rangel